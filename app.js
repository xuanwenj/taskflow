import { createTaskListView, toLocalDate } from "./taskListView.js";

// The Application Layer is loaded with a dynamic import so that a failure to
// load the module also shows the error state.
const loadAppService = () => import("./services/taskAppService.js");

// Convert the date input value (YYYY-MM-DD) to a local Date, or null when empty.
// Anything else is passed on unchanged so the Application Layer rejects it.
function parseDateInput(value) {
  if (value === "") {
    return null;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : value;
}

// Format a local Date as YYYY-MM-DD for the date input
function toDateInputValue(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Wire the dashboard in `doc` to the Application Layer returned by loadService()
export function initApp(doc = document, loadService = loadAppService) {
  const byId = (id) => doc.getElementById(id);
  const form = byId("add-task-form");
  const titleInput = byId("task-title");
  const dateInput = byId("task-due-date");
  const statusSelect = byId("task-status");
  const submitButton = byId("task-submit");
  const feedback = byId("feedback");
  const deleteDialog = byId("delete-dialog");

  let editingTask = null;
  let busy = false;
  let taskToDelete = null;

  const service = async () => loadService();
  const fetchTasks = async () => (await service()).getTasks();

  function showFeedback(kind, message) {
    feedback.className = `feedback feedback--${kind}`;
    feedback.textContent = message;
    feedback.hidden = false;
  }

  function clearFeedback() {
    feedback.hidden = true;
    feedback.textContent = "";
  }

  // Show the date placeholder as text, and switch to a date picker on focus
  dateInput.addEventListener("focus", () => {
    dateInput.type = "date";
  });
  dateInput.addEventListener("blur", () => {
    if (!dateInput.value) {
      dateInput.type = "text";
    }
  });

  function setBusy(isBusy) {
    busy = isBusy;
    submitButton.disabled = isBusy;
  }

  function resetForm() {
    form.reset();
    dateInput.type = "text";
  }

  // Switch the form between "add" and "edit" mode
  function setFormMode(task) {
    editingTask = task;
    byId("add-task-heading").textContent = task ? "Edit Task" : "Add New Task";
    byId("task-submit-label").textContent = task ? "Save Changes" : "Add Task";
    byId("task-submit-icon").toggleAttribute("hidden", Boolean(task));
    byId("task-cancel").hidden = !task;
    view.setEditing(task ? task.id : null);
  }

  function startEdit(task) {
    clearFeedback();
    setFormMode(task);
    titleInput.value = task.title;
    statusSelect.value = task.status;

    const dueDate = toLocalDate(task.dueDate);
    dateInput.type = dueDate ? "date" : "text";
    dateInput.value = dueDate ? toDateInputValue(dueDate) : "";

    byId("add-task-heading").scrollIntoView?.({ block: "center" });
    titleInput.focus();
  }

  function cancelEdit() {
    resetForm();
    setFormMode(null);
  }

  const view = createTaskListView(doc, {
    onEdit: startEdit,
    onDelete: (task) => {
      taskToDelete = task;
      byId("delete-dialog-text").textContent = `"${task.title}" will be permanently deleted.`;
      deleteDialog.showModal();
    },
    onStatusChange: changeStatus,
  });

  const refresh = () => view.load(fetchTasks, { showLoading: false });

  async function addTask(values) {
    await (await service()).createTask(values);
    resetForm();
    showFeedback("success", `Task "${values.title.trim()}" added.`);
  }

  async function saveEdit(values) {
    const changes = {};
    if (values.title.trim() !== editingTask.title) changes.title = values.title;
    if (values.status !== editingTask.status) changes.status = values.status;

    const oldDate = toLocalDate(editingTask.dueDate);
    const dateChanged =
      values.dueDate instanceof Date
        ? !oldDate || values.dueDate.getTime() !== oldDate.getTime()
        : values.dueDate !== null || oldDate !== null;
    if (dateChanged) changes.dueDate = values.dueDate;

    if (Object.keys(changes).length === 0) {
      cancelEdit();
      showFeedback("info", "No changes to save.");
      return false;
    }

    await (await service()).updateTask(editingTask.id, changes);
    const title = changes.title ? changes.title.trim() : editingTask.title;
    cancelEdit();
    showFeedback("success", `Task "${title}" updated.`);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (busy) return;

    clearFeedback();
    setBusy(true);
    const values = {
      title: titleInput.value,
      dueDate: parseDateInput(dateInput.value),
      status: statusSelect.value,
    };

    try {
      const changed = editingTask ? await saveEdit(values) : await addTask(values);
      if (changed !== false) await refresh();
    } catch (error) {
      // The form keeps its values so the user can correct them
      showFeedback("error", error.message || "The task could not be saved.");
    } finally {
      setBusy(false);
    }
  });

  byId("task-cancel").addEventListener("click", () => {
    clearFeedback();
    cancelEdit();
  });

  async function changeStatus(task, status) {
    clearFeedback();
    try {
      await (await service()).updateTask(task.id, { status });
      showFeedback("success", `"${task.title}" is now ${status}.`);
      await refresh();
    } catch (error) {
      // Re-render from the loaded tasks so the list shows the stored status
      view.render();
      showFeedback("error", error.message || "The status could not be changed.");
    }
  }

  byId("delete-cancel").addEventListener("click", () => {
    taskToDelete = null;
    deleteDialog.close();
  });
  deleteDialog.addEventListener("close", () => {
    taskToDelete = null;
  });

  byId("delete-confirm").addEventListener("click", async () => {
    const task = taskToDelete;
    deleteDialog.close();
    if (!task) return;

    clearFeedback();
    try {
      await (await service()).deleteTask(task.id);
      if (editingTask && editingTask.id === task.id) cancelEdit();
      showFeedback("success", `Task "${task.title}" deleted.`);
      await refresh();
    } catch (error) {
      showFeedback("error", error.message || "The task could not be deleted.");
    }
  });

  return view.load(fetchTasks);
}

// Start automatically on the dashboard page (not when imported by a test page)
if (document.getElementById("add-task-form")) {
  initApp();
}
