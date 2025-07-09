import React, { useState } from "react";
import axios from "axios";
import { useSocket } from "../content/SocketContext";
import styles from "./CreateTask.module.css";
export default function TaskModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Todo",
  });

  const [conflict, setConflict] = useState(null);
  const socket = useSocket();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/tasks`,
        form,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      socket.emit("taskCreated", res.data);
      onCreated();
      onClose();
    } catch (err) {
      alert("Create task failed");
    }
  };

  return (
  <div className={styles.modalBackground}>
    <div className={styles.modalContainer}>
      <h3>Create Task</h3>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        <select name="priority" onChange={handleChange} required>
          <option value="Low">Low</option>
          <option value="Medium" selected>Medium</option>
          <option value="High">High</option>
        </select>
        <div className={styles.buttonGroup}>
          <button type="submit">Create</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
);

}
