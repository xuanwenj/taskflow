// Presentation Layer view: renders tasks, summary counts, and the loading,
// empty, and error states. It has no imports, so it never reaches the Data
// Layer; the tasks are supplied by the caller (app.js, via the Application Layer).
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

// Convert a stored due date (Firestore Timestamp, Date, or null) to a local Date
export function toLocalDate(value) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value.toDate === "function") {
    return value.toDate();
  }

  return value instanceof Date ? value : null;
}

// Format a local Date for display, for example "Jun 20, 2026"
export function formatDueDate(dueDate) {
  if (!dueDate) {
    return "No due date";
  }

  return dueDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Count the tasks in each status
export function countTasks(tasks) {
  const countByStatus = (status) =>
    tasks.filter((task) => task.status === status).length;

  return {
    total: tasks.length,
    todo: countByStatus("To Do"),
    inProgress: countByStatus("In Progress"),
    completed: countByStatus("Completed"),
  };
}

// Build a view bound to a document, so it can also be tested in an iframe
export function createTaskListView(doc = document) {
  const byId = (id) => doc.getElementById(id);

  function createCell(label, className) {
    const cell = doc.createElement("td");
    cell.dataset.label = label;
    if (className) {
      cell.className = className;
    }
    return cell;
  }

  function createIconButton(kind, label) {
    const button = doc.createElement("button");
    button.type = "button";
    button.className = `icon-button icon-button--${kind}`;
    button.setAttribute("aria-label", label);
    button.innerHTML = ICONS[kind];
    return button;
  }

  function createTaskRow(task) {
    const row = doc.createElement("tr");
    row.dataset.taskId = task.id;

    const titleCell = createCell("Task", "task-title");
    titleCell.textContent = task.title;

    const statusCell = createCell("Status");
    const pill = doc.createElement("span");
    pill.className = `status ${STATUS_CLASSES[task.status] ?? ""}`.trim();
    pill.textContent = task.status;
    statusCell.append(pill);

    const dueDate = toLocalDate(task.dueDate);
    const dueCell = createCell("Due Date");
    const due = doc.createElement("span");
    due.className = dueDate ? "due-date" : "due-date due-date--none";
    due.innerHTML = ICONS.calendar;
    const dueText = doc.createElement("span");
    dueText.textContent = formatDueDate(dueDate);
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

  function setCounts(total, inProgress, completed) {
    byId("count-total").textContent = total;
    byId("count-in-progress").textContent = inProgress;
    byId("count-completed").textContent = completed;
  }

  // Show one list state (loading, empty, or error) in place of the table
  function showState(kind, message) {
    const state = byId("list-state");
    state.className = `list-state list-state--${kind}`;
    state.textContent = message;
    state.hidden = false;
    byId("task-table").hidden = true;
    byId("task-rows").replaceChildren();
  }

  function showTasks(tasks) {
    byId("list-state").hidden = true;
    byId("task-table").hidden = false;
    byId("task-rows").replaceChildren(...tasks.map(createTaskRow));
  }

  // Retrieve tasks with fetchTasks() and render the matching state
  async function load(fetchTasks) {
    // Counts show a dash until real data arrives, so they never look like zero tasks
    setCounts("–", "–", "–");
    showState("loading", "Loading tasks…");

    let tasks;
    try {
      tasks = await fetchTasks();
    } catch (error) {
      console.error("Could not load tasks:", error);
      showState("error", "Could not load tasks. Please check your connection and reload the page.");
      return;
    }

    const counts = countTasks(tasks);
    setCounts(counts.total, counts.inProgress, counts.completed);

    if (tasks.length === 0) {
      showState("empty", "No tasks yet. Add your first task above.");
      return;
    }

    showTasks(tasks);
  }

  return { load };
}
