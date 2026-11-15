# TaskFlow — Testing Journal

Companion to [development-journal.md](development-journal.md).

Test source files, suite reports, and execution outputs are stored by layer under `tests/` (see "Testing File Organisation" in the development journal).

## Testing Log

Records of tests and verification activities. Entries contain actual results only. Status values: **Passed**, **Failed**, **Blocked**, **Reviewed** (configuration review, not a functional test). Test IDs are sequential (T01, T02, ...).

| ID  | Test                            | Type                 | Status   |
| --- | ------------------------------- | -------------------- | -------- |
| T01 | Firebase Project Setup          | Manual Verification  | Passed   |
| T02 | Cloud Firestore Setup           | Manual Verification  | Passed   |
| T03 | Firestore Security Rules Review | Configuration Review | Reviewed |
| T04 | Firebase SDK Initialization     | Manual Smoke Test    | Passed   |
| T05 | Create Task                     | Manual Functional Test | Passed |
| T06 | Read Tasks                      | Manual Functional Test | Passed |
| T07 | Update Task                     | Manual Functional Test | Passed |
| T08 | Delete Task                     | Manual Functional Test | Passed |
| T09 | Dashboard Structure and Components | Automated DOM Check | Passed |
| T10 | Status Indicators and Due Date Presentation | Automated DOM Check | Passed |
| T11 | Text Readability (Contrast) | Automated DOM Check | Passed |
| T12 | Desktop Layout (1280 px) | Automated Layout Check | Passed |
| T13 | Tablet Layout (820 px) | Automated Layout Check | Passed |
| T14 | Mobile Layout (390 px) | Automated Layout Check | Passed (failed in Run 1) |
| T15 | Feedback Containers | Automated DOM Check | Passed |
| T16 | No Firestore or Data Layer Access | Automated Check | Passed |
| T17 | Visual Comparison with Design Reference | Manual Visual Review | Passed (with noted differences) |
| T18 | Real Task Loading via Application Layer | Browser Test (real Firestore, read-only) | Passed |
| T19 | Task Title Rendering | Browser Test (real Firestore, read-only) | Passed |
| T20 | Task Status Rendering | Browser Test (real + controlled data) | Passed (controlled data for 2 of 3 statuses) |
| T21 | Due Date Rendering (incl. null) | Browser Test (real + controlled data) | Passed (controlled data for dated rows) |
| T22 | Summary Card Calculations | Browser Test (real + controlled data) | Passed |
| T23 | Loading State | Browser Test (controlled source) | Passed |
| T24 | Empty State | Browser Test (controlled source) | Passed |
| T25 | Error State | Browser Test (controlled source) | Passed |
| T26 | Create Task | Browser Test (real Firestore) | Passed |
| T27 | Reject Empty Task Title | Browser Test (real Firestore) | Passed |
| T28 | Edit Task | Browser Test (real Firestore) | Passed |
| T29 | Cancel Edit | Browser Test (real Firestore) | Passed |
| T30 | Confirm Deletion | Browser Test (real Firestore) | Passed |
| T31 | Cancel Deletion | Browser Test (real Firestore) | Passed |
| T32 | Change Task Status | Browser Test (real Firestore) | Passed |
| T33 | Summary Cards After Changes | Browser Test (real Firestore) | Passed |
| T34 | Operation Failures Not Shown as Success | Browser Test (controlled stub) | Passed |
| T35 | Application Layer Calls and Layer Separation | Browser Test (stub + source check) | Passed |
| T36 | Layout of New Controls (desktop, tablet, mobile) | Browser Test (real dashboard) | Passed |
| T37 | Data Safety and Cleanup | Browser Test (real Firestore) | Passed |

### T01 — Firebase Project Setup

- **Type:** Manual Verification
- **Objective:** Verify successful Firebase project creation.
- **Method:** Check the project in Firebase Console.
- **Expected Result:** Firebase project is successfully created and accessible.
- **Actual Result:** TaskFlow project was successfully created and accessible.
- **Status:** Passed.

### T02 — Cloud Firestore Setup

- **Type:** Manual Verification
- **Objective:** Verify successful Firestore database creation.
- **Method:** Open the Firestore Database page in Firebase Console.
- **Expected Result:** Default database is created and available.
- **Actual Result:** Database `(default)` was created successfully. Firebase displayed "Your database is ready to go."
- **Status:** Passed.

### T03 — Firestore Security Rules Review

- **Type:** Configuration Review
- **Objective:** Check whether database access rules match the demo application's requirements.
- **Method:** Inspect the Firestore Security Rules.
- **Actual Result:** Read and write access is allowed until December 14, 2026.
- **Status:** Reviewed.
- **Note:** Actual read/write permissions have not yet been tested.

### T04 — Firebase SDK Initialization

- **Type:** Manual Smoke Test
- **Objective:** Verify that Firebase SDK and Firestore can be initialized in the frontend.
- **Method:**
  1. Import Firebase SDK modules.
  2. Initialize Firebase using `firebaseConfig`.
  3. Initialize Firestore using `getFirestore(app)`.
  4. Inspect browser Developer Tools Console.
- **Expected Result:** Firebase initializes successfully and a Firestore instance is available.
- **Actual Result:**
  - Success message (`Firebase initialized successfully!`) appeared in Console.
  - Firestore instance was returned.
  - Expected project ID `taskflow-5d179` was displayed.
- **Status:** Passed.
- **Note:** This does not verify actual database read/write operations.

### Minor Issue — Missing favicon

- **Issue:** Browser returned a 404 error for `favicon.ico`.
- **Impact:** No impact on Firebase functionality.
- **Status:** Non-blocking; can be addressed later.

### T05 — Create Task

- **Type:** Manual Functional Test
- **Objective:** Verify that a new task can be successfully created and stored in Cloud Firestore.
- **Test Data:**
  - title: `Test Task`
  - status: `To Do`
  - dueDate: `null`
- **Method:**
  1. Called `createTask()` from `app.js`.
  2. Passed the test task data to the function.
  3. Checked the browser Developer Tools Console.
  4. Verified the new document in the Firestore Console.
- **Expected Result:**
  - A new task document is created in the `tasks` collection.
  - All three fields are stored with the expected values.
  - A Firestore-generated document ID is returned.
- **Actual Result:**
  - The task was successfully created.
  - The expected task data was stored in Firestore.
  - A document ID was returned successfully.
- **Status:** Passed.
- **Note:** This verifies Create only. It also shows that the security rules currently permit writes. Read, Update, and Delete have not yet been tested.

### T06 — Read Tasks

- **Type:** Manual Functional Test
- **Objective:** Verify that existing task records can be retrieved from Cloud Firestore.
- **Method:**
  1. Called `getTasks()` from the independent test file.
  2. Retrieved documents from the `tasks` collection.
  3. Checked the returned task array in the browser Developer Tools Console.
  4. Verified that the previously created Test Task could be found.
  5. Checked its document ID and field values.
- **Expected Result:**
  - Tasks are successfully retrieved from Firestore.
  - The returned data contains the expected task fields.
  - Each task includes its Firestore document ID.
  - The previously created test task can be found.
- **Actual Result:**
  - Tasks were successfully retrieved.
  - The Test Task record was found.
  - Its document ID and task data were returned successfully.
- **Status:** Passed.

### T07 — Update Task

- **Type:** Manual Functional Test
- **Objective:** Verify that an existing task can be updated in Cloud Firestore.
- **Method:**
  1. Retrieved existing tasks using `getTasks()`.
  2. Located the test task using its title.
  3. Passed its Firestore document ID and updated data to `updateTask()`.
  4. Retrieved the task again to verify the changes.
- **Expected Result:**
  - The specified task is successfully updated.
  - The updated status is saved in Firestore.
  - Other task fields remain unchanged.
- **Actual Result:**
  - The test task was successfully located and updated.
  - The updated status was verified after retrieving the task again.
- **Status:** Passed.
- **Note:** Delete has not yet been tested.

### T08 — Delete Task

- **Type:** Manual Functional Test
- **Objective:** Verify that `deleteTask()` can delete an existing task from Firestore.
- **Method:** Retrieved the test task, used its document ID to delete it, then retrieved the remaining tasks to verify that the deleted record no longer existed.
- **Expected Result:** The selected task should be permanently removed from the Firestore `tasks` collection.
- **Actual Result:** The task was successfully deleted, and a subsequent read confirmed that the record no longer existed.
- **Status:** Passed.
- **Note:** With T05–T07, this completes functional testing of all four Data Layer operations.

## Stage 3.1 — UI Structure and Styling (Presentation Layer)

Tests T09–T17 were executed on 2026-11-15 against the static dashboard (`index.html`, `style.css`, `app.js`) using mock data; Firestore was not used. The test code, report, execution record, and screenshots are in `tests/presentation-layer/` (`test-ui-structure.html/.js`, `presentation-layer-ui-test-report.md`, `presentation-layer-ui-test-output.txt`, `evidence/`). The full expected and actual results are in the report; the summaries below match it.

**Testing environment**

| Item | Detail |
| ---- | ------ |
| Execution date | 2026-11-15 |
| Browser | Chrome (desktop) |
| Server | `python3 -m http.server` from the project root, page at `tests/presentation-layer/test-ui-structure.html` |
| Method | `index.html` loaded unchanged in iframes of fixed width so its own media queries respond; checks run from the **Run UI Checks** button |
| Viewport widths | 1280 px (desktop), 820 px (tablet), 390 px (mobile); a second 1280 px iframe for the feedback containers (T15) |
| Data | 12 static mock tasks; Firestore not used |
| Design reference | `docs/design/Clean TaskFlow Dashboard Interface.png` |

**Result overview:** Run 1: 7 of 8 automated checks passed (T14 failed). Run 2, after the T14 fix: 8 of 8 passed (T09–T16). T17 (manual visual review): passed with noted differences.

**Records and evidence** (all in `tests/presentation-layer/`)

- Report: `presentation-layer-ui-test-report.md`
- Execution output (both runs): `presentation-layer-ui-test-output.txt`
- Test page and code: `test-ui-structure.html`, `test-ui-structure.js`
- Screenshots in `evidence/` (6): `dashboard-desktop.jpg` (T09, T17), `desktop-1280-preview.jpg` (T12), `tablet-820-preview.jpg` (T13), `mobile-390-top.jpg` and `mobile-390-task-list.jpg` (T14, after the fix), `feedback-states-preview.jpg` (T15). T10, T11 and T16 have no screenshot; their evidence is the execution output.
- Missing evidence: no screenshot of the T14 defect from Run 1 was saved; the failure is recorded in the execution output only.

### T09 — Dashboard Structure and Components

- **Type:** Automated DOM Check (browser)
- **Objective:** Verify that the dashboard contains the components shown in the design reference.
- **Method:** Load `index.html` in an iframe and inspect the DOM from `test-ui-structure.js`.
- **Expected Result:** Header, summary cards, Add New Task controls, Task List table and rows, and feedback containers are present.
- **Actual Result:** Header, 3 summary cards, Add New Task controls, Task List table with 4 columns and 12 rows (status, due date, edit, delete in each), and hidden feedback containers are all present.
- **Status:** Passed.
- **Evidence:** `tests/presentation-layer/presentation-layer-ui-test-output.txt`; `evidence/dashboard-desktop.jpg`.

### T10 — Status Indicators and Due Date Presentation

- **Type:** Automated DOM Check (browser)
- **Objective:** Verify status indicators, due date formatting, and summary counts.
- **Method:** Inspect the rendered mock rows and summary cards.
- **Expected Result:** Each status has its own indicator; due dates are shown as "Mon D, YYYY" or "No due date"; summary counts match the data.
- **Actual Result:** Three distinct status colours; 11 dates in "Mon D, YYYY" format plus 1 "No due date"; summary counts 12/4/5 match the 12 mock rows.
- **Status:** Passed.
- **Evidence:** `presentation-layer-ui-test-output.txt`.

### T11 — Text Readability (Contrast)

- **Type:** Automated DOM Check (browser)
- **Objective:** Verify that status indicators, titles, due dates, and labels are readable.
- **Method:** Compute the contrast ratio of the rendered text colour against its background.
- **Expected Result:** At least 4.5:1 for every checked element.
- **Actual Result:** All at least 4.5:1 (lowest: Completed indicator 4.8:1; others 5.6:1 to 17.9:1).
- **Status:** Passed.
- **Evidence:** `presentation-layer-ui-test-output.txt`.

### T12 — Desktop Layout (1280 px)

- **Type:** Automated Layout Check (browser)
- **Objective:** Verify the desktop layout.
- **Method:** Measure element positions in a 1280 px wide iframe.
- **Expected Result:** Three summary cards in a row, one-row form, table list; no overflow or clipping.
- **Actual Result:** No horizontal overflow or clipping. Summary cards in one row, form controls in one row, Task List shown as a table with a header row.
- **Status:** Passed.
- **Evidence:** `presentation-layer-ui-test-output.txt`; `evidence/desktop-1280-preview.jpg`.

### T13 — Tablet Layout (820 px)

- **Type:** Automated Layout Check (browser)
- **Objective:** Verify the tablet layout.
- **Method:** Measure element positions in an 820 px wide iframe.
- **Expected Result:** Summary cards in a row, title field on its own row above date/status/button, table list; no overflow or clipping.
- **Actual Result:** No horizontal overflow or clipping. Summary cards in one row, title field on its own full-width row with date, status and button below it, Task List still a table.
- **Status:** Passed.
- **Evidence:** `presentation-layer-ui-test-output.txt`; `evidence/tablet-820-preview.jpg`.

### T14 — Mobile Layout (390 px)

- **Type:** Automated Layout Check (browser)
- **Objective:** Verify the mobile layout.
- **Method:** Measure element positions in a 390 px wide iframe.
- **Expected Result:** Stacked summary cards and form controls, task rows as cards; no overflow or clipping.
- **Actual Result:**
  - **Run 1: Failed.** The check reported "Row card layout is not title/actions above status/date."
  - **Issue:** the check compared cell tops too strictly (the cells are vertically centred), and a real layout defect was also found: the edit and delete icons were left-aligned inside a wide column instead of at the card's right edge.
  - **Resolution:** the actions cell in the mobile layout is now right-aligned in `style.css`, and the check now tests that cells share a line and that the icons are within 12 px of the right edge.
  - **Run 2: Passed.** No horizontal overflow or clipping; summary cards and form controls stacked; each task shown as a card with the icons at the right edge.
- **Status:** Passed (after fix).
- **Evidence:** `presentation-layer-ui-test-output.txt` (both runs); `evidence/mobile-390-top.jpg`; `evidence/mobile-390-task-list.jpg` (after the fix).

### T15 — Feedback Containers

- **Type:** Automated DOM Check (browser)
- **Objective:** Verify that the message areas for success, error, and loading/empty states are styled and fit the layout.
- **Method:** Reveal the containers manually in a separate iframe and inspect them.
- **Expected Result:** Visible, distinct, readable, and no overflow when shown.
- **Actual Result:** All visible; success and error styled differently; error contrast at least 4.5:1; no overflow.
- **Status:** Passed.
- **Note:** The containers are not used by the app yet (Stages 3.2 and 3.3).
- **Evidence:** `presentation-layer-ui-test-output.txt`; `evidence/feedback-states-preview.jpg`.

### T16 — No Firestore or Data Layer Access

- **Type:** Automated Check (browser)
- **Objective:** Verify that the static Presentation Layer does not access Firebase or other layers in Stage 3.1.
- **Method:** List the resources the page loaded, and check `app.js` and `index.html` for imports or references.
- **Expected Result:** No Firebase requests and no Data Layer or Application Layer imports.
- **Actual Result:** 2 resources loaded (none Firebase-related); `app.js` has no import statements; `index.html` references no Firebase or service module.
- **Status:** Passed.
- **Evidence:** `presentation-layer-ui-test-output.txt`.

### T17 — Visual Comparison with Design Reference

- **Type:** Manual Visual Review
- **Objective:** Verify that the layout, hierarchy, colours, spacing, typography, and component styling follow the design reference as closely as reasonably possible.
- **Method:** View `evidence/dashboard-desktop.jpg` next to `docs/design/Clean TaskFlow Dashboard Interface.png`.
- **Expected Result:** The implementation follows the reference with no redesign or extra elements.
- **Actual Result:** The structure and components, hierarchy, and palette match. Differences: system font stack instead of the reference typeface; spacing and row heights are close but not identical; icons are similar but redrawn; 12 mock rows instead of 5; colours are approximate.
- **Status:** Passed (with noted differences).
- **Note:** This is a visual judgement, not a pixel comparison.
- **Evidence:** `evidence/dashboard-desktop.jpg`.

## Stage 3.2 — Task List and Application Layer Integration (Presentation Layer)

Tests T18–T25 were executed on 2026-11-15 in Chrome using `tests/presentation-layer/test-task-list.html` (served with `python3 -m http.server 8000`). T18–T22 load the unchanged dashboard against the real Cloud Firestore data and compare it with an independent read-only Firestore query (43 documents read; none created, changed, or deleted). T23–T25 drive the real view with controlled task sources. Files in `tests/presentation-layer/`: `test-task-list.html/.js`, `presentation-layer-task-list-test-report.md`, `presentation-layer-task-list-test-output.txt`, and `evidence/stage32-*.jpg`.

**Run history:** Run 1: 8 of 8 passed. Review finding: the real data holds only To Do tasks with null due dates (43 of 43), so T20–T22 had not seen In Progress, Completed, or dated tasks in real data. T20 and T21 were extended with controlled tasks (real `Timestamp` objects, a `Date`, null, missing, all three statuses) and rerun. Run 2: 8 of 8 passed. No application code changed between runs.

### T18 — Real Task Loading through the Application Layer

- **Type:** Browser test, real Firestore (read-only)
- **Objective:** Verify that tasks are loaded through `getTasks()` and that the Presentation Layer imports only the Application Layer.
- **Method:** Load `index.html`; compare displayed task ids with a direct Firestore read; read the import statements of `app.js` and `taskListView.js`.
- **Expected Result:** One row per stored task with identical ids; no Data Layer import.
- **Actual Result:** 43 rows for 43 stored tasks, ids identical; `app.js` imports `./taskListView.js` and `./services/taskAppService.js` only; `taskListView.js` has no imports.
- **Status:** Passed.
- **Evidence:** `presentation-layer-task-list-test-output.txt`; `evidence/stage32-real-dashboard-desktop.jpg`.

### T19 — Task Title Rendering

- **Objective / Method:** Compare each row's title with the stored title (real data).
- **Expected Result:** Exact match.
- **Actual Result:** 43 of 43 titles match exactly.
- **Status:** Passed.
- **Evidence:** `presentation-layer-task-list-test-output.txt`.

### T20 — Task Status Rendering

- **Objective / Method:** Compare each row's status text and status class with the stored status; check the other statuses with controlled tasks.
- **Expected Result:** Correct text and class for each status.
- **Actual Result:** Real data: 43 To Do, all match. The real data has no In Progress or Completed task, so those were verified with controlled tasks: correct text and class, three distinct colours.
- **Status:** Passed (controlled data for In Progress and Completed).
- **Evidence:** `presentation-layer-task-list-test-output.txt` (Run 1 and Run 2).

### T21 — Due Date Rendering, Including Null Due Dates

- **Objective / Method:** Compare displayed due dates with the stored Timestamps; check dated cases with controlled tasks.
- **Expected Result:** "Mon D, YYYY" (local date) or "No due date".
- **Actual Result:** Real data: all 43 are null and show "No due date". Controlled: Timestamp 20 Jun 2026 → "Jun 20, 2026"; Date 31 Dec 2026 → "Dec 31, 2026"; null and missing → "No due date".
- **Status:** Passed (controlled data for dated rows).
- **Evidence:** `presentation-layer-task-list-test-output.txt`.

### T22 — Summary Card Calculations

- **Objective / Method:** Compare the cards with Firestore tallies; check controlled data with known counts.
- **Expected Result:** Cards equal the counts of the loaded tasks.
- **Actual Result:** Real: 43 / 0 / 0 (To Do 43) match Firestore. Controlled (2 To Do, 1 In Progress, 2 Completed): cards 5 / 1 / 2. The design has no To Do card; the To Do count is calculated and checked only.
- **Status:** Passed.
- **Evidence:** `presentation-layer-task-list-test-output.txt`.

### T23 — Loading State

- **Objective / Method:** Drive the view with a task source that stays pending, check the page, then resolve it.
- **Expected Result:** Loading message, no rows, page stays responsive, message removed after loading.
- **Actual Result:** Loading message shown, no rows, table hidden, counts as dashes; 14 timer ticks in 300 ms and typing worked during the wait; after resolving, 5 rows were shown and the message removed.
- **Status:** Passed.
- **Note:** Not tested with network throttling on the real page.
- **Evidence:** `presentation-layer-task-list-test-output.txt`; `evidence/stage32-loading-empty-error-states.jpg`.

### T24 — Empty State

- **Objective / Method:** Source returns an empty array.
- **Expected Result:** Empty message without error styling; no rows; counts 0.
- **Actual Result:** "No tasks yet. Add your first task above."; table hidden; counts 0 / 0 / 0; no error styling.
- **Status:** Passed.
- **Evidence:** `presentation-layer-task-list-test-output.txt`; `evidence/stage32-empty-and-error-states.jpg`.

### T25 — Error State

- **Objective / Method:** Source rejects (and, separately, throws synchronously).
- **Expected Result:** Error message and styling, not shown as empty, counts not 0.
- **Actual Result:** "Could not load tasks. Please check your connection and reload the page." with error styling; no rows; table hidden; counts as dashes; the synchronous failure gave the same state.
- **Status:** Passed.
- **Note:** A real network failure and a failed module import were not simulated.
- **Evidence:** `presentation-layer-task-list-test-output.txt`; `evidence/stage32-empty-and-error-states.jpg`.

**Note on T09–T17:** these checks were written for the static mock-data page (12 rows, counts 12/4/5) and were not rerun after Stage 3.2; their recorded results apply to the Stage 3.1 version.

## Stage 3.3 — Create, Edit, Delete and Status Interactions (Presentation Layer)

Tests T26–T37 were executed on 2026-11-15 in Chrome using `tests/presentation-layer/test-task-actions.html` (served with `python3 -m http.server 8000`). T26–T33 drive the unchanged dashboard against the real Cloud Firestore database and verify the result with an independent Firestore read; T34–T35 drive the real app code with a controlled stub of the Application Layer; T36 checks the layout at 1280, 820, and 390 px; T37 checks that no pre-existing document changed. Test records are titled "[TEST] … <run id>" and are created and removed by the test run only. Files in `tests/presentation-layer/`: `test-task-actions.html/.js`, `presentation-layer-task-actions-test-report.md`, `presentation-layer-task-actions-test-output.txt`, `evidence/stage33-*.jpg` (4 screenshots).

**Run history:**

- **Run 1:** 11 of 12 passed. T29 failed: the test compared Firestore data as text and the key order differed between two reads (the values were identical). The comparison helper was fixed; not an application defect.
- **Run 2:** 12 of 12 passed. T26's recorded counts were taken after a second create; the text was corrected. Reviewing the edit-mode screenshot then showed a real defect that no test had caught: the "+" icon was still shown on the "Save Changes" button (`app.js` set `.hidden` on an SVG element). Fixed with `toggleAttribute("hidden", …)`; checks added to T28 and T29.
- **Run 3:** 11 of 12 passed. T28's new check failed because the browser appeared to serve a cached copy of the old `app.js`.
- **Run 4 (final):** 12 of 12 passed after refreshing the cached files, with no further code change.
- **Regression:** T18–T25 were rerun after the changes: 8 of 8 passed.

### T26 — Create Task

- **Type:** Browser test, real Firestore
- **Objective / Method:** Fill the Add New Task form (title, due date, status) and submit; then submit a title only. Verify with a Firestore read.
- **Expected Result:** Stored with the entered values and local due date, shown in the list, cards updated, form reset, success message; defaults apply when omitted.
- **Actual Result:** Stored (In Progress, 2026-12-31), shown as "Dec 31, 2026", Total 43→44, In Progress 0→1, form reset, "added" message. A title-only task was stored as To Do with a null due date.
- **Status:** Passed.
- **Evidence:** `presentation-layer-task-actions-test-output.txt`; `evidence/stage33-create-success-and-failure-feedback.jpg`.

### T27 — Reject Empty Task Title

- **Objective / Method:** Submit an empty and a whitespace-only title.
- **Expected Result:** Error from the Application Layer, no success message, no document created, list unchanged.
- **Actual Result:** Both rejected with "Task title cannot be empty."; 45 documents before and after; rows and cards unchanged.
- **Status:** Passed.
- **Evidence:** `presentation-layer-task-actions-test-output.txt`.

### T28 — Edit Task

- **Objective / Method:** Click the pencil of a test task, check the form, try an empty title, then change title and date and save.
- **Expected Result:** Form prefilled; empty title rejected with the task unchanged; saving changes the title and date only (status kept) in Firestore and the list; form returns to add mode; the "+" icon is hidden in edit mode.
- **Actual Result:** All as expected (title, In Progress, 2026-07-04 prefilled; saved as new title and 2026-08-15 with the status still In Progress).
- **Status:** Passed (Run 3: failed on a stale cached `app.js`; see run history).
- **Evidence:** `presentation-layer-task-actions-test-output.txt`; `evidence/stage33-edit-mode.jpg`; `evidence/stage33-edit-mode-before-icon-fix.jpg` (the defect found in review).

### T29 — Cancel Edit

- **Objective / Method:** Start an edit, change the title, press Cancel.
- **Expected Result:** Firestore record and list unchanged; form back to add mode; "+" icon restored.
- **Actual Result:** Record identical before and after; original row kept; form reset; no success message.
- **Status:** Passed (Run 1: failed because of the test's comparison helper; see run history).
- **Evidence:** `presentation-layer-task-actions-test-output.txt`.

### T30 — Confirm Deletion

- **Objective / Method:** Click the delete icon of a test task, check the dialog, confirm.
- **Expected Result:** Dialog first and the record still exists; after confirming it is removed from Firestore and the list; cards update; success message.
- **Actual Result:** As expected; Total 48→47, Completed 1→0.
- **Status:** Passed.
- **Evidence:** `presentation-layer-task-actions-test-output.txt`; `evidence/stage33-delete-dialog.jpg`.

### T31 — Cancel Deletion

- **Objective / Method:** Open the dialog and press Cancel.
- **Expected Result:** Dialog closes; record, row, and cards unchanged.
- **Actual Result:** As expected; no message shown.
- **Status:** Passed.
- **Evidence:** `presentation-layer-task-actions-test-output.txt`.

### T32 — Change Task Status

- **Objective / Method:** Change a test task's status through the select on its row, through each status, and reload the page.
- **Expected Result:** Each status saved to Firestore and shown in the pill; persists after a reload.
- **Actual Result:** In Progress → Completed → To Do all saved; pill text and class updated; "Completed" still shown after reloading.
- **Status:** Passed.
- **Evidence:** `presentation-layer-task-actions-test-output.txt`.

### T33 — Summary Cards After Changes

- **Objective / Method:** Create, change status twice, and delete one test task, comparing the cards with an independent Firestore tally after each step.
- **Expected Result:** Cards match every time.
- **Actual Result:** Matched after every step (Total/In Progress/Completed): 49/2/0, 50/2/0, 50/3/0, 50/2/1, 49/2/0.
- **Status:** Passed.
- **Evidence:** `presentation-layer-task-actions-test-output.txt`.

### T34 — Operation Failures Not Shown as Success

- **Objective / Method:** Stub Application Layer whose create, update, and delete reject; try create, edit, status change, and delete.
- **Expected Result:** Error message, no success wording, and the list and form show the stored state.
- **Actual Result:** All four showed the error; the failed create kept the typed title, the failed edit kept edit mode and the original row, the failed status change reverted the select, the failed delete kept the row; cards unchanged.
- **Status:** Passed.
- **Note:** Failures are simulated by a rejecting stub, not a real network failure.
- **Evidence:** `presentation-layer-task-actions-test-output.txt`; `evidence/stage33-create-success-and-failure-feedback.jpg`.

### T35 — Application Layer Calls and Layer Separation

- **Objective / Method:** Record the calls made to a stub Application Layer; scan the Presentation Layer sources for imports.
- **Expected Result:** Create passes title, status, and a local `Date` or `null`; edit sends only changed fields; status sends `{status}`; delete sends the id; no change makes no call; no Data Layer import.
- **Actual Result:** As expected (including `{dueDate: null}` when a date is cleared); `app.js` imports only `./taskListView.js` and `./services/taskAppService.js`; `taskListView.js` and `index.html` reference no Data Layer module.
- **Status:** Passed.
- **Evidence:** `presentation-layer-task-actions-test-output.txt`.

### T36 — Layout of New Controls

- **Objective / Method:** On the real dashboard at 1280, 820, and 390 px, open edit mode and the delete dialog (then cancel; nothing written) and measure.
- **Expected Result:** No horizontal overflow; Save, Cancel, and Delete visible and not clipped; the dialog inside the viewport; the status select covers its pill.
- **Actual Result:** All met at the three widths (dialog 420, 420, and 352 px wide).
- **Status:** Passed.
- **Note:** Measurements only; no mobile screenshot.
- **Evidence:** `presentation-layer-task-actions-test-output.txt`.

### T37 — Data Safety and Cleanup

- **Objective / Method:** Compare every pre-existing document before and after the run; remove only the test records created by the run.
- **Expected Result:** Pre-existing documents unchanged; document count equal to the start; no test record left.
- **Actual Result:** 43 pre-existing documents unchanged; final count 43 = start 43.
- **Status:** Passed.
- **Evidence:** `presentation-layer-task-actions-test-output.txt`.

**Limitations:** interactions are driven with DOM events, not a real mouse or keyboard; the native date picker, the native status dropdown list, the Esc key, and keyboard navigation were not tested; a real network failure was not simulated; Chrome only. See the report for details.
