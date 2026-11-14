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

| Area                                | Status                         |
| ----------------------------------- | ------------------------------ |
| Requirements Analysis               | Completed                      |
| Feature Prioritisation              | Completed                      |
| Wireframe and UI Design             | Completed                      |
| Technology Selection                | Completed                      |
| Architecture Planning               | Completed                      |
| Development Planning                | Completed at the overall level |
| Stage 0 — Project Setup             | Completed                      |
| Stage 1 — Data Layer Planning       | Completed                      |
| Stage 1 — Data Layer Implementation | Completed                      |
| Stage 2 — Application Layer         | Not Started                    |
| Stage 3 — Presentation Layer        | Not Started                    |
| Stage 4 — Testing and Refinement    | Not Started                    |

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

| Step | Implementation Task              | Status      | Notes                                                                                                                     |
| ---- | -------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------- |
| 1    | Define Data Model                | Completed   | See Stage 1 planning.                                                                                                     |
| 2    | Create Firebase Project          | Completed   | Project named TaskFlow (project ID `taskflow-5d179`). See T01.                                                            |
| 3    | Set Up Cloud Firestore           | Completed   | Default database created. See T02.                                                                                        |
| 4    | Configure Security Rules         | Reviewed    | Read/write allowed until December 14, 2026; authentication not required for this demo. Actual permissions not yet tested. See T03. |
| 5    | Initialize Firebase SDK          | Completed   | Firebase Web App registered; SDK integrated via CDN ES module imports; Firebase and Firestore initialised in `firebase.js`. See T04. |
| 6    | Implement Data Access Operations | Completed   | `taskService.js` implements `createTask()`, `getTasks()`, `updateTask()`, and `deleteTask()`. All four verified (T05–T08). |
| 7    | Test Data Operations             | Completed   | Create (T05), Read (T06), Update (T07), and Delete (T08) tested and passed.                                              |

Stage 1 implementation is **Completed**. All four data access operations are implemented and tested (T05–T08). Per the project owner's decision, the two Completion Criteria without a dedicated test are considered satisfied by the CRUD tests:

- Database access rules: reviewed (T03); read and write access confirmed in practice by T05–T08 under the current rules.
- Agreed data model: exercised by T05–T07.

**Known Minor Issue**

- A `favicon.ico` 404 error appears in the browser Console. It does not affect Firebase initialisation and is non-blocking.

### Next Task

Stage 1 is complete. The next step is Stage 2 — Application Layer planning. The detailed plan will be added once it has been agreed.

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

