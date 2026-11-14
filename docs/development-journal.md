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
| Stage 3 — Presentation Layer               | Not Started                    |
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

Stages 0, 1, and 2 are complete. The next stage is Stage 3 — Presentation Layer, which has not started. Its detailed implementation plan will be added once it has been agreed.

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
node --experimental-test-module-mocks --test --test-reporter=spec "tests/unit/*.test.mjs"
```

## Test Artifacts

| File                                                   | Purpose                  |
| ------------------------------------------------------ | ------------------------ |
| `tests/unit/taskAppService.test.mjs`                   | Unit test source code    |
| `docs/tests/application-layer-unit-test-report.md`     | Test report              |
| `docs/tests/application-layer-unit-test-output.txt`    | Raw execution output     |

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
| `docs/tests/test-integration.html`                            | Test page (run with the **Run Integration Tests** button) |
| `docs/tests/test-integration.js`                              | Integration test source code                         |
| `docs/tests/application-layer-integration-test-report.md`     | Test report                                          |
| `docs/tests/application-layer-integration-test-output.txt`    | Execution record (transcribed from a screenshot of the page and Console) |

## Stage 2 Completion

All three Stage 2 test levels are complete: unit testing (U01–U23, 23 passed), integration testing (IT01–IT08, 8 passed), and the implementation itself. **Stage 2 — Application Layer is marked Completed.**
