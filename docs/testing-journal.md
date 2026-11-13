# TaskFlow — Testing Journal

Companion to [development-journal.md](development-journal.md).

## Testing Log

Records of tests and verification activities. Entries contain actual results only. Status values: **Passed**, **Failed**, **Blocked**, **Reviewed** (configuration review, not a functional test). Test IDs are sequential (T01, T02, ...).

| ID  | Test                          | Type                 | Status   |
| --- | ----------------------------- | -------------------- | -------- |
| T01 | Firebase Project Setup        | Manual Verification  | Passed   |
| T02 | Cloud Firestore Setup         | Manual Verification  | Passed   |
| T03 | Firestore Security Rules Review | Configuration Review | Reviewed |
| T04 | Firebase SDK Initialization   | Manual Smoke Test    | Passed   |

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
