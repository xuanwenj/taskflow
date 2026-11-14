import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";

// Create a new task
export async function createTask(taskData) {
  try {
    const docRef = await addDoc(collection(db, "tasks"), {
      title: taskData.title,
      status: taskData.status,
      dueDate: taskData.dueDate,
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}

// Read all tasks
export async function getTasks() {
  try {
    const querySnapshot = await getDocs(collection(db, "tasks"));

    const tasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return tasks;
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    throw error;
  }
}

// Update an existing task
export async function updateTask(taskId, updatedData) {
  try {
    const taskRef = doc(db, "tasks", taskId);

    await updateDoc(taskRef, updatedData);

    console.log("Task updated successfully!");
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

// Delete an existing task
export async function deleteTask(taskId) {
  try {
    const taskRef = doc(db, "tasks", taskId);

    await deleteDoc(taskRef);

    console.log("Task deleted successfully!");
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}
