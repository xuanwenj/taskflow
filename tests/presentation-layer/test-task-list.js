// Stage 3.2 checks. Real-data tests (T18-T22) load the unchanged dashboard and
// compare it with a read-only Firestore query made independently of the app.
// State tests (T23-T25) drive the real view with controlled task sources.
import { db } from "../../firebase.js";
import {
  collection,
  getDocs,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";
import { createTaskListView, countTasks } from "../../taskListView.js";

const PAGE_URL = "../../index.html";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const results = [];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertEqual(actual, expected, label) {
  assert(actual === expected, `${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

async function runTest(id, scenario, expected, testFn) {
  const result = { id, scenario, expected, actual: "", status: "Fail" };
  try {
    result.actual = await testFn();
    result.status = "Pass";
  } catch (error) {
    result.actual = error.message;
    result.status = error.blocked ? "Blocked" : "Fail";
  }
  results.push(result);
  const line = `${result.id} [${result.status}] ${result.scenario}\n  Expected: ${result.expected}\n  Actual: ${result.actual}`;
  console.log(line);
  document.getElementById("output").textContent += `${line}\n\n`;
}

function addFrame(label) {
  const wrapper = document.createElement("div");
  wrapper.className = "preview";
  wrapper.innerHTML = `<strong>${label}</strong>`;
  const frame = document.createElement("iframe");
  wrapper.append(frame);
  document.getElementById("previews").append(wrapper);
  return frame;
}

const onLoad = (frame) =>
  new Promise((resolve) => frame.addEventListener("load", resolve, { once: true }));

// Real dashboard (index.html with app.js), served unchanged
async function loadRealDashboard() {
  const frame = addFrame("Real dashboard (real Firestore data)");
  frame.src = PAGE_URL;
  await onLoad(frame);
  const doc = frame.contentDocument;
  for (let i = 0; i < 200; i++) {
    if (doc.getElementById("list-state").hidden === false && doc.getElementById("list-state").classList.contains("list-state--loading")) {
      await wait(100);
    } else if (doc.querySelectorAll("#task-rows tr").length > 0 || !doc.getElementById("list-state").hidden) {
      break;
    } else {
      await wait(100);
    }
  }
  frame.style.height = `${doc.documentElement.scrollHeight}px`;
  return frame;
}

// Dashboard markup without app.js, so a controlled task source can drive the view
async function loadStubDashboard(label) {
  const html = (await (await fetch(PAGE_URL)).text())
    .replace(/<script[^>]*src="app\.js"[^>]*><\/script>/, "")
    .replace("<head>", '<head><base href="../../">');
  const frame = addFrame(label);
  frame.srcdoc = html;
  await onLoad(frame);
  await wait(200);
  return { frame, doc: frame.contentDocument, view: createTaskListView(frame.contentDocument) };
}

// Independent read of the stored tasks (read-only)
async function readStoredTasks() {
  const snapshot = await getDocs(collection(db, "tasks"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

function expectedDueText(dueDate) {
  if (dueDate === null || dueDate === undefined) return "No due date";
  const date = dueDate.toDate();
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

const rowsOf = (doc) => [...doc.querySelectorAll("#task-rows tr")];
const countsOf = (doc) => [
  doc.getElementById("count-total").textContent,
  doc.getElementById("count-in-progress").textContent,
  doc.getElementById("count-completed").textContent,
];

const sampleTasks = [
  { id: "s1", title: "Stub one", status: "To Do", dueDate: null },
  { id: "s2", title: "Stub two", status: "In Progress", dueDate: new Date(2026, 0, 5) },
  { id: "s3", title: "Stub three", status: "Completed", dueDate: new Date(2026, 0, 6) },
  { id: "s4", title: "Stub four", status: "Completed", dueDate: new Date(2026, 0, 7) },
  { id: "s5", title: "Stub five", status: "To Do", dueDate: new Date(2026, 0, 8) },
];

async function runAll() {
  document.getElementById("output").textContent = "";
  document.getElementById("previews").replaceChildren();
  results.length = 0;

  let stored = [];
  let realFrame = null;
  let loadError = null;
  try {
    stored = await readStoredTasks();
    realFrame = await loadRealDashboard();
  } catch (error) {
    loadError = error;
  }
  const realDoc = () => {
    if (loadError || !realFrame) {
      const e = new Error(`Blocked: could not load real data (${loadError?.message}).`);
      e.blocked = true;
      throw e;
    }
    return realFrame.contentDocument;
  };

  await runTest(
    "T18",
    "Real tasks are loaded through the Application Layer and displayed",
    "One row per stored task (same ids) from getTasks(); only the Application Layer is imported by the Presentation Layer.",
    async () => {
      const doc = realDoc();
      const rows = rowsOf(doc);
      assert(stored.length > 0, "Firestore returned no tasks to compare against.");
      assertEqual(rows.length, stored.length, "Row count");
      const shown = rows.map((r) => r.dataset.taskId).sort();
      const expectedIds = stored.map((t) => t.id).sort();
      assert(JSON.stringify(shown) === JSON.stringify(expectedIds), "Displayed task ids differ from the stored ids.");
      assert(doc.getElementById("list-state").hidden, "A list state message is still visible.");

      const names = realFrame.contentWindow.performance.getEntriesByType("resource").map((e) => e.name);
      assert(names.some((n) => n.endsWith("/services/taskAppService.js")), "services/taskAppService.js was not loaded.");

      const sources = {};
      for (const file of ["app.js", "taskListView.js"]) {
        sources[file] = await (await fetch(`../../${file}`)).text();
      }
      const specifiers = (src) =>
        [...src.matchAll(/(?:import\s[^;]*?from\s*|import\s*\(\s*|import\s+)["']([^"']+)["']/g)].map((m) => m[1]);
      const appImports = specifiers(sources["app.js"]);
      assert(!appImports.some((s) => /taskService|firebase/.test(s)), `app.js imports a Data Layer module: ${appImports}`);
      assert(appImports.includes("./services/taskAppService.js"), "app.js does not import services/taskAppService.js.");
      assertEqual(specifiers(sources["taskListView.js"]).length, 0, "taskListView.js imports");
      assert(!/firebase|taskService/.test(sources["taskListView.js"].replace(/\/\/.*$/gm, "")), "taskListView.js mentions the Data Layer in code.");
      return `${rows.length} rows shown for ${stored.length} stored tasks, ids identical; app.js imports ${appImports.join(", ")}; taskListView.js has no imports; no Firestore or Data Layer module referenced by the Presentation Layer.`;
    }
  );

  await runTest(
    "T19",
    "Task titles are rendered correctly",
    "Each row shows exactly the stored title of its task.",
    async () => {
      const doc = realDoc();
      const byId = new Map(stored.map((t) => [t.id, t]));
      let checked = 0;
      for (const row of rowsOf(doc)) {
        const task = byId.get(row.dataset.taskId);
        assert(task, `Row ${row.dataset.taskId} has no stored task.`);
        assertEqual(row.querySelector(".task-title").textContent, task.title, `Title of ${task.id}`);
        checked++;
      }
      return `${checked} titles match the stored titles exactly.`;
    }
  );

  await runTest(
    "T20",
    "Task statuses are rendered with the correct status indicator",
    "Each row shows the stored status text with the matching status class.",
    async () => {
      const doc = realDoc();
      const classes = { "To Do": "status--todo", "In Progress": "status--in-progress", Completed: "status--completed" };
      const byId = new Map(stored.map((t) => [t.id, t]));
      const seen = { "To Do": 0, "In Progress": 0, Completed: 0 };
      for (const row of rowsOf(doc)) {
        const task = byId.get(row.dataset.taskId);
        const pill = row.querySelector(".status");
        assertEqual(pill.textContent, task.status, `Status text of ${task.id}`);
        assert(pill.classList.contains(classes[task.status]), `Wrong status class for ${task.id} (${task.status}).`);
        seen[task.status]++;
      }
      const { doc: stubDoc, view } = await loadStubDashboard("T20 controlled data (all three statuses)");
      await view.load(async () => sampleTasks);
      for (const task of sampleTasks) {
        const pill = stubDoc.querySelector(`tr[data-task-id="${task.id}"] .status`);
        assertEqual(pill.textContent, task.status, `Controlled status of ${task.id}`);
        assert(pill.classList.contains(classes[task.status]), `Wrong controlled status class for ${task.id}.`);
      }
      const colours = new Set(["To Do", "In Progress", "Completed"].map((status) => {
        const pill = stubDoc.querySelector(`.${classes[status]}`);
        return stubDoc.defaultView.getComputedStyle(pill).backgroundColor;
      }));
      assertEqual(colours.size, 3, "Distinct status colours");
      return `Real data (${stored.length} rows) all match: To Do ${seen["To Do"]}, In Progress ${seen["In Progress"]}, Completed ${seen.Completed}. The real data holds only To Do tasks, so In Progress and Completed were verified with controlled tasks: correct text, class and three distinct colours.`;
    }
  );

  await runTest(
    "T21",
    "Due dates are rendered, and a null due date shows 'No due date'",
    "Dates shown as 'Mon D, YYYY' (local date); 'No due date' where dueDate is null.",
    async () => {
      const doc = realDoc();
      const byId = new Map(stored.map((t) => [t.id, t]));
      let dated = 0;
      let none = 0;
      for (const row of rowsOf(doc)) {
        const task = byId.get(row.dataset.taskId);
        const text = row.querySelector(".due-date span:last-child").textContent;
        assertEqual(text, expectedDueText(task.dueDate), `Due date of ${task.id}`);
        if (task.dueDate === null || task.dueDate === undefined) none++;
        else dated++;
      }
      // Controlled tasks: real Firestore Timestamps, a Date, and null
      const { doc: stubDoc, view } = await loadStubDashboard("T21 controlled due dates (Timestamp, Date, null)");
      const controlled = [
        { id: "d1", title: "Timestamp", status: "To Do", dueDate: Timestamp.fromDate(new Date(2026, 5, 20)) },
        { id: "d2", title: "Date object", status: "To Do", dueDate: new Date(2026, 11, 31) },
        { id: "d3", title: "Null", status: "To Do", dueDate: null },
        { id: "d4", title: "Missing", status: "To Do" },
      ];
      await view.load(async () => controlled);
      const text = (id) => stubDoc.querySelector(`tr[data-task-id="${id}"] .due-date span:last-child`).textContent;
      assertEqual(text("d1"), "Jun 20, 2026", "Timestamp due date");
      assertEqual(text("d2"), "Dec 31, 2026", "Date due date");
      assertEqual(text("d3"), "No due date", "Null due date");
      assertEqual(text("d4"), "No due date", "Missing due date");
      return `Real data: ${dated} dated and ${none} null due dates match the stored data (the real data has no dated tasks). Controlled tasks: Timestamp 20 Jun 2026 shown as "Jun 20, 2026", Date 31 Dec 2026 as "Dec 31, 2026", null and missing as "No due date".`;
    }
  );

  await runTest(
    "T22",
    "Summary cards are calculated from the loaded tasks",
    "Total, In Progress and Completed cards equal the counts in Firestore; To Do (not a card) is the remainder; controlled data gives known counts.",
    async () => {
      const doc = realDoc();
      const tally = (status) => stored.filter((t) => t.status === status).length;
      const [total, inProgress, completed] = countsOf(doc);
      assertEqual(total, String(stored.length), "Total card");
      assertEqual(inProgress, String(tally("In Progress")), "In Progress card");
      assertEqual(completed, String(tally("Completed")), "Completed card");
      const real = countTasks(stored);
      assertEqual(real.todo, tally("To Do"), "To Do count");
      assertEqual(real.todo + real.inProgress + real.completed, real.total, "Counts add up to the total");

      const { doc: stubDoc, view } = await loadStubDashboard("T22 controlled data");
      await view.load(async () => sampleTasks);
      assert(JSON.stringify(countsOf(stubDoc)) === JSON.stringify(["5", "1", "2"]), `Controlled cards were ${countsOf(stubDoc)}`);
      const c = countTasks(sampleTasks);
      assert(c.todo === 2 && c.inProgress === 1 && c.completed === 2 && c.total === 5, "Controlled countTasks() result wrong.");
      return `Real cards ${total} / ${inProgress} / ${completed} (To Do ${real.todo}) match Firestore. Controlled data (2 To Do, 1 In Progress, 2 Completed) gives cards 5 / 1 / 2.`;
    }
  );

  await runTest(
    "T23",
    "Loading state is shown while tasks are being retrieved",
    "Loading message and no rows while pending; page stays responsive; list appears when resolved.",
    async () => {
      const { doc, frame, view } = await loadStubDashboard("T23 loading state (pending task source)");
      let release;
      const pending = new Promise((resolve) => { release = resolve; });
      const loading = view.load(() => pending);
      await wait(50);
      const state = doc.getElementById("list-state");
      assert(!state.hidden && state.classList.contains("list-state--loading"), "Loading state not shown.");
      assert(/loading/i.test(state.textContent), `Loading text was "${state.textContent}".`);
      assertEqual(rowsOf(doc).length, 0, "Rows while loading");
      assert(doc.getElementById("task-table").hidden, "Table visible while loading.");
      assert(!countsOf(doc).includes("0"), `Counts show 0 while loading: ${countsOf(doc)}`);

      // Responsiveness: timers and animation frames keep running and input works
      let ticks = 0;
      const timer = frame.contentWindow.setInterval(() => ticks++, 20);
      const input = doc.getElementById("task-title");
      input.focus();
      input.value = "typing during load";
      await new Promise((r) => frame.contentWindow.requestAnimationFrame(r));
      await wait(300);
      frame.contentWindow.clearInterval(timer);
      assertEqual(input.value, "typing during load", "Input value while loading");
      assert(ticks >= 8, `Only ${ticks} timer ticks in 300 ms; page not responsive.`);
      assertEqual(doc.activeElement, input, "Focus while loading");

      release(sampleTasks);
      await loading;
      assert(state.hidden, "Loading state still visible after tasks arrived.");
      assertEqual(rowsOf(doc).length, 5, "Rows after loading");
      return `Loading message shown with no rows, table hidden and counts as dashes; ${ticks} timer ticks and typing worked during the wait; after resolving, the loading message was removed and 5 rows shown.`;
    }
  );

  await runTest(
    "T24",
    "Empty state is shown when getTasks() returns an empty array",
    "Empty message (not the error style), no rows, table hidden, counts 0.",
    async () => {
      const { doc, view } = await loadStubDashboard("T24 empty state (stub returns [])");
      await view.load(async () => []);
      const state = doc.getElementById("list-state");
      assert(!state.hidden && state.classList.contains("list-state--empty"), "Empty state not shown.");
      assert(!state.classList.contains("list-state--error"), "Empty state has the error style.");
      assert(/no tasks/i.test(state.textContent), `Empty text was "${state.textContent}".`);
      assertEqual(rowsOf(doc).length, 0, "Rows");
      assert(doc.getElementById("task-table").hidden, "Table visible.");
      assert(JSON.stringify(countsOf(doc)) === JSON.stringify(["0", "0", "0"]), `Counts were ${countsOf(doc)}`);
      return `Message "${state.textContent}" shown, table hidden, counts 0 / 0 / 0, no error styling.`;
    }
  );

  await runTest(
    "T25",
    "Error state is shown when task loading fails, and is not shown as empty",
    "Error message and style, no rows, counts not 0; different from the empty state; a synchronous failure is handled the same way.",
    async () => {
      const originalError = console.error;
      console.error = () => {};
      try {
        const { doc, view } = await loadStubDashboard("T25 error state (stub rejects)");
        await view.load(async () => { throw new Error("Simulated network failure"); });
        const state = doc.getElementById("list-state");
        assert(!state.hidden && state.classList.contains("list-state--error"), "Error state not shown.");
        assert(!state.classList.contains("list-state--empty"), "Error shown with the empty style.");
        assert(/could not load/i.test(state.textContent), `Error text was "${state.textContent}".`);
        assert(!/no tasks/i.test(state.textContent), "Error text reads like the empty state.");
        assertEqual(rowsOf(doc).length, 0, "Rows");
        assert(doc.getElementById("task-table").hidden, "Table visible.");
        assert(!countsOf(doc).includes("0"), `Counts show 0 after an error: ${countsOf(doc)}`);
        const message = state.textContent;

        const second = await loadStubDashboard("T25 error state (stub fails synchronously)");
        await second.view.load(() => { throw new Error("Simulated synchronous failure"); });
        assert(second.doc.getElementById("list-state").classList.contains("list-state--error"), "Synchronous failure not shown as an error.");
        return `Error message "${message}" with error styling, no rows, table hidden, counts as dashes (not 0); a synchronous failure gives the same error state.`;
      } finally {
        console.error = originalError;
      }
    }
  );

  const passed = results.filter((r) => r.status === "Pass").length;
  const summary = `Summary: ${passed} of ${results.length} passed. Firestore documents read: ${stored.length}; written or deleted: 0.`;
  console.log(summary);
  document.getElementById("output").textContent += `${summary}\n`;
  window.__results = { results, summary };
}

document.getElementById("run").addEventListener("click", runAll);
