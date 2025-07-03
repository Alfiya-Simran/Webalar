import React from "react";

import { useState } from "react";
import axios from "axios";
import { useSocket } from "../content/SocketContext";

export default function TaskModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Todo",
  });

  const socket = useSocket();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.put(
      `${VITE_BACKEND_URL}/tasks/${task._id}`,
      taskData, // includes taskData.updatedAt
      { headers: { Authorization: token } }
    );
    socket.emit("taskUpdated", res.data);
    onClose();
  } catch (err) {
    if (err.response?.status === 409) {
      const serverTask = err.response.data.serverVersion;
      // Show modal/dialog to merge or overwrite
      setConflict({ local: taskData, server: serverTask });
    } else {
      alert("Update failed");
    }
  }
};

const overwrite = async (versionToUse) => {
  try {
    const res = await axios.put(
      `${VITE_BACKEND_URL}/tasks/${versionToUse._id}`,
      versionToUse,
      { headers: { Authorization: token } }
    );
    socket.emit("taskUpdated", res.data);
    setConflict(null);
    onClose();
  } catch (err) {
    alert("Failed to overwrite");
  }
};

  return (
  <div className="modal-bg">
    <div className="modal">
      <h3>{task ? "Edit Task" : "Create Task"}</h3>

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
            value={taskData.title}
            onChange={handleChange}
            placeholder="Title"
          />
          <textarea
            name="description"
            value={taskData.description}
            onChange={handleChange}
            placeholder="Description"
          />
          {/* More fields... */}
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      )}
    </div>
  </div>
);

}
