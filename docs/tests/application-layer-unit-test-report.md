# Application Layer Unit Test Report

**Component under test:** `services/taskAppService.js` (using `services/taskValidation.js`)
**Test code:** `tests/unit/taskAppService.test.mjs`
**Raw execution output:** `docs/tests/application-layer-unit-test-output.txt`
**Execution date:** 2026-11-14
**Environment:** Node v22.16.0, Node built-in test runner

## How to Run

From the project root:

```
node --experimental-test-module-mocks --test --test-reporter=spec "tests/unit/*.test.mjs"
```

No Firebase credentials or network access are required.

## Approach

- The tests import the real `services/taskAppService.js` and `services/taskValidation.js`. No Application Layer code is copied into the test file.
- The real Data Layer (`taskService.js`) is replaced with a stub using Node's `mock.module()` (experimental flag `--experimental-test-module-mocks`). The stub records every call and returns fixed values.
- No change to production code was needed.
- Every rejection test also asserts that the Data Layer stub received zero calls.
- These tests do **not** exercise real Firestore. Data Layer behaviour with Firestore is covered by T05–T08 in `testing-journal.md`.

## Summary

| Tests | Passed | Failed | Skipped |
| ----- | ------ | ------ | ------- |
| 23    | 23     | 0      | 0       |

Exit code: 0.

## Test Cases and Results

"Actual Result" is taken from the execution output.

### Create

| ID  | Test Description | Expected Result | Actual Result | Status |
| --- | ---------------- | --------------- | ------------- | ------ |
| U01 | Valid task creation | Data Layer receives the task; its result is returned. | Returned `"stub-task-id"`; payload `{"title":"Write report","status":"In Progress","dueDate":"2026-12-01T00:00:00.000Z"}`. | Pass |
| U02 | Status omitted | Status defaults to `To Do`. | Payload `{"title":"Write report","status":"To Do","dueDate":null}`. | Pass |
| U03 | `dueDate` omitted | `dueDate` defaults to `null`; payload has exactly `title`, `status`, `dueDate`. | Payload `{"title":"Write report","status":"Completed","dueDate":null}`. | Pass |
| U04 | Explicit `null` `dueDate` | Accepted and passed through as `null`. | Payload `{"title":"Write report","status":"To Do","dueDate":null}`. | Pass |
| U05 | Title with surrounding spaces | Title is trimmed before saving. | Title saved as `"Write report"`. | Pass |
| U06 | Whitespace-only title | Rejected; Data Layer not called. | Rejected, Data Layer calls = 0. | Pass |
| U07 | Invalid status (`Done`) | Rejected; Data Layer not called. | Rejected, Data Layer calls = 0. | Pass |
| U08 | Invalid `dueDate` (string) | Rejected; Data Layer not called. | Rejected, Data Layer calls = 0. | Pass |
| U09 | Invalid `dueDate` (invalid `Date` object) | Rejected; Data Layer not called. | Rejected, Data Layer calls = 0. | Pass |

### Read

| ID  | Test Description | Expected Result | Actual Result | Status |
| --- | ---------------- | --------------- | ------------- | ------ |
| U10 | `getTasks()` | Returns the Data Layer result; Data Layer called once. | Returned 1 task; Data Layer called once. | Pass |

### Update

| ID  | Test Description | Expected Result | Actual Result | Status |
| --- | ---------------- | --------------- | ------------- | ------ |
| U11 | Title-only update | Data Layer receives the ID and only the trimmed title. | Received `["task-1",{"title":"New title"}]`. | Pass |
| U12 | Status-only update | Data Layer receives only `status`; no default status or other fields added. | Received `["task-1",{"status":"Completed"}]`. | Pass |
| U13 | Update omitting `dueDate` | `dueDate` not present in the update payload. | Payload `{"title":"New title"}`. | Pass |
| U14 | Update with explicit `null` `dueDate` | Accepted and passed through. | Received `["task-1",{"dueDate":null}]`. | Pass |
| U15 | Empty update object | Rejected; Data Layer not called. | Rejected, Data Layer calls = 0. | Pass |
| U16 | Unsupported field (`priority`) | Rejected; Data Layer not called. | Rejected, Data Layer calls = 0. | Pass |
| U17 | Explicit `undefined` value (`title`) | Rejected; Data Layer not called. | Rejected, Data Layer calls = 0. | Pass |
| U18 | Invalid status value | Rejected; Data Layer not called. | Rejected, Data Layer calls = 0. | Pass |
| U19 | Empty task ID | Rejected; Data Layer not called. | Rejected, Data Layer calls = 0. | Pass |
| U20 | Non-string task ID | Rejected; Data Layer not called. | Rejected, Data Layer calls = 0. | Pass |

### Delete

| ID  | Test Description | Expected Result | Actual Result | Status |
| --- | ---------------- | --------------- | ------------- | ------ |
| U21 | Valid task ID | Data Layer `deleteTask` called with the ID. | Data Layer called with `"task-1"`. | Pass |
| U22 | Empty (whitespace) task ID | Rejected; Data Layer not called. | Rejected, Data Layer calls = 0. | Pass |
| U23 | `undefined` task ID | Rejected; Data Layer not called. | Rejected, Data Layer calls = 0. | Pass |

## Test Sensitivity Check

To confirm the tests detect real defects, a copy of the project in a temporary directory was modified (outside the project, not committed) by removing the `dueDate` default in `createTask()` and the ID validation in `deleteTask()`. The suite then failed U03, U05, U22 and U23 (19 passed, 4 failed). The production code in the project was not changed for this check.

## Notes

- IDs `U01`–`U23` are unit test IDs for this suite. They are separate from the `T01`–`T08` records in `testing-journal.md`, and no entries have been added to the Testing Log.
- Node prints an `ExperimentalWarning` for module mocking. It does not affect results.
- Stage 2 is not marked as completed. Stage 2 Step 4 (Test Application Layer) in the development journal has not been updated.
