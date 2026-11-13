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
| Stage 1 — Data Layer Planning       | In Progress                    |
| Stage 1 — Data Layer Implementation | Not Started                    |

**Current Focus:**

The project is currently in Stage 1 — Data Layer Planning.

The next step is to develop a detailed implementation plan covering the Task data model, Firebase configuration, SDK initialisation, Firestore data access, and testing.

Detailed technical decisions will be documented as they are made during implementation planning and development.
