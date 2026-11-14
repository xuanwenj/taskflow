import { getTasks } from "../../taskService.js";
async function testReadTasks() {
  try {
    console.log("Starting Read Tasks test...");

    const tasks = await getTasks();

    console.log("Tasks retrieved successfully!");
    console.log("Number of tasks:", tasks.length);
    console.log("Retrieved tasks:", tasks);

    const testTask = tasks.find((task) => task.title === "Test Task");

    if (testTask) {
      console.log("Test Task found!");
      console.log("Task ID:", testTask.id);
      console.log("Status:", testTask.status);
      console.log("Due Date:", testTask.dueDate);
    } else {
      console.warn("Test Task was not found.");
    }
  } catch (error) {
    console.error("Read Tasks test failed:", error);
  }
}

testReadTasks();
