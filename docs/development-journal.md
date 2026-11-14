# TaskFlow — Development Journal

## 1. Project Overview

**Project Name:** TaskFlow

**Project Description:**

TaskFlow is a simple task management application designed to help individuals organise their daily tasks, track progress, and manage deadlines.

The application provides a centralised place to create, view, edit, delete, and manage tasks through a simple and user-friendly interface.

**Project Goal:**

To develop a functional task management application that demonstrates the fundamental principles of software development, including requirements analysis, system architecture, development planning, implementation, and testing.

---

## 2. Project Scope

**Target User**

- Designed for an individual user to manage personal tasks.

**Authentication**

- No login or registration required.

**Data Sharing**

- Single-user application.
- No multi-user collaboration or shared tasks.

**Core Functionality**

- Create, view, edit, and delete tasks.
- Manage task status:
  - To Do
  - In Progress
  - Completed

**Data Storage**

- Cloud Firestore is used to store task data.

**Project Constraints**

- Keep the application simple and focused on essential task management features.
- Avoid unnecessary features and additional complexity.

---

## 3. Requirements and Feature Prioritisation

Features are prioritised based on their importance to the core purpose of the application.

### Must Have

| Feature     | Description                                            |
| ----------- | ------------------------------------------------------ |
| Add Task    | Create a new task.                                     |
| View Tasks  | Display the existing task list.                        |
| Edit Task   | Modify task details.                                   |
| Delete Task | Remove a task.                                         |
| Task Status | Manage task status: To Do, In Progress, and Completed. |

### Good to Have

| Feature       | Description                                 |
| ------------- | ------------------------------------------- |
| Due Date      | Assign a deadline to a task.                |
| Responsive UI | Support different screen sizes and devices. |

The initial scope focuses on the essential task management functions. Additional features such as search, priority levels, task assignment, notifications, and user management are excluded to keep the project manageable.

---

## 4. Technology Stack

| Area                    | Technology         | Purpose                                                       |
| ----------------------- | ------------------ | ------------------------------------------------------------- |
| Frontend                | HTML               | Define the page structure.                                    |
| Styling                 | CSS                | Style the user interface.                                     |
| Frontend Logic          | Vanilla JavaScript | Handle user interactions and application logic.               |
| Backend Service         | Firebase           | Provide backend services.                                     |
| Database                | Cloud Firestore    | Store and manage task data.                                   |
| Development Environment | Visual Studio Code | Code editing and project development.                         |
| AI Development Tool     | Claude Code CLI    | Assist with implementation, code review, and problem-solving. |
| Version Control         | Git                | Track code changes and manage project versions.               |

**Technical Approach:**

The application uses a serverless approach with Firebase as the backend service. The frontend communicates directly with Cloud Firestore through the Firebase SDK.

No separate custom backend server or authentication system is required for the initial project scope.

---

## 5. System Architecture

The application follows a simple Three-layer Architecture.

### 5.1 Presentation Layer

**Responsibility:**

- Display the user interface.
- Capture user input.
- Handle user interactions.
- Display task data and operation results.

**Technologies:** HTML, CSS, Vanilla JavaScript.

### 5.2 Application Layer

**Responsibility:**

- Manage task-related business logic.
- Handle task creation, retrieval, editing, and deletion.
- Validate user input.
- Manage task statuses.

### 5.3 Data Layer

**Responsibility:**

- Initialise and configure Firebase.
- Connect to Cloud Firestore.
- Handle data access operations.
- Store and retrieve task records.

**Technology:** Firebase SDK and Cloud Firestore.

### Layer Dependencies

The layers have the following dependency relationships:

- The Presentation Layer depends on the Application Layer.
- The Application Layer depends on the Data Layer.

The overall dependency direction is:

**Presentation Layer → Application Layer → Data Layer**

This separation helps organise responsibilities and makes the application easier to understand, maintain, and extend.

---

## 6. Development Planning

Development planning is based on the architecture and the dependencies between its layers.

The overall development direction is:

**Data Layer → Application Layer → Presentation Layer**

### Development Approach

- Establish the data access foundation first.
- Build the core task management logic on top of the Data Layer.
- Develop the user interface and connect it to the application logic.
- Integrate components incrementally as features are developed.
- Test and refine the application throughout development.

Integration is treated as an ongoing activity rather than a separate final development stage.

---

## 7. Implementation Roadmap

The implementation is organised into five stages.

### Stage 0 — Project Setup

**Objective:** Prepare the development environment and establish the project foundation.

**Key Activities:**

- Create the local project directory.
- Configure the project in Visual Studio Code.
- Set up Claude Code CLI.
- Create the initial HTML, CSS, and JavaScript files.
- Initialise a Git repository.

**Expected Outcome:** The project can run locally, and Git is ready for version control.

### Stage 1 — Data Layer

**Objective:** Establish data storage and access capabilities.

**Key Activities:**

- Configure the Firebase project.
- Design the Firestore data model.
- Initialise the Firebase SDK.
- Implement basic data access operations.

**Expected Outcome:** The application can successfully create, read, update, and delete task records in Cloud Firestore.

### Stage 2 — Application Layer

**Objective:** Implement the core task management logic.

**Key Activities:**

- Implement task CRUD operations.
- Implement input validation.
- Implement task status management.
- Handle basic business rules.

**Expected Outcome:** The task management logic can correctly process task data and manage task statuses.

### Stage 3 — Presentation Layer

**Objective:** Build the user interface and interaction.

**Key Activities:**

- Develop the HTML page structure.
- Implement CSS styling.
- Display the task list.
- Build Add and Edit forms.
- Implement buttons and status interactions.

**Expected Outcome:** Users can manage tasks through the user interface.

_Note: UI development can begin earlier where appropriate. Integration with the Application and Data Layers can happen incrementally as features are implemented._

### Stage 4 — Testing and Refinement

**Objective:** Verify and improve the application.

**Key Activities:**

- Test core CRUD functionality.
- Test task status management and input validation.
- Test error handling.
- Check responsive UI behaviour.
- Fix issues and finalise the README.

**Expected Outcome:** All required features pass testing, and the application is ready for demonstration.

---

## 8. Current Project Progress

| Area                                       | Status                         |
| ------------------------------------------ | ------------------------------ |
| Requirements Analysis                      | Completed                      |
| Feature Prioritisation                     | Completed                      |
| Wireframe and UI Design                    | Completed                      |
| Technology Selection                       | Completed                      |
| Architecture Planning                      | Completed                      |
| Development Planning                       | Completed at the overall level |
| Stage 0 — Project Setup                    | Completed                      |
| Stage 1 — Data Layer Planning              | Completed                      |
| Stage 1 — Data Layer Implementation        | Completed                      |
| Stage 2 — Application Layer Planning       | Completed                      |
| Stage 2 — Application Layer Implementation | Completed                      |
| Stage 2 — Application Layer Unit Testing   | Completed                      |
| Stage 2 — Application Layer Integration Testing | Completed                  |
| Stage 2 — Application Layer         | Completed                      |
| Stage 3 — Presentation Layer Planning      | Completed                      |
| Stage 3 — Presentation Layer Implementation | Not Started                   |
| Stage 4 — Testing and Refinement           | Not Started                    |

_Test references (T01, T02, ...) point to entries in [testing-journal.md](testing-journal.md)._

### Completed Work

**Stage 0 — Project Setup**

- Created the local TaskFlow project.
- Configured Visual Studio Code.
- Set up Claude Code CLI.
- Created the initial project files.
- Initialised Git.

**Stage 1 — Data Layer Planning**

- Completed the five-step Stage Implementation Planning Framework: Define the Objective, Identify Requirements, Identify Dependencies, Determine Implementation Sequence, and Define Expected Outcomes & Testing.
- Finalised the task data model: `title` (String, required), `status` (String, required), `dueDate` (Timestamp / null, optional).
- Confirmed the Firestore structure: collection `tasks` with auto-generated document IDs.

**Stage 1 — Data Layer Implementation (completed)**

| Step | Implementation Task              | Status    | Notes                                                                                                                                |
| ---- | -------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | Define Data Model                | Completed | See Stage 1 planning.                                                                                                                |
| 2    | Create Firebase Project          | Completed | Project named TaskFlow (project ID `taskflow-5d179`). See T01.                                                                       |
| 3    | Set Up Cloud Firestore           | Completed | Default database created. See T02.                                                                                                   |
| 4    | Configure Security Rules         | Reviewed  | Read/write allowed until December 14, 2026; authentication not required for this demo. Actual permissions not yet tested. See T03.   |
| 5    | Initialize Firebase SDK          | Completed | Firebase Web App registered; SDK integrated via CDN ES module imports; Firebase and Firestore initialised in `firebase.js`. See T04. |
| 6    | Implement Data Access Operations | Completed | `taskService.js` implements `createTask()`, `getTasks()`, `updateTask()`, and `deleteTask()`. All four verified (T05–T08).           |
| 7    | Test Data Operations             | Completed | Create (T05), Read (T06), Update (T07), and Delete (T08) tested and passed.                                                          |

Stage 1 implementation is **Completed**. All four data access operations are implemented and tested (T05–T08). Per the project owner's decision, the two Completion Criteria without a dedicated test are considered satisfied by the CRUD tests:

- Database access rules: reviewed (T03); read and write access confirmed in practice by T05–T08 under the current rules.
- Agreed data model: exercised by T05–T07.

**Stage 2 — Application Layer (completed)**

- Task validation (`services/taskValidation.js`) and the task application service (`services/taskAppService.js`) are implemented.
- Unit Testing U01–U23: 23 passed, 0 failed (Stub Data Layer).
- Integration Testing IT01–IT08: 8 passed, 0 failed, using the real Application Layer, Data Layer, and Cloud Firestore. Test documents were cleaned up successfully.
- See "Stage 2 — Application Layer: Implementation Progress" for details.

**Known Minor Issue**

- A `favicon.ico` 404 error appears in the browser Console. It does not affect Firebase initialisation and is non-blocking.

### Next Task

Stages 0, 1, and 2 are complete. Stage 3 — Presentation Layer planning is complete (see "Stage 3 — Presentation Layer: Implementation Planning"). The next step is Stage 3.1 — UI Structure and Styling, using the official design reference. Stage 3 implementation has not started.

### Testing File Organisation

Test implementation files, their reports, and execution outputs are stored together by layer (reorganised on 2026-11-15; no test logic was changed):

```
tests/
├── data-layer/                 Data Layer test pages (test-create, test-read, test-update, test-delete: .html and .js)
├── application-layer/
│   ├── unit/                   Unit tests (.mjs), report (.md), execution output (.txt)
│   └── integration/            Integration test page (.html, .js), report (.md), execution record (.txt)
└── presentation-layer/         Stage 3 tests, reports, and outputs (none yet)
```

- A test suite can have one shared report and one shared output file; each test case does not need its own.
- The Data Layer tests (T05–T08) are documented in the Testing Log in `testing-journal.md`; they have no separate report or output file.
- After the reorganisation the Application Layer unit tests were re-run from the new location (23 passed, 0 failed) and the integration test page was opened and re-run in the browser (8/8 passed, 3/3 test documents cleaned up, 0 cleanup errors). These re-runs only confirm the moved files still work; the official results remain those recorded on 2026-11-14.
- Each implementation stage documents its test objective and scenarios, expected results, actual results, Pass / Fail / Blocked status, and evidence references where available. Tests are not marked as passed before they have been executed.

# Stage 1 — Data Layer: Implementation Planning

## 1. Define the Objective

Establish a reliable data storage and access foundation that allows TaskFlow to persist, retrieve, update, and delete task records using Cloud Firestore.

## 2. Identify Requirements

The Data Layer must support the following requirements:

**Data Model**

Each task will contain three fields:

| Field   | Data Type        | Required | Description                      |
| ------- | ---------------- | -------- | -------------------------------- |
| title   | String           | Yes      | Task name                        |
| status  | String           | Yes      | To Do, In Progress, or Completed |
| dueDate | Timestamp / null | No       | Optional task due date           |

**Database Structure**

- Use Cloud Firestore as the database.
- Create a `tasks` collection.
- Each task will be stored as an individual document.
- Use Firestore auto-generated document IDs.

**Technical Requirements**

- Firebase project configuration.
- Cloud Firestore setup.
- Firebase SDK integration.
- Data access operations (CRUD).
- Basic security rules suitable for a demonstration project.

Authentication is not required for this prototype.

## 3. Identify Dependencies

The implementation requires the following:

- A Firebase project to provide the backend environment.
- Cloud Firestore to store task records.
- A defined data model before implementing database operations.
- Firebase SDK to connect the frontend application to Firestore.
- Appropriate Firestore Security Rules to control database access.

## 4. Determine Implementation Sequence

The implementation will follow the sequence below, based on technical dependencies and logical order.

| Step | Implementation Task              | Reason                                                                                                                 |
| ---- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 1    | Define Data Model                | Establish the data structure and field requirements before creating database records and implementing data operations. |
| 2    | Create Firebase Project          | Set up the Firebase environment that will host the database and provide the necessary project configuration.           |
| 3    | Set Up Cloud Firestore           | Create and enable the database where task records will be stored.                                                      |
| 4    | Configure Security Rules         | Define database access permissions before the application starts interacting with Firestore.                           |
| 5    | Initialize Firebase SDK          | Connect the frontend application to the Firebase project and make Firestore accessible from the application.           |
| 6    | Implement Data Access Operations | Implement Create, Read, Update, and Delete operations to allow the application to manage task records.                 |
| 7    | Test Data Operations             | Verify that all data operations work correctly and that records are stored and updated as expected.                    |

**Implementation Approach**

The sequence follows the dependency direction: database preparation → application connection → data operations → verification.

Some configuration tasks may be prepared in parallel, but the sequence above provides a straightforward implementation path for this project.

## 5. Define Expected Outcomes & Testing

Each implementation step should have a clear expected outcome and a corresponding verification method.

| Implementation Task              | Expected Outcome                                                      | How to Verify                                                                     |
| -------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Define Data Model                | A clearly defined task structure with three fields.                   | Review the field names, data types, and requirements against the project scope.   |
| Create Firebase Project          | A Firebase project is successfully created.                           | Confirm the project appears in Firebase Console.                                  |
| Set Up Cloud Firestore           | A Firestore database is successfully created and enabled.             | Check the database in Firebase Console.                                           |
| Configure Security Rules         | Database access rules match the requirements of the demo application. | Review the rules and verify the intended read/write access.                       |
| Initialize Firebase SDK          | The frontend can successfully initialize and connect to Firebase.     | Check for successful initialization and connection, without configuration errors. |
| Implement Data Access Operations | All four CRUD operations are implemented.                             | Test creating, retrieving, updating, and deleting task records.                   |
| Test Data Operations             | Task records can be managed correctly through Firestore.              | Verify that changes in the application are reflected correctly in the database.   |

### Completion Criteria

Stage 1 will be considered complete when:

- The Firebase project and Cloud Firestore database are configured.
- The Firebase SDK is successfully integrated.
- All four CRUD operations work correctly.
- Task records are stored and retrieved using the agreed data model.
- Basic database access rules are configured and verified.

**Expected Result:** A functional Data Layer that provides the storage and data access foundation for the TaskFlow application.

---

# Stage 2 — Application Layer: Implementation Planning

## 1. Define the Objective

Implement the application logic that validates task data, manages task status, and coordinates interactions between the Presentation Layer and Data Layer.

## 2. Identify Requirements

The Application Layer should provide the following capabilities:

**Task Validation**

- Validate that the task title is not empty.
- Validate that the task status is one of the allowed values.
- Validate that `dueDate` is either a valid date or `null`.

**Task Operations**

- Create tasks.
- Retrieve tasks.
- Update tasks.
- Delete tasks.

**Task Status Management**

- Use only these allowed status values: To Do, In Progress, Completed.

**Scope Constraint**

Keep the implementation within the existing project scope. Do not introduce priority, search, filtering, notifications, authentication, multi-user functionality, or additional business rules.

**Date Rule**

`dueDate` must be a valid date or `null`. There is no requirement that the due date must be in the future, as this has not been agreed.

## 3. Identify Dependencies

The Application Layer depends on the existing Data Layer:

- `firebase.js`: Firebase and Firestore initialisation.
- `taskService.js`: Firestore CRUD operations.

The Application Layer must call the Data Layer rather than accessing Firestore directly.

The Presentation Layer should eventually communicate with the Application Layer, not directly with the Data Layer.

No additional libraries or technologies are required.

## 4. Determine Implementation Sequence

| Step | Implementation Task                | Details                                                                                                                                                                                                                           |
| ---- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Define Task Rules                  | Define allowed task statuses. Define title validation rules. Define `dueDate` validation rules.                                                                                                                                   |
| 2    | Implement Validation               | Create validation logic for title, status, and `dueDate`. Return or throw clear errors when data is invalid.                                                                                                                      |
| 3    | Implement Task Application Service | Create `services/taskAppService.js`. Implement `createTask()`, `getTasks()`, `updateTask()`, and `deleteTask()`. Delegate database operations to the existing `taskService.js`. Apply validation to Create and Update operations. |
| 4    | Test Application Layer             | Test valid task creation and updates. Test rejection of empty titles. Test rejection of invalid status values. Test rejection of invalid dates. Test Read and Delete operations through the Application Layer.                    |

## 5. Define Expected Outcomes & Testing

Stage 2 will be considered complete when:

- Task validation works as expected.
- Valid tasks can be created and updated.
- Invalid task data is rejected.
- Tasks can be retrieved and deleted through the Application Layer.
- The Application Layer coordinates all task operations through the Data Layer.
- The separation between Presentation, Application, and Data Layers is maintained.

Testing should cover both valid and invalid inputs.

## Proposed File Structure

```
TaskFlow/
├── firebase.js
├── taskService.js
├── services/
│   ├── taskAppService.js
│   └── taskValidation.js
├── docs/
│   ├── development-journal.md
│   └── tests/
└── ...
```

**Responsibilities**

- `taskService.js`: Data Layer, responsible for Firestore CRUD operations.
- `taskValidation.js`: Application Layer validation rules.
- `taskAppService.js`: Application Layer service, responsible for business logic and coordinating Data Layer operations.

## Stage 2 Progress

| Area                                | Status      |
| ----------------------------------- | ----------- |
| Planning                            | Completed   |
| Implementation                      | Completed   |
| Unit Testing                        | Completed   |
| Integration Testing                 | Completed   |
| **Overall Stage 2**                 | **Completed** |

---

# Stage 2 — Application Layer: Implementation Progress

## Implementation Summary

**Task Validation** — `services/taskValidation.js`

- Implemented validation for title, status, and `dueDate`.
- `validateTask()` validates complete task data.
- `validateTaskUpdate()` validates partial updates.
- `validateTaskId()` validates task IDs.
- Invalid inputs, empty updates, unsupported fields, and explicitly supplied `undefined` values are rejected.

**Task Application Service** — `services/taskAppService.js`

- Implemented `createTask()`, `getTasks()`, `updateTask()`, and `deleteTask()`.
- Database operations are delegated to the Data Layer (`taskService.js`).
- Default status is `To Do` when status is omitted during creation.
- Default `dueDate` is `null` when omitted during creation.
- Update validates only the supplied fields and does not apply creation defaults.

## Application Layer Unit Testing

Unit test IDs (U01–U23) are kept separate from the manual test records (T01–T08) in [testing-journal.md](testing-journal.md).

| Item                | Detail                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------- |
| Test IDs            | U01–U23                                                                                     |
| Test Type           | Automated Unit Testing                                                                      |
| Environment         | Node.js v22.16.0                                                                            |
| Execution Date      | 2026-11-14                                                                                  |
| Actual Result       | 23 tests passed, 0 failed                                                                   |
| Exit Code           | 0                                                                                           |
| Test Approach       | Node's built-in test runner; `mock.module()` replaces the real Data Layer with a Stub Data Layer |
| Production Code     | The tests import the actual production Application Layer implementation                     |
| Requirements        | No Firebase credentials or network connection required                                      |

**Coverage**

- **Create:** valid data, default values, title trimming, and invalid inputs.
- **Read:** returning the Data Layer result.
- **Update:** partial updates, invalid fields, empty updates, and invalid IDs.
- **Delete:** valid and invalid task IDs.
- Rejected inputs were verified not to trigger Data Layer calls.

**Limitation:** these unit tests use a stub. Real Firebase integration testing of the Application Layer has **not** been completed.

**Command to re-run the tests** (from the project root):

```
node --experimental-test-module-mocks --test --test-reporter=spec "tests/application-layer/unit/*.test.mjs"
```

## Test Artifacts

| File                                                   | Purpose                  |
| ------------------------------------------------------ | ------------------------ |
| `tests/application-layer/unit/taskAppService.test.mjs` | Unit test source code    |
| `tests/application-layer/unit/application-layer-unit-test-report.md` | Test report              |
| `tests/application-layer/unit/application-layer-unit-test-output.txt` | Raw execution output     |

## Test Reliability Check

Separately from the official U01–U23 results, an additional experiment was performed on a copy outside the project to verify that the test suite can detect deliberately introduced defects. The `dueDate` default and the Delete ID validation were deliberately removed, and four tests failed as expected. These four experimental failures are **not** part of the official U01–U23 results, and the project code was not changed.

## Application Layer Integration Testing

Integration test IDs (IT01–IT08) are kept separate from T01–T08 and U01–U23.

| Item           | Detail                                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------- |
| Test IDs       | IT01–IT08                                                                                       |
| Test Type      | Browser-based Integration Testing                                                               |
| Execution Date | 2026-11-14                                                                                      |
| Actual Result  | 8 passed, 0 failed                                                                              |
| Test Approach  | The real `services/taskAppService.js`, real `taskService.js`, and the actual Cloud Firestore database; no stub or mock Data Layer |
| Cleanup        | 3 test documents deleted during cleanup; 0 cleanup errors                                       |

**Coverage:** IT01 Create Task, IT02 Default Status, IT03 Default Due Date, IT04 Read Tasks, IT05 Partial Update, IT06 Update Status, IT07 Delete Task, IT08 Invalid Task. All 8 passed.

**Test artifacts**

| File                                                          | Purpose                                              |
| ------------------------------------------------------------- | ---------------------------------------------------- |
| `tests/application-layer/integration/test-integration.html`   | Test page (run with the **Run Integration Tests** button) |
| `tests/application-layer/integration/test-integration.js`     | Integration test source code                         |
| `tests/application-layer/integration/application-layer-integration-test-report.md` | Test report                                          |
| `tests/application-layer/integration/application-layer-integration-test-output.txt` | Execution record (transcribed from a screenshot of the page and Console) |

## Stage 2 Completion

All three Stage 2 test levels are complete: unit testing (U01–U23, 23 passed), integration testing (IT01–IT08, 8 passed), and the implementation itself. **Stage 2 — Application Layer is marked Completed.**

---

# Stage 3 — Presentation Layer: Implementation Planning

**Planning status:** Completed. All planning decisions have been confirmed (see "Stage 3 Decisions" at the end of this section). Nothing in Stage 3 has been implemented.

**Status key:** Planned = agreed in this plan but not started; In Progress = being worked on; Completed = implemented and verified.

## 1. Define the Objective

Build a responsive and user-friendly interface for TaskFlow that allows users to create, view, edit, and delete tasks, while interacting with the existing Application Layer.

**Design direction:** the approved **TaskFlow — Minimal Dashboard** design: a single-page task management dashboard that is simple and focused on task management.

**Official UI design reference:** `docs/design/Clean TaskFlow Dashboard Interface.png`

This image is the official visual reference for Stage 3. The implementation must follow it as closely as reasonably possible, reproducing its layout, visual hierarchy, colours, spacing, typography, and component styling. The dashboard must not be independently redesigned, and no unnecessary UI elements are to be introduced. The image is a visual reference, not a replacement for the functional requirements. Any interaction or behaviour that cannot be determined from the image is recorded as an open decision instead of being assumed.

### UI Design Reference — What the Image Shows

The reference image shows one desktop-width view, containing these elements from top to bottom:

1. **Header:** a blue checkbox logo, the title "TaskFlow", and the tagline "A simple task manager for daily work."
2. **Summary cards (three):** Total Tasks, In Progress, and Completed, each with an icon and a count.
3. **Add New Task card:** one row containing a title input (placeholder "Enter task title..."), a due date input with a calendar icon (placeholder "Due date"), a status dropdown (showing "To Do"), and a blue "+ Add Task" button.
4. **Task List card:** a table with the columns Task, Status, Due Date, and Actions. Each row shows the title, a status pill (To Do in grey, In Progress in blue, Completed in green), the due date with a calendar icon in the format "Jun 20, 2026", and an edit (pencil, blue) and a delete (trash, red) icon.
5. **Visual style:** a light background, white rounded cards with soft shadows, a blue primary colour, and a clean sans-serif typeface. Exact colour values, font, and spacing are to be taken from the image during stage 3.1.

The image does **not** show: the tablet and mobile layouts, what happens when the edit icon is clicked, any delete confirmation, how a status is changed on an existing task, loading, empty, error, or success states, a task without a due date, overdue styling, or list ordering. These are listed under Open Decisions.

### Incremental Implementation and Testing Strategy

Stage 3 follows the same incremental implementation and testing approach as Stage 1 (Data Layer): each implementation stage is built and tested before the next begins, and the stage sequence below is unchanged.

- Each stage has its own test objective, test scenarios, expected results, testing method, and evidence to capture (see each stage below).
- Test source files, suite reports, and execution outputs are kept together in `tests/presentation-layer/` (see "Testing File Organisation").
- Actual results are recorded in the existing Testing Log (`docs/testing-journal.md`) with sequential test IDs continuing from T08 (T09 onward), including pass/fail status and evidence. A test is not marked as passed before it has been executed.
- Stage 3.1 uses static placeholder data and does not need Firestore. Stage 3.2 onward use the real Application Layer and Cloud Firestore.
- In stage 3.3, each operation (create, status update, edit, delete) is implemented and tested individually before the next one is started.
- **Test data rules:** test records must be identifiable (for example, titles beginning with `[TEST]`) and are cleaned up safely. Existing Firestore records are never deleted or modified unless they were created specifically for testing.

## 2. Identify Requirements

**Functional requirements**

1. View Tasks.
2. Create Task.
3. Edit Task.
4. Delete Task.
5. Display and update Task Status: To Do, In Progress, Completed.
6. Display Due Date.

**Interface requirements**

- Single-page dashboard with a clear task list and a task creation interface.
- Task status and due dates are easy to identify.
- Existing tasks can be edited and deleted.
- Responsive across desktop, tablet, and mobile.
- Appropriate feedback for loading, an empty task list, successful operations, and errors.

**Scope constraint**

Do not introduce login or registration, multi-user functionality, search, priority, people, notifications, or any other feature outside the original project scope.

## 3. Identify Dependencies

- The Presentation Layer interacts with the Application Layer only through `services/taskAppService.js`, using `createTask()`, `getTasks()`, `updateTask()`, and `deleteTask()`.
- The Presentation Layer must not import or call Data Layer functions (`taskService.js`, `firebase.js`) directly.
- The existing Data Layer and Application Layer are not to be modified unless a genuine integration issue is discovered. Any such issue must be documented before changes are made.
- Existing project files `index.html`, `style.css` (currently empty), and `app.js`. `index.html` currently contains only a heading, and `app.js` currently imports `db` from `firebase.js` and logs the Firebase initialisation check. That import conflicts with the layer rule above and is expected to be removed when `app.js` is rewritten as the UI logic.
- No additional libraries or frameworks are planned (Vanilla JavaScript, HTML, CSS, per the agreed technology stack).

**Integration points to account for in the plan**

- `getTasks()` returns each task's `dueDate` as it is stored in Firestore (a Firestore Timestamp or `null`), so the UI must convert it for display.
- `createTask()` and `updateTask()` require `dueDate` to be a JavaScript `Date` object or `null`, so the UI must convert the value from a date input before calling them.
- The Application Layer throws errors with clear messages for invalid input; the UI is expected to surface these as error feedback.

## 4. Determine Implementation Sequence

The sequence follows dependencies: structure and styling first, then reading data, then changing data, then stage-level verification.

| Order | Implementation Stage                      | Status  | Depends On |
| ----- | ----------------------------------------- | ------- | ---------- |
| 3.1   | UI Structure and Styling                  | Planned | —          |
| 3.2   | Task List and Application Layer Integration | Planned | 3.1        |
| 3.3   | Create, Edit, Delete, and Status Interactions | Planned | 3.2    |
| 3.4   | Stage-Level Verification and Responsive Check | Planned | 3.3   |

### 3.1 UI Structure and Styling

**1. Objective:** Establish the dashboard layout and visual design with no data connection.

**2. Requirements:**

- HTML structure for the dashboard as shown in the reference: header, summary cards, Add New Task card, Task List table, and containers for loading, empty, success, and error messages.
- CSS styling that follows the official UI design reference (layout, visual hierarchy, colours, spacing, typography, and component styling).
- Clear visual treatment of the three statuses and of due dates.
- Responsive layout for desktop, tablet, and mobile.

**3. Dependencies:** Existing `index.html` and `style.css`. No Application Layer dependency yet.

**4. Implementation Sequence:**

1. Build the HTML structure and UI components.
2. Style the layout, task item, status indicators, and forms.
3. Add the responsive rules.
4. Check the layout with sample (hard-coded) content.

**5. Expected Outcomes:** The page displays the dashboard layout correctly at desktop, tablet, and mobile widths, using placeholder content.

**6. Testing Approach:**

1. **Test objective:** Verify that the static dashboard matches the design reference and is responsive. Static placeholder data is acceptable; Firestore is not required.
2. **Test scenarios:**
   - Desktop layout compared with the reference image: header, summary cards, Add New Task row, Task List table.
   - Component styling: the three status pills, due date with icon, and the edit and delete icons.
   - Tablet width layout.
   - Mobile width layout.
   - No overlapping, clipped, or unreachable content, and no unintended horizontal scrolling, at any tested width.
3. **Expected results:** The desktop view matches the reference as closely as reasonably possible in layout, hierarchy, colours, spacing, typography, and component styling. The tablet and mobile layouts remain usable and consistent with the same design.
4. **Testing method:** Manual side-by-side comparison with the reference image in the browser, and the Developer Tools device toolbar at the desktop, tablet, and mobile widths (breakpoints are determined and refined during this stage; see Decisions).
5. **Evidence to capture:** Screenshots at each width alongside the reference image, and a Testing Log entry with the pass/fail result.

### 3.2 Task List and Application Layer Integration

**1. Objective:** Load and display real tasks through the Application Layer, with feedback states.

**2. Requirements:**

- Retrieve tasks with `getTasks()` and render them in the task list.
- Display title, status, and due date for each task (including tasks without a due date).
- Loading state while tasks are being retrieved.
- Empty state when there are no tasks.
- Error state when retrieval fails.
- No direct Data Layer imports.

**3. Dependencies:** Stage 3.1; `services/taskAppService.js` (`getTasks()`).

**4. Implementation Sequence:**

1. Replace the current `app.js` initialisation check with UI logic that imports only from `services/taskAppService.js`.
2. Load tasks on page load and render them.
3. Implement the due date conversion for display.
4. Implement loading, empty, and error states.

**5. Expected Outcomes:** On page load the dashboard shows the tasks stored in Firestore, or the appropriate loading, empty, or error message.

**6. Testing Approach:**

1. **Test objective:** Verify that real tasks are loaded through `getTasks()` and displayed correctly, including the loading, empty, and error states.
2. **Test scenarios:**
   - Tasks load and render with the correct title, status, and due date.
   - Each of the three statuses is displayed with the correct status pill.
   - A task with no due date is displayed correctly.
   - The summary card counts match the loaded tasks.
   - The loading state is shown while tasks are being retrieved.
   - The empty state is shown when there are no tasks.
   - The error state is shown when retrieval fails.
   - The Presentation Layer files contain no direct Data Layer imports.
3. **Expected results:** The list matches the data in Firestore for the test records; the loading, empty, and error states appear in the right situations; no Data Layer import exists in the Presentation Layer.
4. **Testing method:** Manual functional tests in the browser against the real Firestore database, using identifiable test records, compared against the Firestore Console. The loading state is checked with Developer Tools network throttling. The import check is a search of the Presentation Layer files. The empty and error states are verified with temporary mock data or a controlled test setup, without emptying or damaging the Firestore collection (see Decisions); normal loading is also verified with real Firestore data.
5. **Evidence to capture:** Screenshots of the rendered list and of each state, the Firestore Console screenshot of the test records, the browser Console output, the import check output, and Testing Log entries.

### 3.3 Create, Edit, Delete, and Status Interactions

**1. Objective:** Let the user manage tasks through the interface.

**2. Requirements:**

- Create a task through the creation interface; the default status and due date behaviour follow the Application Layer.
- Edit an existing task's title, status, and due date.
- Update a task's status (To Do, In Progress, Completed).
- Delete a task.
- Convert the date input value to a `Date` or `null` before calling the Application Layer.
- Show success feedback after each successful operation and error feedback (including Application Layer validation messages) after a failed one.
- Refresh the task list after each change.

**3. Dependencies:** Stage 3.2; `createTask()`, `updateTask()`, `deleteTask()` in `services/taskAppService.js`.

**4. Implementation Sequence:**

1. Create Task interaction.
2. Status update interaction.
3. Edit Task interaction (partial update of supplied fields).
4. Delete Task interaction.
5. Success and error feedback for all operations.

**5. Expected Outcomes:** A user can create, edit, change the status of, and delete tasks entirely through the interface, and receives clear feedback for each operation.

**6. Testing Approach:**

Each operation is implemented and tested individually, in the order of the implementation sequence above, before moving to the next.

1. **Test objective:** For each operation, verify both the UI behaviour and the persistence in Firestore through the Application Layer.
2. **Test scenarios:**
   - **Create:** a valid task is added and appears in the list; the default status and due date behaviour apply when omitted; an empty title is rejected with error feedback and creates no record.
   - **Status update:** changing a task to each of the three statuses is shown in the list and persists after a page reload.
   - **Edit:** changing the title and the due date is shown in the list and persists after a reload; fields that were not changed keep their values; invalid input is rejected with error feedback.
   - **Delete:** a test task is removed from the list and no longer exists in Firestore.
   - Success feedback is shown after each successful operation, and error feedback after each failed one.
3. **Expected results:** Each operation updates the interface correctly, the change is stored in Firestore (verified after a page reload), invalid input is rejected without changing any data, and the appropriate feedback is shown.
4. **Testing method:** Manual functional tests in the browser against the real Firestore database. Persistence is verified in the Firestore Console and by reloading the page so the list is read again through the Application Layer. Test records are identifiable (for example `[TEST] Create Task`) and only those records are cleaned up; no other existing record is deleted or modified.
5. **Evidence to capture:** Before and after screenshots of the interface, the Firestore Console screenshot of the affected document, screenshots of the success and error messages, the browser Console output, and Testing Log entries with the pass/fail result for each operation.

### 3.4 Stage-Level Verification and Responsive Check

**1. Objective:** Confirm the complete Presentation Layer meets the Stage 3 completion criteria.

**2. Requirements:**

- All functional and interface requirements in section 2 work together.
- Layout and interactions work at desktop, tablet, and mobile widths.
- The layer separation is maintained: no Presentation Layer file imports Data Layer functions directly.

**3. Dependencies:** Stages 3.1–3.3.

**4. Implementation Sequence:**

1. End-to-end walkthrough of all operations.
2. Responsive check at the three widths.
3. Review imports to confirm layer separation.
4. Fix any issues found within the Stage 3 scope.

**5. Expected Outcomes:** All Stage 3 requirements are verified and documented in the Testing Log.

**6. Testing Approach:**

1. **Test objective:** Verify the complete task management workflow end to end and the final responsive behaviour.
2. **Test scenarios:**
   - End-to-end workflow with test data: create a task, view it, edit it, change its status, and delete it.
   - Final responsive check of the complete workflow at desktop, tablet, and mobile widths.
   - Final comparison of the finished interface with the design reference.
   - Layer separation check: no Presentation Layer file imports Data Layer functions.
   - Scope check: no feature outside the original project scope has been added.
3. **Expected results:** The whole workflow works at every tested width, the interface matches the design reference as closely as reasonably possible, the layer separation is maintained, and no out-of-scope feature is present.
4. **Testing method:** Manual end-to-end test in the browser against the real Firestore database, the Developer Tools device toolbar for the responsive check, and a search of the Presentation Layer files for the import check. Test data follows the identification and cleanup rules above.
5. **Evidence to capture:** Screenshots of each step of the workflow at the three widths, a final side-by-side screenshot with the reference image, the import check output, and Testing Log entries with the pass/fail result.

## 5. Define Expected Outcomes & Testing

Stage 3 will be considered complete when:

- Tasks are displayed from Firestore through the Application Layer, with title, status, and due date.
- Tasks can be created, edited, status-updated, and deleted through the interface.
- Loading, empty, success, and error states are shown appropriately.
- The interface follows the official UI design reference as closely as reasonably possible and is usable on desktop, tablet, and mobile.
- The Presentation Layer calls only `services/taskAppService.js` and does not access the Data Layer directly.
- No feature outside the original project scope has been added.
- All tests are recorded in the Testing Log with actual results.

## Stage 3 Decisions

### Confirmed Decisions

These decisions are agreed. Details marked "refined during implementation" are implementation details that will be settled while building and testing, not open decisions.

| #  | Topic | Confirmed Decision |
| -- | ----- | ------------------ |
| 1  | Responsive layouts | Support desktop, tablet, and mobile using CSS media queries. The breakpoints are determined and refined during Stage 3.1 implementation and testing. |
| 2  | Edit and status interactions | Clicking the pencil icon opens the task edit form. A task's status can be changed through a dropdown/select control. |
| 3  | Delete confirmation | A simple on-page confirmation dialog/modal is shown before a task is deleted. |
| 4  | Due date handling | Use local dates rather than UTC midnight. The selected date is converted into a JavaScript `Date` before calling the Application Layer. Firestore Timestamp values are converted into displayable local dates. "No due date" is displayed when a task has no due date. |
| 5  | Overdue styling | No special overdue styling and no additional overdue business rules. Follow the approved design reference. |
| 6  | List order | Display tasks in the order returned by `getTasks()`, with no sorting. The existing data has no creation timestamp, so newest-first ordering is not reliably possible without changing the data model, and no Data Layer or Application Layer change is made for sorting. The returned order follows the Firestore document ID order, which is stable but does not reflect creation order. The order can be revisited later as a separate change if needed. |
| 7  | Feedback appearance | Loading, empty, success, and error feedback is kept simple and consistent with the approved design. No unnecessary animations or complex notification systems. |
| 8  | Summary cards | Keep the summary cards shown in the design reference. Their counts are calculated in the Presentation Layer from the task data already loaded. The Application Layer is not modified and no new business functionality is added for them. |
| 9  | Icons and font | Use a system font stack and inline SVG or CSS-based icons. No external icon or font dependencies. |
| 10 | Existing Firestore test data | Existing Firestore records are not deleted. Test tasks use clearly identifiable names, such as `[TEST] Create Task`. Only records created by the current test run are cleaned up. Existing records are not assumed to be disposable test data. |
| 11 | Empty and error state testing | Verify these states with temporary mock data or a controlled test setup, without emptying or damaging the existing Firestore collection. Normal task loading is also verified with real Firestore data. |
| 12 | UI test automation | Manual testing for Stage 3. No UI automation framework is introduced. |
| 13 | Design reference filename | Verified: the reference image is `docs/design/Clean TaskFlow Dashboard Interface.png` (the only file in `docs/design/`). The journal uses this path. No duplicate image has been created and no other filename is assumed. |

The test data naming convention in decision 10 (`[TEST] ...`) replaces the "UI-" title prefix mentioned earlier in this plan's testing sections.

### Implementation Details to Be Refined During Testing

- Responsive breakpoints and how the Task List table is presented at tablet and mobile widths (stage 3.1).
- Exact colours, font stack, spacing, and icon drawings, taken from the design reference (stage 3.1).
- The look of the edit form, the delete confirmation, and the feedback messages (stages 3.1 and 3.3).
- How temporary mock data or the controlled test setup is provided for the empty and error state tests, while keeping the Presentation Layer free of Data Layer imports (stage 3.2).

### Unresolved Decisions

None. All Stage 3 planning decisions are now confirmed. Remaining implementation details are listed above and will be refined during implementation and testing.

## Stage 3 Progress

| Area                                   | Status                |
| -------------------------------------- | --------------------- |
| Planning                               | Completed             |
| Implementation                         | Not Started           |
| 3.1 UI Structure and Styling           | Planned               |
| 3.2 Task List and Application Layer Integration | Planned      |
| 3.3 Create, Edit, Delete, and Status Interactions | Planned    |
| 3.4 Stage-Level Verification and Responsive Check | Planned    |
| Testing                                | Not Started           |
