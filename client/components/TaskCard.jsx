import React from "react";
import axios from "axios";
import { Draggable } from "react-beautiful-dnd";
import { useSocket } from "../content/SocketContext";

export default function TaskCard({ task, index }) {
  const socket = useSocket();

  const handleSmartAssign = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/tasks/${task._id}/smart-assign`,
        {},
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      alert(`Assigned to ${res.data.assignedTo.name}`);
      socket.emit("taskUpdated", res.data);
    } catch (err) {
      alert("Smart assign failed");
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
            background: "#fff",
            borderRadius: "6px",
            ...provided.draggableProps.style,
          }}
        >
          <strong>{task.title}</strong>
          <p>{task.description}</p>
          <small>Assigned: {task?.assignedTo?.name || "Unassigned"}</small><br />
          <small>Priority: {task.priority}</small><br />
          <button onClick={handleSmartAssign} style={{ marginTop: "6px" }}>
            Smart Assign
          </button>
        </div>
      )}
    </Draggable>
  );
}
