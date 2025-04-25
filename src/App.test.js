import React, { useEffect, useState } from "react";
import { auth, db } from "./Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import "./App.css";
import { FiTrash2, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import Login from "./Login";
import Register from "./Register";


function App() {
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editInput, setEditInput] = useState("");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(collection(db, "todos"), (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodos(tasks);
    });
    return () => unsubscribe();
  }, [user]);

  const addTodo = async () => {
    if (input.trim()) {
      await addDoc(collection(db, "todos"), {
        text: input,
        completed: false,
      });
      setInput("");
    }
  };

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  const toggleComplete = async (id, completed) => {
    await updateDoc(doc(db, "todos", id), {
      completed: !completed,
    });
  };

  const startEdit = (id, text) => {
    setEditId(id);
    setEditInput(text);
  };

  const saveEdit = async () => {
    await updateDoc(doc(db, "todos", editId), {
      text: editInput,
    });
    setEditId(null);
    setEditInput("");
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (!user) {
    return <LoginRegister onUserLoggedIn={() => setUser(auth.currentUser)} />;
  }

  return (
    <div className="container">
      <h1 className="heading">My To-Do List</h1>
      <button onClick={handleLogout} className="logout-btn">Logout</button>

      <div className="input-group">
        <input
          className="input"
          value={input}
          placeholder="Add a new task..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />
        <button className="add-btn" onClick={addTodo}>Add</button>
      </div>

      <ul className="list">
        {todos.map((todo) => (
          <li key={todo.id} className="list-item">
            {editId === todo.id ? (
              <>
                <input
                  className="edit-input"
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                />
                <button className="save-btn" onClick={saveEdit}><FiCheck /></button>
                <button className="cancel-btn" onClick={() => setEditId(null)}><FiX /></button>
              </>
            ) : (
              <>
                <span
                  onClick={() => toggleComplete(todo.id, todo.completed)}
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                    cursor: "pointer",
                    flex: 1,
                  }}
                >
                  {todo.text}
                </span>
                <button className="edit-btn" onClick={() => startEdit(todo.id, todo.text)}><FiEdit2 /></button>
                <button className="delete-btn" onClick={() => deleteTodo(todo.id)}><FiTrash2 /></button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
