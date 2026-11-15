// Stage 3.3 checks. Real-data tests drive the unchanged dashboard (index.html +
// app.js) and verify Firestore with an independent read. Failure and argument
// tests drive the real app code (initApp) with a controlled stub service.
import { db } from "../../firebase.js";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";
import { createTask } from "../../services/taskAppService.js";
import { initApp } from "../../app.js";

const PAGE_URL = "../../index.html";
const RUN_ID = Date.now();
const TEST_PREFIX = "[TEST] ";
const results = [];
const createdIds = new Set();
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertEqual(actual, expected, label) {
  assert(actual === expected, `${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

async function waitFor(condition, label, timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const value = await condition();
    if (value) return value;
    await wait(50);
  }
  throw new Error(`Timed out waiting for: ${label}`);
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

// ---------- Firestore helpers (read-only, plus cleanup of this run's records) ----------

// Order-independent text form of a stored task (Firestore may return keys in any order)
const plain = (data) => {
  const { id, ...fields } = data;
  const normal = { ...fields, dueDate: fields.dueDate ? fields.dueDate.toMillis() : null };
  return JSON.stringify(Object.keys(normal).sort().map((key) => [key, normal[key]]));
};

async function readAll() {
  const snapshot = await getDocs(collection(db, "tasks"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function readOne(id) {
  const snapshot = await getDoc(doc(db, "tasks", id));
  return snapshot.exists() ? snapshot.data() : null;
}

const localYmd = (timestamp) => {
  const d = timestamp.toDate();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

async function makeFixture(label, status, dueDate) {
  const id = await createTask({ title: `${TEST_PREFIX}${label} ${RUN_ID}`, status, dueDate });
  createdIds.add(id);
  return { id, title: `${TEST_PREFIX}${label} ${RUN_ID}` };
}

// ---------- Page helpers ----------

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

const listReady = (doc_) => () => {
  const state = doc_.getElementById("list-state");
  return doc_.querySelectorAll("#task-rows tr").length > 0 || (!state.hidden && !state.classList.contains("list-state--loading"));
};

// Real dashboard
async function openReal(label, width) {
  const frame = addFrame(label);
  if (width) frame.style.width = `${width}px`;
  frame.src = PAGE_URL;
  await onLoad(frame);
  await waitFor(listReady(frame.contentDocument), "list to load", 20000);
  return { frame, doc: frame.contentDocument };
}

// Dashboard markup driven by the real app code with a controlled stub service
async function openStub(label, service) {
  const html = (await (await fetch(PAGE_URL)).text())
    .replace(/<script[^>]*src="app\.js"[^>]*><\/script>/, "")
    .replace("<head>", '<head><base href="../../">');
  const frame = addFrame(label);
  frame.srcdoc = html;
  await onLoad(frame);
  await wait(200);
  const d = frame.contentDocument;
  await initApp(d, async () => service);
  return { frame, doc: d };
}

const rowFor = (d, title) =>
  [...d.querySelectorAll("#task-rows tr")].find((r) => r.querySelector(".task-title").textContent === title);
const counts = (d) => ["count-total", "count-in-progress", "count-completed"].map((id) => d.getElementById(id).textContent);
const feedbackOf = (d) => d.getElementById("feedback");
const feedbackText = (d) => (feedbackOf(d).hidden ? "" : feedbackOf(d).textContent);
const waitFeedback = (d, kind) =>
  waitFor(() => !feedbackOf(d).hidden && feedbackOf(d).classList.contains(`feedback--${kind}`), `${kind} feedback`);

function fillForm(d, { title, date, status }) {
  const t = d.getElementById("task-title");
  t.value = title;
  if (date !== undefined) {
    const input = d.getElementById("task-due-date");
    input.focus();
    input.type = "date";
    input.value = date;
  }
  if (status !== undefined) d.getElementById("task-status").value = status;
}

const submit = (d) => d.getElementById("add-task-form").requestSubmit();

function setStatus(d, title, status) {
  const select = rowFor(d, title).querySelector(".status-select");
  select.value = status;
  select.dispatchEvent(new Event("change", { bubbles: true }));
}

async function expectedCounts() {
  const all = await readAll();
  const n = (s) => String(all.filter((t) => t.status === s).length);
  return [String(all.length), n("In Progress"), n("Completed")];
}

const sameList = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// ---------- Controlled stub of the Application Layer ----------

function makeStub(initialTasks, failing = {}) {
  const tasks = initialTasks.map((t) => ({ ...t }));
  const calls = [];
  const maybeFail = (name) => {
    if (failing[name]) throw new Error("Simulated Firestore failure");
  };
  return {
    calls,
    tasks,
    async getTasks() { return tasks.map((t) => ({ ...t })); },
    async createTask(data) {
      calls.push(["createTask", data]);
      maybeFail("createTask");
      if (typeof data.title !== "string" || data.title.trim() === "") throw new Error("Task title cannot be empty.");
      tasks.push({ id: `stub-${tasks.length + 1}`, ...data, title: data.title.trim() });
      return `stub-${tasks.length}`;
    },
    async updateTask(id, changes) {
      calls.push(["updateTask", id, changes]);
      maybeFail("updateTask");
      Object.assign(tasks.find((t) => t.id === id), changes);
    },
    async deleteTask(id) {
      calls.push(["deleteTask", id]);
      maybeFail("deleteTask");
      tasks.splice(tasks.findIndex((t) => t.id === id), 1);
    },
  };
}

const baseTasks = () => [
  { id: "a1", title: "Alpha", status: "To Do", dueDate: new Date(2026, 4, 1) },
  { id: "b2", title: "Beta", status: "In Progress", dueDate: null },
];

// ---------- Tests ----------

async function runAll() {
  document.getElementById("output").textContent = "";
  document.getElementById("previews").replaceChildren();
  results.length = 0;
  createdIds.clear();

  const before = await readAll();
  const beforeSnapshot = new Map(before.map((t) => [t.id, plain(t)]));

  await runTest(
    "T26",
    "Create a task through the Add New Task form (real Firestore)",
    "Task is stored with the entered title, status and local due date, appears in the list, cards update, form resets, success message shown; an omitted status and date use the defaults.",
    async () => {
      const { doc: d } = await openReal("T26 real dashboard");
      const [total0, progress0] = counts(d);
      const title = `${TEST_PREFIX}Create Task ${RUN_ID}`;
      fillForm(d, { title, date: "2026-12-31", status: "In Progress" });
      submit(d);
      await waitFeedback(d, "success");
      await waitFor(() => rowFor(d, title), "new row");

      const stored = (await readAll()).filter((t) => t.title === title);
      assertEqual(stored.length, 1, "Stored documents with the new title");
      createdIds.add(stored[0].id);
      assertEqual(stored[0].status, "In Progress", "Stored status");
      assertEqual(localYmd(stored[0].dueDate), "2026-12-31", "Stored local due date");

      const row = rowFor(d, title);
      assertEqual(row.querySelector(".status").textContent, "In Progress", "Row status");
      assertEqual(row.querySelector(".due-date span:last-child").textContent, "Dec 31, 2026", "Row due date");
      await waitFor(() => counts(d)[0] === String(Number(total0) + 1), "total card");
      assertEqual(counts(d)[1], String(Number(progress0) + 1), "In Progress card");
      assertEqual(d.getElementById("task-title").value, "", "Title field after create");
      assert(/added/i.test(feedbackText(d)), `Success text was "${feedbackText(d)}".`);
      const summary = `Stored "${title}" (In Progress, 2026-12-31), shown as "Dec 31, 2026", Total ${total0}→${counts(d)[0]}, In Progress ${progress0}→${counts(d)[1]}, form reset, success message "${feedbackText(d)}".`;

      // Defaults: title only
      const title2 = `${TEST_PREFIX}Create Defaults ${RUN_ID}`;
      fillForm(d, { title: title2 });
      submit(d);
      await waitFor(() => rowFor(d, title2), "second new row");
      const stored2 = (await readAll()).find((t) => t.title === title2);
      createdIds.add(stored2.id);
      assertEqual(stored2.status, "To Do", "Default status");
      assertEqual(stored2.dueDate, null, "Default due date");
      assertEqual(rowFor(d, title2).querySelector(".due-date span:last-child").textContent, "No due date", "Row due date text");
      return `${summary} Title-only task stored as To Do with null due date.`;
    }
  );

  await runTest(
    "T27",
    "Reject an empty task title (real Firestore)",
    "Error message from the Application Layer, no success message, no document created, list unchanged.",
    async () => {
      const { doc: d } = await openReal("T27 real dashboard");
      const countBefore = (await readAll()).length;
      const rowsBefore = d.querySelectorAll("#task-rows tr").length;
      const cardsBefore = counts(d);
      const messages = [];
      for (const value of ["", "   "]) {
        fillForm(d, { title: value });
        submit(d);
        await waitFeedback(d, "error");
        assert(!d.getElementById("feedback").classList.contains("feedback--success"), "Error shown with the success style.");
        assert(/title cannot be empty/i.test(feedbackText(d)), `Error text was "${feedbackText(d)}".`);
        messages.push(feedbackText(d));
        d.getElementById("feedback").hidden = true;
      }
      await wait(300);
      assertEqual((await readAll()).length, countBefore, "Documents after rejected submits");
      assertEqual(d.querySelectorAll("#task-rows tr").length, rowsBefore, "Rows");
      assert(sameList(counts(d), cardsBefore), "Cards changed after rejected submits.");
      return `Empty and whitespace-only titles both rejected with "${messages[0]}"; ${countBefore} documents before and after; rows and cards unchanged.`;
    }
  );

  await runTest(
    "T28",
    "Edit an existing task (real Firestore)",
    "Pencil opens the form with current values; saving changes the title and date only (status kept) in Firestore and the list; an empty title is rejected and leaves the task unchanged.",
    async () => {
      const fx = await makeFixture("Edit Task", "In Progress", new Date(2026, 6, 4));
      const { doc: d } = await openReal("T28 real dashboard");
      rowFor(d, fx.title).querySelector(".icon-button--edit").click();
      await waitFor(() => d.getElementById("task-submit-label").textContent === "Save Changes", "edit mode");
      assertEqual(d.getElementById("add-task-heading").textContent, "Edit Task", "Heading");
      assertEqual(d.getElementById("task-title").value, fx.title, "Prefilled title");
      assertEqual(d.getElementById("task-status").value, "In Progress", "Prefilled status");
      assertEqual(d.getElementById("task-due-date").value, "2026-07-04", "Prefilled date");
      assert(!d.getElementById("task-cancel").hidden, "Cancel button hidden in edit mode.");
      assertEqual(d.defaultView.getComputedStyle(d.getElementById("task-submit-icon")).display, "none", "Add (+) icon display in edit mode");
      assert(rowFor(d, fx.title).classList.contains("is-editing"), "Edited row not highlighted.");

      // Invalid input: empty title is rejected and nothing changes
      d.getElementById("task-title").value = "";
      submit(d);
      await waitFeedback(d, "error");
      const afterReject = await readOne(fx.id);
      assertEqual(afterReject.title, fx.title, "Stored title after rejected edit");
      assertEqual(afterReject.status, "In Progress", "Stored status after rejected edit");
      assertEqual(localYmd(afterReject.dueDate), "2026-07-04", "Stored date after rejected edit");
      assertEqual(d.getElementById("task-submit-label").textContent, "Save Changes", "Still in edit mode after error");

      const newTitle = `${fx.title} edited`;
      fillForm(d, { title: newTitle, date: "2026-08-15" });
      submit(d);
      await waitFeedback(d, "success");
      await waitFor(() => rowFor(d, newTitle), "updated row");
      const stored = await readOne(fx.id);
      assertEqual(stored.title, newTitle, "Stored title");
      assertEqual(localYmd(stored.dueDate), "2026-08-15", "Stored due date");
      assertEqual(stored.status, "In Progress", "Stored status (unchanged)");
      assertEqual(rowFor(d, newTitle).querySelector(".due-date span:last-child").textContent, "Aug 15, 2026", "Row date");
      assertEqual(d.getElementById("task-submit-label").textContent, "Add Task", "Form back in add mode");
      return `Form prefilled (title, In Progress, 2026-07-04). Empty title rejected, record unchanged. After saving: title "${newTitle}", due 2026-08-15, status still In Progress in Firestore; row updated; form back to add mode; "${feedbackText(d)}".`;
    }
  );

  await runTest(
    "T29",
    "Cancel an edit (real Firestore)",
    "Cancel leaves the task unchanged in Firestore and the list, and returns the form to add mode.",
    async () => {
      const fx = await makeFixture("Cancel Edit", "To Do", new Date(2026, 8, 9));
      const { doc: d } = await openReal("T29 real dashboard");
      const original = plain(await readOne(fx.id));
      rowFor(d, fx.title).querySelector(".icon-button--edit").click();
      await waitFor(() => d.getElementById("task-submit-label").textContent === "Save Changes", "edit mode");
      d.getElementById("task-title").value = `${TEST_PREFIX}should not be saved`;
      d.getElementById("task-cancel").click();
      await wait(300);
      assertEqual(plain(await readOne(fx.id)), original, "Stored task after cancel");
      assert(rowFor(d, fx.title), "Original row missing after cancel.");
      assertEqual(d.getElementById("task-title").value, "", "Title field after cancel");
      assertEqual(d.getElementById("task-submit-label").textContent, "Add Task", "Button label after cancel");
      assert(d.defaultView.getComputedStyle(d.getElementById("task-submit-icon")).display !== "none", "Add (+) icon not restored after cancel.");
      assert(d.getElementById("task-cancel").hidden, "Cancel button still visible.");
      assert(!rowFor(d, fx.title).classList.contains("is-editing"), "Row still highlighted.");
      assert(!feedbackOf(d).classList.contains("feedback--success") || feedbackOf(d).hidden, "Success message shown after cancel.");
      return "Edit started, title changed, Cancel pressed: Firestore record identical before and after, original row kept, form reset to add mode, no success message.";
    }
  );

  await runTest(
    "T30",
    "Confirm deletion (real Firestore)",
    "Delete icon opens the confirmation; the task is removed only after Delete is confirmed, from Firestore and the list, and the cards update.",
    async () => {
      const fx = await makeFixture("Delete Task", "Completed", null);
      const { doc: d } = await openReal("T30 real dashboard");
      await waitFor(async () => (await expectedCounts()).join() === counts(d).join(), "cards to match before delete");
      const [total0, , completed0] = counts(d);
      rowFor(d, fx.title).querySelector(".icon-button--delete").click();
      await waitFor(() => d.getElementById("delete-dialog").open, "dialog");
      assert(d.getElementById("delete-dialog-text").textContent.includes(fx.title), "Dialog does not name the task.");
      assert(await readOne(fx.id), "Task deleted before confirmation.");
      d.getElementById("delete-confirm").click();
      await waitFor(() => !rowFor(d, fx.title), "row removal");
      assertEqual(await readOne(fx.id), null, "Stored task after delete");
      createdIds.delete(fx.id);
      assert(!d.getElementById("delete-dialog").open, "Dialog still open.");
      assert(/deleted/i.test(feedbackText(d)), `Success text was "${feedbackText(d)}".`);
      await waitFor(() => counts(d)[0] === String(Number(total0) - 1), "total card");
      assertEqual(counts(d)[2], String(Number(completed0) - 1), "Completed card");
      return `Dialog opened naming the task and the record still existed; after Delete: record gone from Firestore, row removed, Total ${total0}→${counts(d)[0]}, Completed ${completed0}→${counts(d)[2]}, "${feedbackText(d)}".`;
    }
  );

  await runTest(
    "T31",
    "Cancel deletion (real Firestore)",
    "Cancel closes the dialog and leaves the task in Firestore and the list.",
    async () => {
      const fx = await makeFixture("Cancel Delete", "To Do", null);
      const { doc: d } = await openReal("T31 real dashboard");
      const cardsBefore = counts(d);
      rowFor(d, fx.title).querySelector(".icon-button--delete").click();
      await waitFor(() => d.getElementById("delete-dialog").open, "dialog");
      d.getElementById("delete-cancel").click();
      await wait(300);
      assert(!d.getElementById("delete-dialog").open, "Dialog still open after Cancel.");
      assert(await readOne(fx.id), "Task deleted despite Cancel.");
      assert(rowFor(d, fx.title), "Row removed despite Cancel.");
      assert(sameList(counts(d), cardsBefore), "Cards changed after Cancel.");
      assert(feedbackOf(d).hidden, `Feedback shown after Cancel: "${feedbackText(d)}".`);
      return "Dialog opened and cancelled: it closed, the Firestore record and the row remain, cards unchanged, no message.";
    }
  );

  await runTest(
    "T32",
    "Change a task's status (real Firestore)",
    "Each of the three statuses is saved, shown in the pill, and persists after reloading the page.",
    async () => {
      const fx = await makeFixture("Status Task", "To Do", null);
      const { doc: d } = await openReal("T32 real dashboard");
      const classes = { "To Do": "status--todo", "In Progress": "status--in-progress", Completed: "status--completed" };
      const seen = [];
      for (const status of ["In Progress", "Completed", "To Do"]) {
        d.getElementById("feedback").hidden = true;
        setStatus(d, fx.title, status);
        await waitFeedback(d, "success");
        await waitFor(() => rowFor(d, fx.title)?.querySelector(".status").textContent === status, `pill ${status}`);
        assert(rowFor(d, fx.title).querySelector(".status").classList.contains(classes[status]), `Wrong class for ${status}`);
        assertEqual((await readOne(fx.id)).status, status, "Stored status");
        seen.push(status);
        if (status === "Completed") {
          const { doc: d2 } = await openReal("T32 real dashboard after reload");
          assertEqual(rowFor(d2, fx.title).querySelector(".status").textContent, "Completed", "Status after reload");
          assertEqual(rowFor(d2, fx.title).querySelector(".status-select").value, "Completed", "Select after reload");
        }
      }
      return `Status changed ${seen.join(" → ")}: each saved to Firestore, pill text and class updated, success message shown; "Completed" was still shown after reloading the page.`;
    }
  );

  await runTest(
    "T33",
    "Summary cards update after create, status change and delete",
    "After every operation the three cards equal an independent tally of Firestore.",
    async () => {
      const { doc: d } = await openReal("T33 real dashboard");
      const title = `${TEST_PREFIX}Counts Task ${RUN_ID}`;
      const steps = [];
      const check = async (label) => {
        await waitFor(async () => (await expectedCounts()).join() === counts(d).join(), `cards after ${label}`);
        steps.push(`${label}: ${counts(d).join("/")}`);
      };
      await check("start");
      fillForm(d, { title, status: "To Do" });
      submit(d);
      await waitFor(() => rowFor(d, title), "created row");
      createdIds.add((await readAll()).find((t) => t.title === title).id);
      await check("created");
      setStatus(d, title, "In Progress");
      await waitFor(() => rowFor(d, title).querySelector(".status").textContent === "In Progress", "In Progress");
      await check("In Progress");
      setStatus(d, title, "Completed");
      await waitFor(() => rowFor(d, title).querySelector(".status").textContent === "Completed", "Completed");
      await check("Completed");
      const id = (await readAll()).find((t) => t.title === title).id;
      rowFor(d, title).querySelector(".icon-button--delete").click();
      await waitFor(() => d.getElementById("delete-dialog").open, "dialog");
      d.getElementById("delete-confirm").click();
      await waitFor(() => !rowFor(d, title), "row removal");
      createdIds.delete(id);
      await check("deleted");
      return `Cards matched Firestore after every step (Total/In Progress/Completed): ${steps.join("; ")}.`;
    }
  );

  await runTest(
    "T34",
    "Operation failures are not shown as successful (controlled stub)",
    "For create, edit, status change and delete: error message, no success message, list and form show the stored state.",
    async () => {
      const failing = { createTask: true, updateTask: true, deleteTask: true };
      const stub = makeStub(baseTasks(), failing);
      const { doc: d } = await openStub("T34 stub with failing operations", stub);
      const cardsBefore = counts(d);
      const noSuccess = (label) => {
        assert(feedbackOf(d).classList.contains("feedback--error"), `${label}: no error message.`);
        assert(!/added|updated|deleted|is now/i.test(feedbackText(d)), `${label}: message reads like success: "${feedbackText(d)}".`);
        assert(/Simulated Firestore failure/.test(feedbackText(d)), `${label}: error text was "${feedbackText(d)}".`);
      };

      fillForm(d, { title: "Should fail", status: "Completed" });
      submit(d);
      await waitFeedback(d, "error");
      noSuccess("create");
      assertEqual(d.getElementById("task-title").value, "Should fail", "Title kept after failed create");
      assertEqual(d.querySelectorAll("#task-rows tr").length, 2, "Rows after failed create");
      d.getElementById("task-title").value = "";
      d.getElementById("feedback").hidden = true;

      rowFor(d, "Alpha").querySelector(".icon-button--edit").click();
      d.getElementById("task-title").value = "Alpha changed";
      submit(d);
      await waitFeedback(d, "error");
      noSuccess("edit");
      assert(rowFor(d, "Alpha"), "Original row lost after failed edit.");
      assert(!rowFor(d, "Alpha changed"), "Row shows the unsaved title.");
      assertEqual(d.getElementById("task-submit-label").textContent, "Save Changes", "Edit mode kept after failed edit");
      d.getElementById("task-cancel").click();
      d.getElementById("feedback").hidden = true;

      setStatus(d, "Beta", "Completed");
      await waitFor(() => !d.getElementById("feedback").hidden, "status feedback");
      noSuccess("status change");
      assertEqual(rowFor(d, "Beta").querySelector(".status-select").value, "In Progress", "Select after failed status change");
      assertEqual(rowFor(d, "Beta").querySelector(".status").textContent, "In Progress", "Pill after failed status change");
      d.getElementById("feedback").hidden = true;

      rowFor(d, "Alpha").querySelector(".icon-button--delete").click();
      await waitFor(() => d.getElementById("delete-dialog").open, "dialog");
      d.getElementById("delete-confirm").click();
      await waitFeedback(d, "error");
      noSuccess("delete");
      assert(rowFor(d, "Alpha"), "Row removed after failed delete.");
      assert(sameList(counts(d), cardsBefore), "Cards changed after failures.");
      assertEqual(stub.tasks.length, 2, "Stub tasks after failures");
      return `All four failures showed "Simulated Firestore failure" in the error style with no success wording; the failed create kept the typed title, the failed edit kept edit mode and the original row, the failed status change reverted to "In Progress", the failed delete kept the row; cards stayed ${cardsBefore.join("/")}.`;
    }
  );

  await runTest(
    "T35",
    "Operations use the Application Layer with the right arguments; layer separation (controlled stub + source check)",
    "create gets title/status/local Date or null; edit sends only changed fields; status sends {status}; delete sends the id; no change makes no call; no Data Layer import.",
    async () => {
      const stub = makeStub(baseTasks());
      const { doc: d } = await openStub("T35 stub recording calls", stub);
      const last = () => stub.calls[stub.calls.length - 1];
      const json = (v) => JSON.stringify(v);

      fillForm(d, { title: "  New one ", date: "2026-03-05", status: "In Progress" });
      submit(d);
      await waitFor(() => rowFor(d, "New one"), "created row");
      const [name, data] = last();
      assertEqual(name, "createTask", "Call");
      assert(data.dueDate instanceof Date && data.dueDate.getFullYear() === 2026 && data.dueDate.getMonth() === 2 && data.dueDate.getDate() === 5, "Due date is not the local Date 2026-03-05.");
      assertEqual(data.status, "In Progress", "Status passed");
      fillForm(d, { title: "No date" });
      submit(d);
      await waitFor(() => rowFor(d, "No date"), "second created row");
      assertEqual(last()[1].dueDate, null, "Empty date passed as");

      const edit = async (title, date, status) => {
        rowFor(d, "Alpha").querySelector(".icon-button--edit").click();
        await waitFor(() => d.getElementById("task-submit-label").textContent === "Save Changes", "edit mode");
        if (title !== undefined) d.getElementById("task-title").value = title;
        if (date !== undefined) { const i = d.getElementById("task-due-date"); i.type = date === "" ? "text" : "date"; i.value = date; }
        if (status !== undefined) d.getElementById("task-status").value = status;
        submit(d);
      };

      await edit("Alpha 2");
      await waitFor(() => rowFor(d, "Alpha 2"), "title edit");
      assertEqual(json(last()), json(["updateTask", "a1", { title: "Alpha 2" }]), "Title-only edit call");
      stub.calls.length = 0;
      rowFor(d, "Alpha 2").querySelector(".icon-button--edit").click();
      await waitFor(() => d.getElementById("task-submit-label").textContent === "Save Changes", "edit mode");
      const calls0 = stub.calls.length;
      submit(d);
      await waitFeedback(d, "info");
      assertEqual(stub.calls.length, calls0, "Calls made when nothing changed");

      rowFor(d, "Alpha 2").querySelector(".icon-button--edit").click();
      await waitFor(() => d.getElementById("task-submit-label").textContent === "Save Changes", "edit mode");
      d.getElementById("task-due-date").type = "text";
      d.getElementById("task-due-date").value = "";
      submit(d);
      await waitFor(() => rowFor(d, "Alpha 2").querySelector(".due-date span:last-child").textContent === "No due date", "date cleared");
      assertEqual(json(last()), json(["updateTask", "a1", { dueDate: null }]), "Date-clear call");

      setStatus(d, "Beta", "Completed");
      await waitFor(() => rowFor(d, "Beta").querySelector(".status").textContent === "Completed", "status");
      assertEqual(json(last()), json(["updateTask", "b2", { status: "Completed" }]), "Status call");

      rowFor(d, "Beta").querySelector(".icon-button--delete").click();
      await waitFor(() => d.getElementById("delete-dialog").open, "dialog");
      d.getElementById("delete-confirm").click();
      await waitFor(() => !rowFor(d, "Beta"), "delete");
      assertEqual(json(last()), json(["deleteTask", "b2"]), "Delete call");

      const specifiers = (src) =>
        [...src.matchAll(/(?:import\s[^;]*?from\s*|import\s*\(\s*|import\s+)["']([^"']+)["']/g)].map((m) => m[1]);
      const app = await (await fetch("../../app.js")).text();
      const view = await (await fetch("../../taskListView.js")).text();
      const html = await (await fetch("../../index.html")).text();
      const appImports = specifiers(app);
      assert(!appImports.some((s) => /taskService|firebase/.test(s)), `app.js imports ${appImports}`);
      assertEqual(json(appImports.sort()), json(["./services/taskAppService.js", "./taskListView.js"]), "app.js imports");
      assertEqual(specifiers(view).length, 0, "taskListView.js imports");
      assert(!/taskService|firebase/.test(html.replace(/<!--[\s\S]*?-->/g, "")), "index.html references the Data Layer.");
      return "Create passed title/status/local Date (2026-03-05) and null for an empty date; title-only edit sent {title}; clearing the date sent {dueDate: null}; status change sent {status}; delete sent the id; an unchanged edit made no call and showed a neutral message; app.js imports only ./taskListView.js and ./services/taskAppService.js, taskListView.js and index.html reference no Data Layer module.";
    }
  );

  await runTest(
    "T36",
    "Layout of the new controls at desktop, tablet and mobile widths (real dashboard, no writes)",
    "Edit mode and the delete dialog fit the viewport with no horizontal overflow; the status select covers its pill.",
    async () => {
      const notes = [];
      for (const width of [1280, 820, 390]) {
        const { frame, doc: d } = await openReal(`T36 real dashboard ${width}px`, width);
        const row = d.querySelector("#task-rows tr");
        const edit = row.querySelector(".icon-button--edit");
        edit.click();
        await waitFor(() => d.getElementById("task-submit-label").textContent === "Save Changes", "edit mode");
        const root = d.documentElement;
        assert(root.scrollWidth <= root.clientWidth, `${width}px: horizontal overflow in edit mode.`);
        const submitRect = d.getElementById("task-submit").getBoundingClientRect();
        const cancelRect = d.getElementById("task-cancel").getBoundingClientRect();
        assert(submitRect.width > 0 && cancelRect.width > 0, `${width}px: Save or Cancel not visible.`);
        assert(submitRect.right <= root.clientWidth + 1 && cancelRect.right <= root.clientWidth + 1, `${width}px: buttons clipped.`);
        d.getElementById("task-cancel").click();

        const pill = row.querySelector(".status").getBoundingClientRect();
        const select = row.querySelector(".status-select").getBoundingClientRect();
        assert(Math.abs(pill.width - select.width) < 1 && Math.abs(pill.height - select.height) < 1, `${width}px: select does not cover the pill.`);

        row.querySelector(".icon-button--delete").click();
        await waitFor(() => d.getElementById("delete-dialog").open, "dialog");
        const dialog = d.getElementById("delete-dialog").getBoundingClientRect();
        assert(dialog.left >= 0 && dialog.right <= root.clientWidth, `${width}px: dialog outside the viewport (${Math.round(dialog.left)}–${Math.round(dialog.right)}).`);
        const confirmRect = d.getElementById("delete-confirm").getBoundingClientRect();
        assert(confirmRect.right <= dialog.right && confirmRect.left >= dialog.left, `${width}px: Delete button clipped.`);
        d.getElementById("delete-cancel").click();
        await wait(100);
        assert(root.scrollWidth <= root.clientWidth, `${width}px: horizontal overflow after the dialog.`);
        notes.push(`${width}px OK (dialog ${Math.round(dialog.width)}px wide)`);
        frame.style.height = "700px";
      }
      return `No overflow in edit mode or with the dialog open; Save/Cancel visible; select matches the pill: ${notes.join("; ")}. Edit and delete were cancelled, nothing written.`;
    }
  );

  // Cleanup: remove only the records created by this run, then verify data safety
  const leftover = [...createdIds];
  for (const id of leftover) {
    await deleteDoc(doc(db, "tasks", id));
  }
  const after = await readAll();
  await runTest(
    "T37",
    "Data safety and cleanup",
    "Every pre-existing document is unchanged; all documents created by this run are removed; the document count equals the start.",
    async () => {
      for (const [id, snapshot] of beforeSnapshot) {
        const current = after.find((t) => t.id === id);
        assert(current, `Existing document ${id} is missing.`);
        assertEqual(plain(current), snapshot, `Existing document ${id}`);
      }
      assertEqual(after.length, before.length, "Document count");
      assert(!after.some((t) => t.title.includes(String(RUN_ID))), "A test record of this run remains.");
      return `${before.length} pre-existing documents unchanged; ${leftover.length} test record(s) still present at the end of the run were removed (others were removed by the delete tests); final count ${after.length} = start ${before.length}.`;
    }
  );

  const passed = results.filter((r) => r.status === "Pass").length;
  const summary = `Summary: ${passed} of ${results.length} passed. Run id ${RUN_ID}.`;
  console.log(summary);
  document.getElementById("output").textContent += `${summary}\n`;
  window.__results = { results, summary };
}

document.getElementById("run").addEventListener("click", runAll);
