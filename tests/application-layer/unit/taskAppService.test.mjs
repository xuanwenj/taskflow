// Unit tests for the Application Layer (services/taskAppService.js).
// The real Data Layer (taskService.js) is replaced with a stub so no Firebase
// connection is needed. Run from the project root:
//   node --experimental-test-module-mocks --test "tests/application-layer/unit/*.test.mjs"
import assert from "node:assert/strict";
import { beforeEach, mock, test } from "node:test";
import { pathToFileURL } from "node:url";

const calls = [];

const dataLayerStub = {
  createTask: async (taskData) => {
    calls.push(["createTask", taskData]);
    return "stub-task-id";
  },
  getTasks: async () => {
    calls.push(["getTasks"]);
    return [{ id: "task-1", title: "Stub Task", status: "To Do", dueDate: null }];
  },
  updateTask: async (taskId, updatedData) => {
    calls.push(["updateTask", taskId, updatedData]);
  },
  deleteTask: async (taskId) => {
    calls.push(["deleteTask", taskId]);
  },
};

// Replace the real Data Layer before the Application Layer is imported
mock.module(
  pathToFileURL(new URL("../../../taskService.js", import.meta.url).pathname).href,
  { namedExports: dataLayerStub }
);

const { createTask, getTasks, updateTask, deleteTask } = await import(
  "../../../services/taskAppService.js"
);

const dueDate = new Date("2026-12-01T00:00:00.000Z");

beforeEach(() => {
  calls.length = 0;
});

// Assert that the call is rejected and the Data Layer is never reached
async function assertRejected(t, promise, message) {
  const error = await assert.rejects(promise, message);
  assert.equal(calls.length, 0, "Data Layer must not be called");
  t.diagnostic(`Actual: rejected, Data Layer calls = 0`);
  return error;
}

// ---- Create ----

test("U01 createTask: valid task is passed to the Data Layer and its result returned", async (t) => {
  const result = await createTask({ title: "Write report", status: "In Progress", dueDate });
  assert.equal(result, "stub-task-id");
  assert.deepEqual(calls, [
    ["createTask", { title: "Write report", status: "In Progress", dueDate }],
  ]);
  t.diagnostic(`Actual: returned "${result}", payload ${JSON.stringify(calls[0][1])}`);
});

test("U02 createTask: status defaults to 'To Do' when omitted", async (t) => {
  await createTask({ title: "Write report", dueDate: null });
  assert.equal(calls[0][1].status, "To Do");
  t.diagnostic(`Actual: payload ${JSON.stringify(calls[0][1])}`);
});

test("U03 createTask: dueDate defaults to null when omitted", async (t) => {
  await createTask({ title: "Write report", status: "Completed" });
  assert.equal(calls[0][1].dueDate, null);
  assert.deepEqual(Object.keys(calls[0][1]), ["title", "status", "dueDate"]);
  t.diagnostic(`Actual: payload ${JSON.stringify(calls[0][1])}`);
});

test("U04 createTask: explicit null dueDate is accepted", async (t) => {
  await createTask({ title: "Write report", dueDate: null });
  assert.equal(calls[0][1].dueDate, null);
  t.diagnostic(`Actual: payload ${JSON.stringify(calls[0][1])}`);
});

test("U05 createTask: title is trimmed before saving", async (t) => {
  await createTask({ title: "  Write report  " });
  assert.equal(calls[0][1].title, "Write report");
  t.diagnostic(`Actual: title saved as "${calls[0][1].title}"`);
});

test("U06 createTask: empty title is rejected", async (t) => {
  await assertRejected(t, createTask({ title: "   " }), /title cannot be empty/i);
});

test("U07 createTask: invalid status is rejected", async (t) => {
  await assertRejected(t, createTask({ title: "A", status: "Done" }), /invalid task status/i);
});

test("U08 createTask: invalid dueDate (string) is rejected", async (t) => {
  await assertRejected(t, createTask({ title: "A", dueDate: "2026-12-01" }), /due date must be/i);
});

test("U09 createTask: invalid dueDate (invalid Date object) is rejected", async (t) => {
  await assertRejected(t, createTask({ title: "A", dueDate: new Date("not a date") }), /not a valid date/i);
});

// ---- Read ----

test("U10 getTasks: returns the Data Layer result", async (t) => {
  const tasks = await getTasks();
  assert.deepEqual(tasks, [
    { id: "task-1", title: "Stub Task", status: "To Do", dueDate: null },
  ]);
  assert.deepEqual(calls, [["getTasks"]]);
  t.diagnostic(`Actual: returned ${tasks.length} task(s), Data Layer called once`);
});

// ---- Update ----

test("U11 updateTask: valid title-only update", async (t) => {
  await updateTask("task-1", { title: "  New title  " });
  assert.deepEqual(calls, [["updateTask", "task-1", { title: "New title" }]]);
  t.diagnostic(`Actual: Data Layer received ${JSON.stringify(calls[0].slice(1))}`);
});

test("U12 updateTask: valid status-only update (no default status or other fields added)", async (t) => {
  await updateTask("task-1", { status: "Completed" });
  assert.deepEqual(calls, [["updateTask", "task-1", { status: "Completed" }]]);
  t.diagnostic(`Actual: Data Layer received ${JSON.stringify(calls[0].slice(1))}`);
});

test("U13 updateTask: omitting dueDate leaves it out of the update payload", async (t) => {
  await updateTask("task-1", { title: "New title" });
  assert.equal("dueDate" in calls[0][2], false);
  t.diagnostic(`Actual: payload ${JSON.stringify(calls[0][2])}`);
});

test("U14 updateTask: explicit null dueDate is accepted", async (t) => {
  await updateTask("task-1", { dueDate: null });
  assert.deepEqual(calls, [["updateTask", "task-1", { dueDate: null }]]);
  t.diagnostic(`Actual: Data Layer received ${JSON.stringify(calls[0].slice(1))}`);
});

test("U15 updateTask: empty update is rejected", async (t) => {
  await assertRejected(t, updateTask("task-1", {}), /cannot be empty/i);
});

test("U16 updateTask: unsupported field is rejected", async (t) => {
  await assertRejected(t, updateTask("task-1", { title: "A", priority: "high" }), /unsupported task field: priority/i);
});

test("U17 updateTask: explicit undefined value is rejected", async (t) => {
  await assertRejected(t, updateTask("task-1", { title: undefined }), /title must be a string/i);
});

test("U18 updateTask: invalid status value is rejected", async (t) => {
  await assertRejected(t, updateTask("task-1", { status: "Done" }), /invalid task status/i);
});

test("U19 updateTask: empty task ID is rejected", async (t) => {
  await assertRejected(t, updateTask("", { title: "A" }), /task id must be a non-empty string/i);
});

test("U20 updateTask: non-string task ID is rejected", async (t) => {
  await assertRejected(t, updateTask(42, { title: "A" }), /task id must be a non-empty string/i);
});

// ---- Delete ----

test("U21 deleteTask: valid task ID is passed to the Data Layer", async (t) => {
  await deleteTask("task-1");
  assert.deepEqual(calls, [["deleteTask", "task-1"]]);
  t.diagnostic(`Actual: Data Layer called with "${calls[0][1]}"`);
});

test("U22 deleteTask: empty task ID is rejected", async (t) => {
  await assertRejected(t, deleteTask("  "), /task id must be a non-empty string/i);
});

test("U23 deleteTask: undefined task ID is rejected", async (t) => {
  await assertRejected(t, deleteTask(undefined), /task id must be a non-empty string/i);
});
