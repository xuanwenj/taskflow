import {
  createTask as createTaskInDb,
  getTasks as getTasksFromDb,
  updateTask as updateTaskInDb,
  deleteTask as deleteTaskInDb,
} from "../taskService.js";
import {
  validateTask,
  validateTaskId,
  validateTaskUpdate,
} from "./taskValidation.js";

const DEFAULT_STATUS = "To Do";
const DEFAULT_DUE_DATE = null;

// Create a new task, applying defaults for an omitted status or due date
export async function createTask(taskData) {
  if (typeof taskData !== "object" || taskData === null) {
    throw new Error("Task data must be an object.");
  }

  const validatedTask = validateTask({
    ...taskData,
    status: taskData.status === undefined ? DEFAULT_STATUS : taskData.status,
    dueDate:
      taskData.dueDate === undefined ? DEFAULT_DUE_DATE : taskData.dueDate,
  });

  return createTaskInDb(validatedTask);
}

// Retrieve all tasks
export async function getTasks() {
  return getTasksFromDb();
}

// Update an existing task with only the supplied fields
export async function updateTask(taskId, updatedData) {
  const validatedId = validateTaskId(taskId);
  const validatedData = validateTaskUpdate(updatedData);

  return updateTaskInDb(validatedId, validatedData);
}

// Delete an existing task
export async function deleteTask(taskId) {
  const validatedId = validateTaskId(taskId);

  return deleteTaskInDb(validatedId);
}
