import { createTaskListView } from "./taskListView.js";

// Load tasks through the Application Layer only. The import is made inside the
// loader so that a failure to load the module also shows the error state.
async function fetchTasks() {
  const { getTasks } = await import("./services/taskAppService.js");
  return getTasks();
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

setUpDateField();

// Creating tasks is implemented in Stage 3.3; for now the form does nothing
document
  .getElementById("add-task-form")
  .addEventListener("submit", (event) => event.preventDefault());

createTaskListView().load(fetchTasks);
