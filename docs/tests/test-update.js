import { getTasks, updateTask } from "../../taskService.js";

async function testUpdateTask() {
  try {
    console.log("Starting Update Task test...");

    // Find the existing test task
    const tasks = await getTasks();
    const testTask = tasks.find((task) => task.title === "Test Task");

    if (!testTask) {
      throw new Error("Test Task not found.");
    }

    // Update the task status
    await updateTask(testTask.id, {
      status: "In Progress",
    });

    // Read the task again to verify the update
    const updatedTasks = await getTasks();
    const updatedTask = updatedTasks.find((task) => task.id === testTask.id);

    console.log("Updated task:", updatedTask);

    if (updatedTask.status === "In Progress") {
      console.log("Update Task test passed!");
    } else {
      throw new Error("Task status was not updated.");
    }
  } catch (error) {
    console.error("Update Task test failed:", error);
  }
}

testUpdateTask();
