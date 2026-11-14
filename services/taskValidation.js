const ALLOWED_STATUSES = ["To Do", "In Progress", "Completed"];

// Validate the task title and return it trimmed
export function validateTitle(title) {
  if (typeof title !== "string") {
    throw new Error("Task title must be a string.");
  }

  const trimmedTitle = title.trim();

  if (trimmedTitle === "") {
    throw new Error("Task title cannot be empty.");
  }

  return trimmedTitle;
}

// Validate that the status is one of the allowed values
export function validateStatus(status) {
  if (!ALLOWED_STATUSES.includes(status)) {
    throw new Error(
      `Invalid task status. Allowed values: ${ALLOWED_STATUSES.join(", ")}.`
    );
  }

  return status;
}

// Validate that the due date is null or a valid Date object
export function validateDueDate(dueDate) {
  if (dueDate === null) {
    return dueDate;
  }

  if (!(dueDate instanceof Date)) {
    throw new Error("Due date must be a Date object or null.");
  }

  if (Number.isNaN(dueDate.getTime())) {
    throw new Error("Due date is not a valid date.");
  }

  return dueDate;
}

// Validate all task fields and return a new task object
export function validateTask(taskData) {
  return {
    title: validateTitle(taskData.title),
    status: validateStatus(taskData.status),
    dueDate: validateDueDate(taskData.dueDate),
  };
}

// Validate that the task ID is a non-empty string
export function validateTaskId(taskId) {
  if (typeof taskId !== "string" || taskId.trim() === "") {
    throw new Error("Task ID must be a non-empty string.");
  }

  return taskId;
}

// Validate only the fields supplied in a partial task update
export function validateTaskUpdate(updatedData) {
  if (
    typeof updatedData !== "object" ||
    updatedData === null ||
    Array.isArray(updatedData)
  ) {
    throw new Error("Update data must be an object.");
  }

  const fields = Object.keys(updatedData);

  if (fields.length === 0) {
    throw new Error("Update data cannot be empty.");
  }

  const validators = {
    title: validateTitle,
    status: validateStatus,
    dueDate: validateDueDate,
  };

  const validatedData = {};

  for (const field of fields) {
    if (!(field in validators)) {
      throw new Error(`Unsupported task field: ${field}.`);
    }

    validatedData[field] = validators[field](updatedData[field]);
  }

  return validatedData;
}
