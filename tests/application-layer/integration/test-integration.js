import { db } from "../../../firebase.js";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../../../services/taskAppService.js";
import {
  collection,
  getDoc,
  getDocs,
  doc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";

const TEST_PREFIX = "IT-";
const results = [];
const createdIds = new Set();

// Test task shared by IT01 and the tests that depend on it
const sharedTask = {
  id: null,
  title: `${TEST_PREFIX}Task ${Date.now()}`,
  status: "To Do",
  dueDate: new Date("2026-12-31T00:00:00.000Z"),
};

// Read a document directly from Firestore, independent of the code under test
async function readStoredTask(taskId) {
  const snapshot = await getDoc(doc(db, "tasks", taskId));
  return snapshot.exists() ? snapshot.data() : null;
}

// Run one test and record its expected and actual result
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
  console.log(
    `${result.id} [${result.status}] ${result.scenario}\n  Expected: ${result.expected}\n  Actual: ${result.actual}`
  );
}

function requireSharedTask() {
  if (!sharedTask.id) {
    const error = new Error("Blocked: IT01 did not create the shared test task.");
    error.blocked = true;
    throw error;
  }
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

async function testCreateTask() {
  const taskId = await createTask({
    title: sharedTask.title,
    status: sharedTask.status,
    dueDate: sharedTask.dueDate,
  });
  createdIds.add(taskId);
  sharedTask.id = taskId;

  const stored = await readStoredTask(taskId);
  if (!stored) throw new Error(`Document ${taskId} not found in Firestore.`);

  assertEqual(stored.title, sharedTask.title, "title");
  assertEqual(stored.status, sharedTask.status, "status");
  assertEqual(stored.dueDate?.toMillis(), sharedTask.dueDate.getTime(), "dueDate (ms)");
  return `Document ${taskId} stored with title "${stored.title}", status "${stored.status}", dueDate ${stored.dueDate.toDate().toISOString()}.`;
}

async function testDefaultStatus() {
  const taskId = await createTask({
    title: `${TEST_PREFIX}Default status ${Date.now()}`,
    dueDate: null,
  });
  createdIds.add(taskId);

  const stored = await readStoredTask(taskId);
  if (!stored) throw new Error(`Document ${taskId} not found in Firestore.`);

  assertEqual(stored.status, "To Do", "status");
  return `Stored status is "${stored.status}".`;
}

async function testDefaultDueDate() {
  const taskId = await createTask({
    title: `${TEST_PREFIX}Default dueDate ${Date.now()}`,
    status: "To Do",
  });
  createdIds.add(taskId);

  const stored = await readStoredTask(taskId);
  if (!stored) throw new Error(`Document ${taskId} not found in Firestore.`);

  assertEqual(stored.dueDate, null, "dueDate");
  return `Stored dueDate is ${stored.dueDate}.`;
}

async function testReadTasks() {
  requireSharedTask();

  const tasks = await getTasks();
  const found = tasks.find((task) => task.id === sharedTask.id);
  if (!found) throw new Error(`Task ${sharedTask.id} not in ${tasks.length} returned task(s).`);

  assertEqual(found.title, sharedTask.title, "title");
  return `Test task found among ${tasks.length} returned task(s) with its ID and title.`;
}

async function testPartialUpdate() {
  requireSharedTask();

  const newTitle = `${sharedTask.title} (updated)`;
  await updateTask(sharedTask.id, { title: newTitle });

  const stored = await readStoredTask(sharedTask.id);
  if (!stored) throw new Error(`Document ${sharedTask.id} not found in Firestore.`);

  assertEqual(stored.title, newTitle, "title");
  assertEqual(stored.status, sharedTask.status, "status");
  assertEqual(stored.dueDate?.toMillis(), sharedTask.dueDate.getTime(), "dueDate (ms)");
  sharedTask.title = newTitle;
  return `Title changed to "${stored.title}"; status "${stored.status}" and dueDate unchanged.`;
}

async function testUpdateStatus() {
  requireSharedTask();

  await updateTask(sharedTask.id, { status: "In Progress" });

  const tasks = await getTasks();
  const found = tasks.find((task) => task.id === sharedTask.id);
  if (!found) throw new Error(`Task ${sharedTask.id} not found after update.`);

  assertEqual(found.status, "In Progress", "status");
  return `Subsequent read returned status "${found.status}".`;
}

async function testDeleteTask() {
  requireSharedTask();

  await deleteTask(sharedTask.id);

  const stored = await readStoredTask(sharedTask.id);
  if (stored) throw new Error(`Document ${sharedTask.id} still exists after delete.`);
  return `Document ${sharedTask.id} no longer exists in Firestore.`;
}

async function testInvalidTask() {
  const idsBefore = new Set(
    (await getDocs(collection(db, "tasks"))).docs.map((d) => d.id)
  );

  let rejection = null;
  try {
    const taskId = await createTask({ title: "   ", status: "To Do", dueDate: null });
    createdIds.add(taskId); // Not expected; tracked so cleanup removes it
  } catch (error) {
    rejection = error;
  }

  if (!rejection) throw new Error("createTask() accepted an empty title.");

  // Any new document with an empty title means a record was created
  const after = await getDocs(collection(db, "tasks"));
  const newEmpty = after.docs.filter(
    (d) => !idsBefore.has(d.id) && String(d.data().title).trim() === ""
  );
  newEmpty.forEach((d) => createdIds.add(d.id));
  if (newEmpty.length > 0) {
    throw new Error(`Validation rejected the task but ${newEmpty.length} empty-title document(s) were created.`);
  }

  return `Rejected with "${rejection.message}"; no new document with an empty title in Firestore.`;
}

// Delete every document created by this script; report errors separately
async function cleanup() {
  const cleanupErrors = [];
  let deleted = 0;

  for (const taskId of createdIds) {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      deleted++;
    } catch (error) {
      cleanupErrors.push(`${taskId}: ${error.message}`);
    }
  }

  console.log(`Cleanup: attempted ${createdIds.size} document(s), ${deleted} deleted, ${cleanupErrors.length} error(s).`);
  cleanupErrors.forEach((message) => console.error("Cleanup error:", message));
  return { attempted: createdIds.size, deleted, cleanupErrors };
}

async function runIntegrationTests() {
  console.log("Starting Application Layer Integration Tests (real Firestore)...");
  let cleanupSummary = null;

  try {
    await runTest("IT01", "Create task with valid data", "Document exists in Firestore with the expected title, status, and dueDate.", testCreateTask);
    await runTest("IT02", "Create task without status", "Stored status is \"To Do\".", testDefaultStatus);
    await runTest("IT03", "Create task without dueDate", "Stored dueDate is null.", testDefaultDueDate);
    await runTest("IT04", "Read tasks through the Application Layer", "The test task appears in the returned results.", testReadTasks);
    await runTest("IT05", "Partial update (title only)", "Title changes; status and dueDate remain unchanged.", testPartialUpdate);
    await runTest("IT06", "Update status to In Progress", "A subsequent read returns status \"In Progress\".", testUpdateStatus);
    await runTest("IT07", "Delete task through the Application Layer", "The document no longer exists in Firestore.", testDeleteTask);
    await runTest("IT08", "Create task with an empty title", "Validation rejects it and no corresponding document is created.", testInvalidTask);
  } finally {
    cleanupSummary = await cleanup();
  }

  const passed = results.filter((r) => r.status === "Pass").length;
  console.table(results.map(({ id, scenario, status }) => ({ id, scenario, status })));
  console.log(`Summary: ${passed}/${results.length} passed, ${results.length - passed} not passed.`);

  renderResults(cleanupSummary);
}

function renderResults(cleanupSummary) {
  const lines = results.map(
    (r) => `${r.id} [${r.status}] ${r.scenario}\n  Expected: ${r.expected}\n  Actual: ${r.actual}`
  );
  const passed = results.filter((r) => r.status === "Pass").length;
  lines.push(`\nSummary: ${passed}/${results.length} passed.`);
  lines.push(
    `Cleanup: ${cleanupSummary.deleted}/${cleanupSummary.attempted} test document(s) deleted, ${cleanupSummary.cleanupErrors.length} cleanup error(s).`
  );
  cleanupSummary.cleanupErrors.forEach((message) => lines.push(`  Cleanup error: ${message}`));
  document.getElementById("output").textContent = lines.join("\n");
}

document.getElementById("run").addEventListener("click", async (event) => {
  event.target.disabled = true;
  try {
    await runIntegrationTests();
  } catch (error) {
    console.error("Integration test run failed:", error);
    document.getElementById("output").textContent = `Run failed: ${error.message}`;
  } finally {
    event.target.disabled = false;
  }
});
