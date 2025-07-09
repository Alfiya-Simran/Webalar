import React, { useState } from "react";
import axios from "axios";
import { useSocket } from "../content/SocketContext";

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
    <div className="modal-bg">
      <div className="modal">
        <h3>Create Task</h3>
        {conflict ? (
          <>
            <p>⚠ Conflict detected!</p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div>
                <h4>Your Version</h4>
                <pre>{JSON.stringify(conflict.local, null, 2)}</pre>
              </div>
              <div>
                <h4>Server Version</h4>
                <pre>{JSON.stringify(conflict.server, null, 2)}</pre>
              </div>
            </div>
            <button onClick={() => overwrite(conflict.local)}>Overwrite with Yours</button>
            <button onClick={() => overwrite(conflict.server)}>Keep Server Version</button>
            <button onClick={() => setConflict(null)}>Cancel</button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              required
            />
            <br />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              required
            />
            <br />
            <select name="priority" value={form.priority} onChange={handleChange}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <br />
            <select name="status" value={form.status} onChange={handleChange}>
              <option>Todo</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
            <br />
            <button type="submit">Create</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
