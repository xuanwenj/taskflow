# TaskFlow — Testing Journal

Companion to [development-journal.md](development-journal.md).

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
