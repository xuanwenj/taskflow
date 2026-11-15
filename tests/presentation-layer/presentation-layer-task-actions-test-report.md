# Stage 3.3 — Create, Edit, Delete and Status Interactions: Test Report

**Tests:** T26–T37 · **Date:** 2026-11-15 · **Browser:** Chrome
**Test page:** `tests/presentation-layer/test-task-actions.html` (code: `test-task-actions.js`)
**Execution record:** `presentation-layer-task-actions-test-output.txt` (all four runs)
**Evidence:** `evidence/stage33-create-success-and-failure-feedback.jpg`, `evidence/stage33-edit-mode.jpg`, `evidence/stage33-edit-mode-before-icon-fix.jpg`, `evidence/stage33-delete-dialog.jpg`

## Objective

Verify that a task can be created, edited, deleted and have its status changed through the dashboard, via the Application Layer, with correct feedback, correct summary cards, and no false success when an operation fails.

## Approach and environment

- Served with `python3 -m http.server 8000` from the project root; the **Run Interaction Tests** button runs everything.
- **Real-data tests (T26–T33):** the unchanged `index.html` and `app.js` are driven through the DOM (fill the form, click the pencil, delete icon, dialog buttons, change the status select) against the real Cloud Firestore database. Each result is verified with an independent Firestore read (Firestore SDK in the test code).
- **Controlled tests (T34, T35):** the real `initApp()` is run with a stub of the Application Layer to produce failures and to record the arguments of each call.
- **T36:** real dashboard at 1280, 820 and 390 px; edit mode and the dialog are opened and cancelled (no writes).
- **Data safety:** test records are titled `[TEST] … <run id>`. Fixtures are created through the Application Layer and removed at the end of the run; T37 checks that all 43 pre-existing documents are unchanged and that the collection has the same count as at the start. No existing record was modified or deleted.
- The Data Layer and Application Layer were not modified.

## Results (final run, Run 4)

| ID | Test | Expected | Actual | Status |
| -- | ---- | -------- | ------ | ------ |
| T26 | Create task (real) | Stored with title, status, local due date; shown in list; cards update; form resets; success message; defaults when omitted | Stored (In Progress, 2026-12-31), shown as "Dec 31, 2026", Total 43→44, In Progress 0→1, form reset, "added" message; title-only task stored as To Do with null due date | Pass |
| T27 | Empty title rejected (real) | Error from Application Layer, no record, list unchanged | "Task title cannot be empty." for empty and whitespace titles; 45 documents before and after | Pass |
| T28 | Edit task (real) | Form prefilled; title and date saved, status kept; empty title rejected; + icon hidden in edit mode | All as expected; record verified in Firestore | Pass |
| T29 | Cancel edit (real) | Record and list unchanged; form back to add mode | Record identical before and after; form reset; + icon restored | Pass |
| T30 | Confirm delete (real) | Dialog first; removed only after confirming; cards update | Record existed while the dialog was open; after Delete gone from Firestore and list; Total 48→47, Completed 1→0 | Pass |
| T31 | Cancel delete (real) | Nothing deleted | Dialog closed; record, row and cards unchanged | Pass |
| T32 | Change status (real) | Each status saved, shown, persists after reload | In Progress → Completed → To Do saved; "Completed" still shown after reload | Pass |
| T33 | Cards after changes | Cards equal a Firestore tally after every step | Matched after create, In Progress, Completed and delete | Pass |
| T34 | Failures not shown as success (stub) | Error message, no success wording, state unchanged | All four operations showed the error; form text kept, edit mode kept, select reverted, row kept | Pass |
| T35 | Application Layer calls and layer separation | Correct arguments; changed fields only; no Data Layer import | As expected; `app.js` imports only `./taskListView.js` and `./services/taskAppService.js` | Pass |
| T36 | Layout of new controls | No overflow; dialog and buttons visible; select covers the pill | OK at 1280, 820 and 390 px | Pass |
| T37 | Data safety and cleanup | Pre-existing documents unchanged; count equals start | 43 unchanged; final count 43 | Pass |

**Regression:** the Stage 3.2 checks T18–T25 were rerun after the changes: 8 of 8 passed.

## Issues found during testing

| # | Issue | Found by | Resolution |
| - | ----- | -------- | ---------- |
| 1 | T29 failed in Run 1: the test compared Firestore data as text and the key order differed between two reads (values identical). | Test run | Test helper made order-independent. Not an application defect. |
| 2 | The "+" icon stayed on the "Save Changes" button in edit mode (`.hidden` is not a property of SVG elements). No test covered it. | Review of the edit-mode screenshot (`evidence/stage33-edit-mode-before-icon-fix.jpg`) | `app.js` now uses `toggleAttribute("hidden", …)`; checks added to T28 and T29; confirmed in `evidence/stage33-edit-mode.jpg`. |
| 3 | T28 failed in Run 3 on the new check: the browser appeared to serve a cached copy of the old `app.js`. | Test run | Cached files refreshed, no code change; passed in Run 4. |
| 4 | T26's recorded text showed counts taken after the second create. | Review of Run 2 | Test text corrected. |

## Evidence observations

- `stage33-create-success-and-failure-feedback.jpg`: green "added" message (real data) next to the red error message from a failed operation (stub).
- `stage33-edit-mode.jpg`: "Edit Task" heading, Save Changes and Cancel, the edited row highlighted.
- `stage33-delete-dialog.jpg`: delete confirmation naming the task.
- `stage33-edit-mode-before-icon-fix.jpg`: the defect in issue 2, kept as a record.

## Limitations

- Interactions are driven with DOM events (clicks, `requestSubmit`, `change` events, input values), not a real mouse or keyboard. The native date picker and the native status dropdown list were not operated visually; pressing Esc to close the dialog and keyboard navigation were not tested.
- A real network failure was not simulated; failures use a stub that rejects. A failed refresh after a successful write was not tested.
- The Firestore Console was not used; persistence was checked with an independent Firestore SDK read and by reloading the page.
- The tests wrote and removed `[TEST]` records in the real database in every run; the collection was back at 43 documents after each run.
- The status select is an invisible native select over the pill; its look and behaviour were checked only through the layout check (T36) and the screenshots, in Chrome.
- Mobile layout of edit mode and the dialog was checked by measurements only (no screenshot).
- Chrome only. T09–T17 (Stage 3.1 static page) were not rerun.
