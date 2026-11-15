// Stage 3.1 checks. The dashboard is loaded unchanged in iframes so that its
// own CSS media queries respond to the iframe width.
const PAGE_URL = "../../index.html";
const APP_SOURCE_URL = "../../app.js";

const VIEWPORTS = {
  desktop: { label: "Desktop", width: 1280 },
  tablet: { label: "Tablet", width: 820 },
  mobile: { label: "Mobile", width: 390 },
};

const EXPECTED_STATUS_CLASSES = {
  "To Do": "status--todo",
  "In Progress": "status--in-progress",
  Completed: "status--completed",
};

const results = [];
const frames = {};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// Load the dashboard in an iframe of the given width and wait for it to render
async function loadFrame(key, { label, width }) {
  const wrapper = document.createElement("div");
  wrapper.className = "preview";
  wrapper.innerHTML = `<strong>${label} preview (${width}px wide)</strong>`;

  const frame = document.createElement("iframe");
  frame.style.width = `${width}px`;
  frame.style.height = "900px";
  frame.src = PAGE_URL;
  wrapper.append(frame);
  document.getElementById("previews").append(wrapper);

  await new Promise((resolve, reject) => {
    frame.addEventListener("load", resolve, { once: true });
    setTimeout(() => reject(new Error(`${label} page did not load.`)), 10000);
  });

  const doc = frame.contentDocument;
  for (let i = 0; i < 50 && doc.querySelectorAll("#task-rows tr").length === 0; i++) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  frame.style.height = `${doc.documentElement.scrollHeight}px`;
  frames[key] = frame;
  return frame;
}

const docOf = (key) => frames[key].contentDocument;
const winOf = (key) => frames[key].contentWindow;
const rect = (el) => el.getBoundingClientRect();

// WCAG contrast ratio between two "rgb(r, g, b)" colours
function contrast(foreground, background) {
  const luminance = (color) => {
    const [r, g, b] = color.match(/\d+(\.\d+)?/g).slice(0, 3).map((v) => {
      const channel = Number(v) / 255;
      return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

async function runTest(id, scenario, expected, testFn) {
  const result = { id, scenario, expected, actual: "", status: "Fail" };

  try {
    result.actual = await testFn();
    result.status = "Pass";
  } catch (error) {
    result.actual = error.message;
  }

  results.push(result);
  console.log(
    `${result.id} [${result.status}] ${result.scenario}\n  Expected: ${result.expected}\n  Actual: ${result.actual}`
  );
}

// ---- Structure ----

function testStructure() {
  const doc = docOf("desktop");
  const text = (selector) => doc.querySelector(selector)?.textContent.trim();

  assert(doc.querySelector(".logo svg"), "Logo icon missing.");
  assert(text("h1") === "TaskFlow", `Title is "${text("h1")}".`);
  assert(text(".tagline") === "A simple task manager for daily work.", "Tagline text differs.");

  const labels = [...doc.querySelectorAll(".summary-label")].map((el) => el.textContent.trim());
  assert(labels.join("|") === "Total Tasks|In Progress|Completed", `Summary labels: ${labels.join(", ")}`);
  assert(doc.querySelectorAll(".summary-card .summary-icon svg").length === 3, "Summary icons missing.");

  assert(text("#add-task-heading") === "Add New Task", "Add New Task heading missing.");
  assert(doc.querySelector("#task-title")?.placeholder === "Enter task title...", "Title placeholder differs.");
  assert(doc.querySelector("#task-due-date")?.placeholder === "Due date", "Due date placeholder differs.");
  const options = [...doc.querySelectorAll("#task-status option")].map((o) => o.textContent.trim());
  assert(options.join("|") === "To Do|In Progress|Completed", `Status options: ${options.join(", ")}`);
  assert(doc.querySelector("#task-status").value === "To Do", "Status does not default to To Do.");
  assert(text(".btn-primary") === "Add Task" && doc.querySelector(".btn-primary svg"), "Add Task button differs.");

  assert(text("#task-list-heading") === "Task List", "Task List heading missing.");
  const headers = [...doc.querySelectorAll(".task-table th")].map((th) => th.textContent.trim());
  assert(headers.join("|") === "Task|Status|Due Date|Actions", `Table headers: ${headers.join(", ")}`);

  const rows = [...doc.querySelectorAll("#task-rows tr")];
  assert(rows.length === 12, `Expected 12 mock rows, found ${rows.length}.`);
  rows.forEach((row, index) => {
    assert(row.querySelector(".status"), `Row ${index + 1} has no status indicator.`);
    assert(row.querySelector(".due-date svg"), `Row ${index + 1} has no due date icon.`);
    assert(row.querySelector(".icon-button--edit") && row.querySelector(".icon-button--delete"), `Row ${index + 1} is missing edit or delete.`);
  });

  const feedback = doc.querySelector("#feedback");
  const listState = doc.querySelector("#list-state");
  assert(feedback?.hidden && listState?.hidden, "Feedback containers are missing or not hidden by default.");

  return "Header, 3 summary cards, Add New Task controls, Task List table with 4 columns and 12 rows (status, due date, edit, delete in each), and hidden feedback containers are all present.";
}

// ---- Status and due date presentation ----

function testStatusAndDueDates() {
  const doc = docOf("desktop");
  const rows = [...doc.querySelectorAll("#task-rows tr")];
  const colours = {};

  rows.forEach((row) => {
    const pill = row.querySelector(".status");
    const expectedClass = EXPECTED_STATUS_CLASSES[pill.textContent.trim()];
    assert(expectedClass && pill.classList.contains(expectedClass), `Status "${pill.textContent}" has wrong class "${pill.className}".`);
    colours[pill.textContent.trim()] = winOf("desktop").getComputedStyle(pill).backgroundColor;
  });
  assert(new Set(Object.values(colours)).size === 3, "The three statuses do not have distinct colours.");

  const dateTexts = rows.map((row) => row.querySelector(".due-date").textContent.trim());
  const formatted = dateTexts.filter((t) => /^[A-Z][a-z]{2} \d{1,2}, \d{4}$/.test(t));
  const none = dateTexts.filter((t) => t === "No due date");
  assert(formatted.length + none.length === rows.length, `Unexpected date text: ${dateTexts.join(" | ")}`);
  assert(dateTexts[0] === "Jun 20, 2026" && none.length === 1, "First date or the no-due-date row is wrong.");

  const statuses = rows.map((row) => row.querySelector(".status").textContent.trim());
  const count = (status) => statuses.filter((s) => s === status).length;
  const cards = [...doc.querySelectorAll(".summary-count")].map((el) => Number(el.textContent));
  assert(
    cards.join(",") === [rows.length, count("In Progress"), count("Completed")].join(","),
    `Summary counts ${cards.join(",")} do not match the rows.`
  );

  return `Three distinct status colours; ${formatted.length} dates in "Mon D, YYYY" format plus ${none.length} "No due date"; summary counts ${cards.join("/")} match the ${rows.length} mock rows.`;
}

function testReadability() {
  const win = winOf("desktop");
  const doc = docOf("desktop");
  const checks = [
    [".status--todo", ".status--todo"],
    [".status--in-progress", ".status--in-progress"],
    [".status--completed", ".status--completed"],
    [".task-title", null],
    [".due-date:not(.due-date--none)", null],
    [".due-date--none", null],
    [".tagline", null],
    [".summary-label", null],
  ];
  const lines = [];

  checks.forEach(([selector, ownBackground]) => {
    const el = doc.querySelector(selector);
    const style = win.getComputedStyle(el);
    const background = ownBackground ? style.backgroundColor : win.getComputedStyle(doc.querySelector(".card")).backgroundColor;
    const ratio = contrast(style.color, background);
    lines.push(`${selector} ${ratio.toFixed(1)}:1`);
    assert(ratio >= 4.5, `${selector} contrast ${ratio.toFixed(2)}:1 is below 4.5:1.`);
  });

  return `Text/background contrast is at least 4.5:1 for every checked element (${lines.join(", ")}).`;
}

// ---- Layout at each width ----

function checkNoOverflow(key) {
  const doc = docOf(key);
  const clientWidth = doc.documentElement.clientWidth;
  assert(doc.documentElement.scrollWidth <= clientWidth, `Page scrolls horizontally (${doc.documentElement.scrollWidth}px > ${clientWidth}px).`);

  const overflowing = [...doc.querySelectorAll("body *")].filter((el) => {
    const box = rect(el);
    return box.width > 1 && box.height > 1 && (box.right > clientWidth + 1 || box.left < -1);
  });
  assert(overflowing.length === 0, `Elements outside the viewport: ${overflowing.slice(0, 3).map((el) => el.className || el.tagName).join(", ")}`);

  const clipped = [...doc.querySelectorAll(".task-title, .status, .due-date, .summary-label, .summary-count, .btn-primary")].filter(
    (el) => el.scrollWidth > el.clientWidth + 1
  );
  assert(clipped.length === 0, `Clipped content in: ${clipped.slice(0, 3).map((el) => el.className).join(", ")}`);

  return clientWidth;
}

const sameRow = (elements) => Math.max(...elements.map((e) => rect(e).top)) - Math.min(...elements.map((e) => rect(e).top)) < 3;
// True when two elements overlap vertically (they sit on the same line even if centred differently)
const sharesRow = (a, b) => rect(a).top < rect(b).bottom && rect(b).top < rect(a).bottom;
const stacked = (elements) => elements.every((e, i) => i === 0 || rect(e).top >= rect(elements[i - 1]).bottom - 1);

function testDesktopLayout() {
  const width = checkNoOverflow("desktop");
  const doc = docOf("desktop");
  const cards = [...doc.querySelectorAll(".summary-card")];
  const controls = [...doc.querySelectorAll(".add-task-form > *")];
  const thead = winOf("desktop").getComputedStyle(doc.querySelector(".task-table thead"));

  assert(sameRow(cards), "Summary cards are not on one row.");
  assert(sameRow(controls), "Add New Task controls are not on one row.");
  assert(thead.position !== "absolute", "Table header is hidden.");
  assert(winOf("desktop").getComputedStyle(doc.querySelector(".task-table tr")).display.startsWith("table"), "Rows are not laid out as a table.");

  return `No horizontal overflow or clipping at ${width}px. Summary cards in one row, Add New Task controls in one row, and the Task List shown as a table with a header row.`;
}

function testTabletLayout() {
  const width = checkNoOverflow("tablet");
  const doc = docOf("tablet");
  const cards = [...doc.querySelectorAll(".summary-card")];
  const [title, date, status, button] = [...doc.querySelectorAll(".add-task-form > *")];
  const form = doc.querySelector(".add-task-form");

  assert(sameRow(cards), "Summary cards are not on one row.");
  assert(rect(title).width >= rect(form).width * 0.95 && rect(date).top >= rect(title).bottom - 1, "Title field does not take its own full-width row.");
  assert(sameRow([date, status, button]), "Date, status and button are not on one row.");
  assert(winOf("tablet").getComputedStyle(doc.querySelector(".task-table tr")).display.startsWith("table"), "Rows are not laid out as a table.");

  return `No horizontal overflow or clipping at ${width}px. Summary cards in one row, title field on its own full-width row with date, status and button below it, and the Task List still shown as a table.`;
}

function testMobileLayout() {
  const width = checkNoOverflow("mobile");
  const doc = docOf("mobile");
  const win = winOf("mobile");
  const cards = [...doc.querySelectorAll(".summary-card")];
  const controls = [...doc.querySelectorAll(".add-task-form > *")];
  const row = doc.querySelector("#task-rows tr");
  const [title, status, due, actions] = [...row.children];

  assert(stacked(cards), "Summary cards are not stacked.");
  assert(stacked(controls), "Add New Task controls are not stacked.");
  assert(win.getComputedStyle(row).display === "grid", "Task rows are not rendered as cards.");
  const thead = doc.querySelector(".task-table thead");
  assert(rect(thead).width <= 1, "Table header is still visible (screen-reader only expected).");
  assert(sharesRow(title, actions), "Task title and action icons are not on the same line.");
  assert(sharesRow(status, due), "Status and due date are not on the same line.");
  assert(rect(status).top >= rect(title).bottom - 1 && rect(due).top >= rect(actions).bottom - 1, "Status and due date are not below the title and actions.");

  // The icons must sit at the right edge of the card, in line with the due date
  const lastIcon = actions.querySelector(".icon-button--delete");
  const offset = Math.abs(rect(lastIcon).right - rect(due).right);
  assert(offset <= 12, `Action icons are ${Math.round(offset)}px from the right edge of the due date column.`);

  return `No horizontal overflow or clipping at ${width}px. Summary cards and form controls stacked, and each task shown as a card (title and actions above status and due date) with the table header visually hidden.`;
}

// ---- Feedback containers ----

async function testFeedbackContainers() {
  const frame = await loadFrame("feedback", { label: "Feedback containers (desktop, success message and loading state shown)", width: 1280 });
  const doc = frame.contentDocument;
  const win = frame.contentWindow;
  const feedback = doc.querySelector("#feedback");
  const listState = doc.querySelector("#list-state");

  feedback.hidden = false;
  feedback.className = "feedback feedback--success";
  feedback.textContent = "Task created successfully.";
  listState.hidden = false;
  listState.textContent = "Loading tasks...";
  frame.style.height = `${doc.documentElement.scrollHeight}px`;

  assert(rect(feedback).height > 20 && rect(listState).height > 20, "Feedback containers have no visible size when shown.");
  const successColour = win.getComputedStyle(feedback).backgroundColor;

  feedback.className = "feedback feedback--error";
  const errorColour = win.getComputedStyle(feedback).backgroundColor;
  assert(successColour !== errorColour, "Success and error feedback look the same.");
  const ratio = contrast(win.getComputedStyle(feedback).color, errorColour);
  assert(ratio >= 4.5, `Error message contrast ${ratio.toFixed(2)}:1 is below 4.5:1.`);

  feedback.className = "feedback feedback--success";
  assert(doc.documentElement.scrollWidth <= doc.documentElement.clientWidth, "Showing feedback caused horizontal overflow.");

  return "Success and error message styles and the loading/empty message area are visible, styled differently from each other, readable (error contrast at least 4.5:1), and cause no overflow when shown. (Manually revealed for this check; the containers are not used until Stage 3.2.)";
}

// ---- Layer separation ----

async function testNoDataLayerAccess() {
  const entries = winOf("desktop").performance.getEntriesByType("resource").map((e) => e.name);
  const remote = entries.filter((name) => /gstatic|firebase|firestore|googleapis/i.test(name));
  assert(remote.length === 0, `Firebase-related requests found: ${remote.join(", ")}`);

  const source = await (await fetch(APP_SOURCE_URL)).text();
  const imports = source.match(/^\s*import\s[^;]*$/gm) || [];
  assert(imports.length === 0, `app.js has import statements: ${imports.join(" | ")}`);

  const html = await (await fetch(PAGE_URL)).text();
  assert(!/firebase|taskService|taskAppService/i.test(html), "index.html references Firebase or a service module.");

  return `The page loaded ${entries.length} resources (none Firebase-related); app.js has no import statements and index.html references no Firebase or service module.`;
}

async function runUiChecks() {
  console.log("Starting Stage 3.1 UI structure and styling checks (mock data, no Firestore)...");

  await loadFrame("desktop", VIEWPORTS.desktop);
  await loadFrame("tablet", VIEWPORTS.tablet);
  await loadFrame("mobile", VIEWPORTS.mobile);

  await runTest("T09", "Dashboard structure and components", "Header, summary cards, Add New Task controls, Task List table and rows, and feedback containers are present as in the design reference.", testStructure);
  await runTest("T10", "Status indicators and due date presentation", "Each status has its own indicator; due dates are shown as \"Mon D, YYYY\" or \"No due date\"; summary counts match the data.", testStatusAndDueDates);
  await runTest("T11", "Text readability (contrast)", "Status indicators, task titles, due dates and labels have at least 4.5:1 contrast.", testReadability);
  await runTest("T12", "Desktop layout (1280px)", "Three summary cards in a row, one-row form, table list; no overflow or clipping.", testDesktopLayout);
  await runTest("T13", "Tablet layout (820px)", "Summary cards in a row, title field on its own row above date/status/button, table list; no overflow or clipping.", testTabletLayout);
  await runTest("T14", "Mobile layout (390px)", "Stacked summary cards and form controls, task rows as cards; no overflow or clipping.", testMobileLayout);
  await runTest("T15", "Feedback containers", "Success, error, and loading/empty message areas are visible, distinct, readable, and cause no overflow when shown.", testFeedbackContainers);
  await runTest("T16", "No Firestore or Data Layer access", "The static dashboard makes no Firebase requests and imports no Data Layer or Application Layer module.", testNoDataLayerAccess);

  const passed = results.filter((r) => r.status === "Pass").length;
  console.table(results.map(({ id, scenario, status }) => ({ id, scenario, status })));
  console.log(`Summary: ${passed}/${results.length} passed, ${results.length - passed} not passed.`);
  renderResults();
}

function renderResults() {
  const lines = results.map(
    (r) => `${r.id} [${r.status}] ${r.scenario}\n  Expected: ${r.expected}\n  Actual: ${r.actual}`
  );
  const passed = results.filter((r) => r.status === "Pass").length;
  lines.push(`\nSummary: ${passed}/${results.length} passed.`);
  document.getElementById("output").textContent = lines.join("\n");
}

document.getElementById("run").addEventListener("click", async (event) => {
  event.target.disabled = true;
  try {
    await runUiChecks();
  } catch (error) {
    console.error("UI check run failed:", error);
    document.getElementById("output").textContent = `Run failed: ${error.message}`;
  }
});
