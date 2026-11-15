# TaskFlow

TaskFlow is a simple, single-user task manager built with plain HTML, CSS and JavaScript, using Cloud Firestore for storage. It runs in the browser with no build step.

## Project Overview

TaskFlow lets one person keep track of their work: add tasks, give them an optional due date, move them between statuses, and see at a glance how many tasks exist and how many are in progress or completed.

The project is also a small demonstration of a layered design. The user interface never talks to the database directly; it goes through an Application Layer that validates input, which in turn uses a separate Data Layer for Firestore access.

The UI follows a design reference kept in `docs/design/`. The development process, stage plans and test records are documented in `docs/`.

## Features

Implemented and verified in the current version:

- **Create tasks** with a title, an optional due date and a status (default: To Do).
- **View tasks** in a task list showing title, status and due date ("No due date" when none is set). Loading, empty and error states are shown.
- **Edit tasks**: the pencil icon opens the form with the task's values; only changed fields are saved, and editing can be cancelled.
- **Delete tasks** with an on-page confirmation dialog.
- **Change task status** (To Do, In Progress, Completed) directly from the status pill in the list.
- **Optional due dates**, entered and displayed as local dates (for example "Jun 20, 2026").
- **Summary cards** showing Total, In Progress and Completed counts, calculated from the loaded tasks.
- **Responsive layout** for desktop, tablet and mobile (breakpoints at 900 px and 600 px).
- **Feedback messages** for successful and failed operations. Validation errors (for example an empty title) are shown to the user.

## Technology Stack

| Technology | Role |
| ---------- | ---- |
| HTML | Page structure (`index.html`), including the task form and the delete confirmation dialog. |
| CSS | Styling and responsive layout (`style.css`) using CSS variables, system fonts and media queries. Icons are inline SVG. |
| Vanilla JavaScript (ES modules) | All application logic. No framework, bundler or package manager is used. |
| Cloud Firestore | Cloud database. Tasks are stored in a `tasks` collection with the fields `title`, `status` and `dueDate`. |
| Firebase Web SDK (CDN ES modules) | Loaded from `gstatic.com` (version 13.3.0) by `firebase.js` and `taskService.js`; nothing is installed locally. |

## Architecture

```
Presentation Layer  →  Application Layer  →  Data Layer  →  Cloud Firestore
```

| Layer | Files | Responsibility |
| ----- | ----- | -------------- |
| Presentation | `index.html`, `style.css`, `app.js`, `taskListView.js` | Renders the interface, handles user events, shows feedback. `app.js` coordinates events and calls the Application Layer; `taskListView.js` renders the task list, summary cards and the loading, empty and error states. |
| Application | `services/taskAppService.js`, `services/taskValidation.js` | Business rules: validates titles, statuses and due dates, applies defaults (status "To Do", due date `null`) and allows partial updates. |
| Data | `taskService.js`, `firebase.js` | Initialises Firebase and performs the Firestore create, read, update and delete operations. |

How the layers interact:

- The Presentation Layer imports only `services/taskAppService.js` (loaded with a dynamic `import()` so a load failure shows the error state). It does not import `taskService.js` or `firebase.js`.
- `taskAppService.js` validates input with `taskValidation.js` and then calls `taskService.js`.
- `taskService.js` is the only module that calls Firestore, through the `db` object exported by `firebase.js`.
- Summary counts are calculated in the Presentation Layer from the tasks it has loaded.

## Project Structure

```
TaskFlow/
├── index.html                 Page markup
├── style.css                  Styles and responsive layout
├── app.js                     UI event handling; calls the Application Layer
├── taskListView.js            Task list, summary cards and list-state rendering
├── firebase.js                Firebase initialisation (Data Layer)
├── taskService.js             Firestore create/read/update/delete (Data Layer)
├── services/
│   ├── taskAppService.js      Application Layer entry point
│   └── taskValidation.js      Validation rules
├── docs/
│   ├── development-journal.md Roadmap, stage plans, progress and decisions
│   ├── testing-journal.md     Central testing log
│   ├── CLAUDE.md              Rules used to maintain the journals
│   └── design/                UI design reference image
└── tests/
    ├── data-layer/            Manual Data Layer test pages
    ├── application-layer/
    │   ├── unit/              Node unit tests, report and output
    │   └── integration/       Browser integration test, report and output
    └── presentation-layer/    Browser UI tests, reports, outputs and screenshots (evidence/)
```

## Setup and Installation

### Prerequisites

- A modern web browser (the project was tested in Chrome).
- Python 3 (or any other static file server) to serve the files locally. ES modules do not load from `file://`.
- A Google account and a Firebase project with Cloud Firestore enabled.
- Node.js 22 or later, only if you want to run the unit tests.

### Configure Firebase

1. In the [Firebase Console](https://console.firebase.google.com/), create a project and add a **Web app** to get its configuration object.
2. Create a Cloud Firestore database. The `tasks` collection is created automatically when the first task is added.
3. Open `firebase.js` and replace the `firebaseConfig` object with your own project's values. The file in this repository holds the original author's project configuration. Do not reuse it: create a separate Firebase project and use your own configuration so the app works with your own database.
4. Configure Firestore Security Rules for your project (see the security note below). This step is essential.

Firebase client configuration values identify your project to the Firebase SDK. Unlike private credentials (such as service account keys or admin secrets), they are designed to be included in client-side code and are not secret in that sense. Because they are public in a browser app, they do not protect your data: **access to the database is controlled by Firestore Security Rules**. Do not treat the configuration as a security measure, and never put private credentials in this project. (`.env` is listed in `.gitignore`, but the app does not read environment variables.)

### Run locally

From the project root:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

### Security considerations

TaskFlow is a single-user demonstration project. It has **no authentication**: there are no user accounts and no per-user data. It does not provide production-level security.

- The Firestore rules used during development were temporary and open: they allowed read and write access without authentication until 14 December 2026 (recorded as T03 in `docs/testing-journal.md`). They are not a secure configuration. While rules like these are in place, anyone who has the project's configuration can read and write the data, and after the expiry date the app can no longer read or write unless the rules are changed. The current live rules cannot be checked from the repository; confirm them in the Firebase Console.
- **Recommendation:** configure appropriate Firestore Security Rules for your own Firebase project before using the app with any real data. The rules are configured separately in the Firebase Console and are not part of this repository. A proper multi-user or production setup would also need authentication, which this project does not include.
- Do not store sensitive information in this app.

## Testing

Test results are recorded in `docs/testing-journal.md`. Each suite has its own report and execution output next to its test code. Results below are the recorded results; nothing was re-executed when this README was written.

| Category | Location | Tests | Recorded result |
| -------- | -------- | ----- | --------------- |
| Firebase setup and Data Layer (manual) | `tests/data-layer/`, `docs/testing-journal.md` | T01–T08: project and database setup, security rules review, SDK initialisation, create, read, update and delete | All passed (T03 is a configuration review, recorded as Reviewed) |
| Application Layer unit tests | `tests/application-layer/unit/` | U01–U23, using a stub Data Layer (Node built-in test runner) | 23 passed, 0 failed |
| Application Layer integration tests | `tests/application-layer/integration/` | IT01–IT08, real Application Layer, Data Layer and Firestore | 8 passed, 0 failed; test documents cleaned up |
| Presentation Layer: UI structure and styling | `tests/presentation-layer/` | T09–T17: structure, status and date presentation, contrast, desktop/tablet/mobile layouts, feedback containers, layer separation, visual comparison with the design reference | Final run: T09–T16 passed (8 of 8); T14 failed in the first run and passed after a fix; T17 (manual visual review) passed with noted differences |
| Presentation Layer: task list and states | `tests/presentation-layer/` | T18–T25: real task loading, title, status and due date rendering, summary cards, loading, empty and error states | 8 of 8 passed (a first run was extended with controlled data because the stored data had only "To Do" tasks without due dates) |
| Presentation Layer: create, edit, delete, status | `tests/presentation-layer/` | T26–T37: create, empty-title rejection, edit, cancel edit, confirm and cancel delete, status change, summary counts, failure handling, layer separation, layout of new controls, data safety | 12 of 12 passed in the final run; earlier runs had two failures caused by the test code and a cached file, and one real defect found by screenshot review and fixed (see the journal) |
| Regression | `tests/presentation-layer/` | T18–T25 rerun after the create/edit/delete changes | 8 of 8 passed |
| Final manual verification | `docs/testing-journal.md` | Full workflow, desktop (1280 px), tablet (820 px) and mobile (390 px) layouts, architecture and scope review, performed manually | All checks passed; no issues identified (no test ID or screenshots recorded) |

Notes:

- The T09–T17 checks were written for the earlier static, mock-data version of the page and were not rerun against the current application.
- Presentation Layer tests are plain browser pages, run without any test framework. Automated browser checks were run in Chrome only.
- Browser tests use the real Firestore database. Records they create are titled with `[TEST]` (Presentation Layer) or `IT-` (integration) and are removed by the test run; existing records are not modified.

### Running the tests

Unit tests (no Firebase access needed), from the project root:

```bash
node --experimental-test-module-mocks --test --test-reporter=spec "tests/application-layer/unit/*.test.mjs"
```

Browser tests: start the local server (see above), then open one of the following pages and use its run button. They read from and write to the Firestore database configured in `firebase.js`, so use your own project.

- `tests/application-layer/integration/test-integration.html`
- `tests/presentation-layer/test-task-list.html`
- `tests/presentation-layer/test-task-actions.html`
- `tests/presentation-layer/test-ui-structure.html` (written for the earlier static page; see the note above)

## Limitations

- **No authentication and no multi-user support.** The app is designed for a single user; all data is in one shared `tasks` collection.
- **No task filtering and no pagination.** All tasks are loaded and shown in one list.
- **No explicit sorting.** Tasks are shown in the order returned by Firestore. This is not creation-time order, because tasks have no creation timestamp.
- **No offline mode or automatic retry support.** The app needs a connection to Firestore. If loading or saving fails, an error message is shown and the user must retry manually (for example by reloading the page).
- **Task deletion is permanent; there is no undo or restore feature.**
- **Firestore Security Rules are configured separately and are not included in this repository.** They must be set up in the Firebase project (see the security considerations above); the app itself does not enforce access control.

## Future Improvements

These are planned ideas and are not implemented:

- **Task filtering** (filter criteria to be decided).
- **Pagination**, with a maximum number of tasks per page.
- **Sorting by creation time**, with the newest tasks first. This will need a creation timestamp stored with each task.
