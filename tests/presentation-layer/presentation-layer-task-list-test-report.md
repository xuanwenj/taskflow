# Stage 3.2 — Task List and Application Layer Integration: Test Report

**Tests:** T18–T25 · **Date:** 2026-11-15 · **Browser:** Chrome
**Test page:** `tests/presentation-layer/test-task-list.html` (code: `test-task-list.js`)
**Execution record:** `presentation-layer-task-list-test-output.txt`
**Evidence:** `evidence/stage32-real-dashboard-desktop.jpg`, `evidence/stage32-empty-and-error-states.jpg`, `evidence/stage32-loading-empty-error-states.jpg`

## Objective

Verify that the dashboard loads real tasks through the Application Layer (`getTasks()`), renders title, status and due date, calculates the summary cards from the loaded data, and shows correct loading, empty and error states.

## Approach and environment

- Served with `python3 -m http.server 8000` from the project root; the **Run Task List Tests** button runs the checks.
- **Real-data tests (T18–T22):** the unchanged `index.html` and `app.js` load in an iframe and read the real Cloud Firestore collection through the Application Layer. The test page compares the result with an independent, read-only Firestore query. No document was created, changed or deleted (43 read).
- **State tests (T23–T25):** the dashboard markup is loaded without `app.js` and the real view (`taskListView.js`) is driven with controlled task sources (pending, empty array, rejection).
- The Data Layer and Application Layer were not modified.

## Results

| ID | Test | Expected | Actual | Status |
| -- | ---- | -------- | ------ | ------ |
| T18 | Real task loading through the Application Layer | One row per stored task, same ids; Presentation Layer imports only the Application Layer | 43 rows for 43 stored tasks, ids identical; `app.js` imports `./taskListView.js` and `./services/taskAppService.js` only; `taskListView.js` has no imports | Pass |
| T19 | Title rendering | Row title equals stored title | 43 of 43 exact matches | Pass |
| T20 | Status rendering | Status text and class match stored status | Real: 43 To Do, all match. In Progress and Completed verified with controlled tasks (text, class, three distinct colours) | Pass (controlled data for 2 of 3 statuses) |
| T21 | Due date rendering incl. null | "Mon D, YYYY" or "No due date" | Real: 43 null, all "No due date". Controlled: Timestamp → "Jun 20, 2026", Date → "Dec 31, 2026", null and missing → "No due date" | Pass (controlled data for dated rows) |
| T22 | Summary card calculation | Cards equal Firestore counts; known counts for controlled data | Real 43 / 0 / 0 (To Do 43) match. Controlled 2 To Do, 1 In Progress, 2 Completed → cards 5 / 1 / 2 | Pass |
| T23 | Loading state | Loading message, no rows, responsive, cleared after load | Shown, table hidden, counts as dashes; 14 timer ticks in 300 ms and typing worked; 5 rows after resolve | Pass |
| T24 | Empty state | Empty message, no error style, counts 0 | "No tasks yet. Add your first task above."; table hidden; counts 0 / 0 / 0 | Pass |
| T25 | Error state | Error message and style, not shown as empty, counts not 0 | "Could not load tasks. …" with error style; table hidden; counts as dashes; synchronous failure handled the same way | Pass |

**Overall:** 8 of 8 passed in Run 1 and in Run 2.

## Review finding: weak real-data coverage

Run 1 passed 8 of 8, but the real Firestore data holds only "To Do" tasks with null due dates (43 of 43). T20–T22 therefore never saw an In Progress or Completed task or a dated row in real data. T20 and T21 were extended with controlled tasks (real Firestore `Timestamp` objects, a `Date`, null, a missing value, all three statuses) and rerun (Run 2). Those cases are verified with controlled data, not real stored records; this is shown in the status column. No application code changed between runs.

## Evidence observations

- `stage32-real-dashboard-desktop.jpg`: the real dashboard shows Total Tasks 43, In Progress 0, Completed 0 and "To Do" rows with "No due date".
- `stage32-empty-and-error-states.jpg`: empty message (grey) and error message (red) in the Task List card.
- `stage32-loading-empty-error-states.jpg`: loading message with spinner, plus the empty and error states. The loading state is held open with a source that never resolves, because the real load finishes too fast to capture.

## Limitations

- Real data has no In Progress, Completed or dated tasks (see above).
- The loading state was tested with a controlled pending source, not with Developer Tools network throttling on the real page. The real Firestore failure path (network offline) was not tested; the error state was triggered by a rejecting stub.
- Responsiveness with real data was only checked ad hoc (no horizontal overflow at 1280, 820 and 390 px with 43 rows; see the execution record), not as a numbered test.
- The failure of `app.js`'s dynamic module import (for example the Firebase CDN being unreachable) is handled by the same try/catch but was not simulated.
- Chrome only. The Firestore Console comparison planned in the Stage 3 plan was replaced by an independent read through the Firestore SDK.
- The Stage 3.1 checks (T09–T17) were written for the mock-data page and were not rerun; they no longer describe the current page.
