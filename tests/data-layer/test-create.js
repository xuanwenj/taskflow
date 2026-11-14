import { createTask } from "../../taskService.js";
async function testCreateTask() {
  try {
    const taskId = await createTask({
      title: "Test Task",
      status: "To Do",
      dueDate: null,
    });

    console.log("Task created successfully!");
    console.log("New Task ID:", taskId);
  } catch (error) {
    console.error("Create Task test failed:", error);
  }
}

testCreateTask();
