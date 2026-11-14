# Application Layer Integration Test Report

**Component under test:** Application Layer (`services/taskAppService.js`, `services/taskValidation.js`) integrated with the Data Layer (`taskService.js`) and Cloud Firestore
**Test code:** `docs/tests/test-integration.html`, `docs/tests/test-integration.js`
**Execution record:** `docs/tests/application-layer-integration-test-output.txt`
**Execution date:** 2026-11-14
**Test IDs:** IT01–IT08 (separate from manual tests T01–T08 and unit tests U01–U23)

## Testing Approach and Environment

- Browser-based integration tests using the actual production modules: the real `services/taskAppService.js`, the real `taskService.js`, and the real Cloud Firestore database (project `taskflow-5d179`).
- No stub or mock Data Layer was used.
- Firebase is loaded through the existing CDN ES module approach. No additional testing framework was used.
- Most tests verify stored data by reading the document directly from Firestore with the Firebase SDK, independent of the code under test. IT04 and IT06 verify through the Application Layer.
- Test documents use titles prefixed with `IT-`. Every document ID created by the script is tracked and deleted during cleanup, including after failures. Cleanup errors are reported separately.
- The tests are started with the **Run Integration Tests** button on `test-integration.html`. Results are shown on the page and in the browser Developer Tools Console.
- The tests were run in a Chrome browser with Developer Tools open (responsive view 768 x 692), as shown in the supplied screenshot.

## Summary

| Tests | Passed | Failed |
| ----- | ------ | ------ |
| 8     | 8      | 0      |

## Test Cases and Results

The test scenarios and expected results are those defined in `test-integration.js`. Actual results are transcribed from the screenshot of the test page and Console supplied after the run (see the execution record).

| ID   | Test Scenario | Expected Result | Actual Result | Status |
| ---- | ------------- | --------------- | ------------- | ------ |
| IT01 | Create task with valid data | Document exists in Firestore with the expected title, status, and dueDate. | Document `YTIfB3mbzkPpnEOcgSjp` stored with title `IT-Task 1794693766315`, status `To Do` (rest of the line truncated in the screenshot). | Pass |
| IT02 | Create task without status (Default Status) | Stored status is `To Do`. | Stored status is `To Do`. | Pass |
| IT03 | Create task without dueDate (Default Due Date) | Stored dueDate is `null`. | Stored dueDate is `null`. | Pass |
| IT04 | Read tasks through the Application Layer | The test task appears in the returned results. | Test task found among 46 returned task(s) with its ID and title. | Pass |
| IT05 | Partial update (title only) | Title changes; status and dueDate remain unchanged. | Title changed to `IT-Task 1794693766315 (updated)`; status `To Do` and dueDate unchanged. | Pass |
| IT06 | Update status to `In Progress` | A subsequent read returns status `In Progress`. | Subsequent read returned status `In Progress`. | Pass |
| IT07 | Delete task through the Application Layer | The document no longer exists in Firestore. | Document `YTIfB3mbzkPpnEOcgSjp` no longer exists in Firestore. | Pass |
| IT08 | Create task with an empty title (Invalid Task) | Validation rejects it and no corresponding document is created. | Rejected with "Task title cannot be empty."; no new document with an empty title in Firestore. | Pass |

## Cleanup Results

| Item | Result |
| ---- | ------ |
| Test documents deleted during cleanup | 3 |
| Cleanup errors | 0 |

## Notes

- The evidence is a screenshot, not a saved log file. The IT01 line is cut off at the right edge, so its dueDate detail is not visible. Its Pass status is shown on the page and in the Console table.
- IT04 read 46 tasks, which includes unrelated existing documents. The test script does not modify those.
- Unrelated Firestore documents were not deleted or modified by the test script, which deletes only the IDs it created.
- Firestore Security Rules and application code were not changed for these tests.
