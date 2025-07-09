import React, { useState } from "react";
import axios from "axios";
import { Draggable } from "react-beautiful-dnd";
import { useSocket } from "../content/SocketContext";

export default function TaskCard({ task, index }) {
  const socket = useSocket();
  const [loading, setLoading] = useState(false);

  const handleSmartAssign = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/tasks/${task._id}/smart-assign`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (res?.data?.assignedTo?.name) {
        alert(`✅ Assigned to ${res.data.assignedTo.name}`);
      } else {
        alert("⚠ Task assigned, but no user name returned");
      }

      if (socket) socket.emit("taskUpdated", res.data);
    } catch (err) {
      console.error("Smart assign error:", err);
      alert(
        err.response?.data?.msg ||
          "❌ Smart assign failed. Please check network or server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            padding: "1rem",
            marginBottom: "0.5rem",
            background: "#fefefe",
            border: "1px solid #ddd",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            borderRadius: "6px",
            fontFamily: "sans-serif",
            ...provided.draggableProps.style,
          }}
        >
          <strong style={{ display: "block", marginBottom: "4px" }}>
            {task.title}
          </strong>
          <p style={{ margin: "0 0 4px", color: "#555" }}>{task.description}</p>
          <small>
            Assigned to: <strong>{task?.assignedTo?.name || "Unassigned"}</strong>
          </small>
          <br />
          <small>Priority: {task.priority}</small>
          <br />
          <button
            onClick={handleSmartAssign}
            disabled={loading}
            style={{
              marginTop: "6px",
              padding: "4px 10px",
              fontSize: "0.85rem",
              backgroundColor: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Assigning..." : "Smart Assign"}
          </button>
        </div>
      )}
    </Draggable>
  );
}
