import { useState, useEffect } from "react";
import { db } from "../Firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";

export function useTodos() {
  const [todos, setTodos] = useState([]);

  // Fetch Todos in Real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "todos"), (snapshot) => {
      setTodos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Add Task
  const addTodo = async (title) => {
    if (title.trim()) {
      await addDoc(collection(db, "todos"), { title, completed: false });
    }
  };

  // Update Task
  const updateTodo = async (id, newTitle) => {
    await updateDoc(doc(db, "todos", id), { title: newTitle });
  };

  // Toggle Complete
  const toggleComplete = async (id, completed) => {
    await updateDoc(doc(db, "todos", id), { completed: !completed });
  };

  // Delete Task
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  return { todos, addTodo, updateTodo, toggleComplete, deleteTodo };
}
