import { getTasks, deleteTask } from "../../taskService.js";

async function testDeleteTask() {
  try {
    console.log("Starting Delete Task test...");

    // Find the existing test task
    const tasks = await getTasks();

    const testTask = tasks.find((task) => task.title === "Test Task");

    if (!testTask) {
      throw new Error("Test Task not found.");
    }

    // Delete the test task
    await deleteTask(testTask.id);

    // Retrieve tasks again to verify deletion
    const remainingTasks = await getTasks();

    const deletedTask = remainingTasks.find((task) => task.id === testTask.id);

    if (!deletedTask) {
      console.log("Delete Task test passed!");
      console.log("Deleted Task ID:", testTask.id);
    } else {
      throw new Error("Task still exists after deletion.");
    }
  } catch (error) {
    console.error("Delete Task test failed:", error);
  }
}

testDeleteTask();
