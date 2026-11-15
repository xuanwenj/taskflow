// Stage 3.1 — static Presentation Layer. Tasks below are mock data used only
// for visual rendering; they are replaced by real data from the Application
// Layer (services/taskAppService.js) in Stage 3.2.
const mockTasks = [
  { id: "mock-1", title: "Prepare weekly report", status: "To Do", dueDate: new Date(2026, 5, 20) },
  { id: "mock-2", title: "Review project progress", status: "In Progress", dueDate: new Date(2026, 5, 18) },
  { id: "mock-3", title: "Update client document", status: "To Do", dueDate: new Date(2026, 5, 25) },
  { id: "mock-4", title: "Team meeting preparation", status: "In Progress", dueDate: new Date(2026, 5, 19) },
  { id: "mock-5", title: "Send client update", status: "Completed", dueDate: new Date(2026, 5, 17) },
  { id: "mock-6", title: "Plan next sprint", status: "To Do", dueDate: null },
  { id: "mock-7", title: "Prepare budget summary", status: "In Progress", dueDate: new Date(2026, 5, 22) },
  { id: "mock-8", title: "Collect customer feedback", status: "In Progress", dueDate: new Date(2026, 5, 24) },
  { id: "mock-9", title: "Archive old project files", status: "Completed", dueDate: new Date(2026, 5, 9) },
  { id: "mock-10", title: "Update team calendar", status: "Completed", dueDate: new Date(2026, 5, 11) },
  { id: "mock-11", title: "Submit expense report", status: "Completed", dueDate: new Date(2026, 5, 13) },
  {
    id: "mock-12",
    title: "Review the onboarding checklist and update every step for the new team members joining next quarter",
    status: "Completed",
    dueDate: new Date(2026, 5, 15),
  },
];

const STATUS_CLASSES = {
  "To Do": "status--todo",
  "In Progress": "status--in-progress",
  Completed: "status--completed",
};

const ICONS = {
  calendar:
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>',
  edit: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19z" /><path d="M14.5 6.5l3 3" /></svg>',
  delete:
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l.8 12.5h9.4L17.5 7M10 11v5M14 11v5" /></svg>',
};

// Format a local Date for display, for example "Jun 20, 2026"
function formatDueDate(dueDate) {
  if (!dueDate) {
    return "No due date";
  }

  return dueDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function createCell(label, className) {
  const cell = document.createElement("td");
  cell.dataset.label = label;
  if (className) {
    cell.className = className;
  }
  return cell;
}

function createIconButton(kind, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `icon-button icon-button--${kind}`;
  button.setAttribute("aria-label", label);
  button.innerHTML = ICONS[kind];
  return button;
}

function createTaskRow(task) {
  const row = document.createElement("tr");
  row.dataset.taskId = task.id;

  const titleCell = createCell("Task", "task-title");
  titleCell.textContent = task.title;

  const statusCell = createCell("Status");
  const pill = document.createElement("span");
  pill.className = `status ${STATUS_CLASSES[task.status]}`;
  pill.textContent = task.status;
  statusCell.append(pill);

  const dueCell = createCell("Due Date");
  const due = document.createElement("span");
  due.className = task.dueDate ? "due-date" : "due-date due-date--none";
  due.innerHTML = ICONS.calendar;
  const dueText = document.createElement("span");
  dueText.textContent = formatDueDate(task.dueDate);
  due.append(dueText);
  dueCell.append(due);

  const actionsCell = createCell("Actions", "task-actions");
  actionsCell.append(
    createIconButton("edit", `Edit task: ${task.title}`),
    createIconButton("delete", `Delete task: ${task.title}`)
  );

  row.append(titleCell, statusCell, dueCell, actionsCell);
  return row;
}

function renderSummary(tasks) {
  const countByStatus = (status) =>
    tasks.filter((task) => task.status === status).length;

  document.getElementById("count-total").textContent = tasks.length;
  document.getElementById("count-in-progress").textContent =
    countByStatus("In Progress");
  document.getElementById("count-completed").textContent =
    countByStatus("Completed");
}

function renderTaskList(tasks) {
  document.getElementById("task-rows").replaceChildren(...tasks.map(createTaskRow));
}

// Show the date placeholder as text, and switch to a date picker on focus
function setUpDateField() {
  const dateInput = document.getElementById("task-due-date");

  dateInput.addEventListener("focus", () => {
    dateInput.type = "date";
  });
  dateInput.addEventListener("blur", () => {
    if (!dateInput.value) {
      dateInput.type = "text";
    }
  });
}

renderSummary(mockTasks);
renderTaskList(mockTasks);
setUpDateField();

// Creating tasks is implemented in Stage 3.3; for now the form does nothing
document
  .getElementById("add-task-form")
  .addEventListener("submit", (event) => event.preventDefault());
