import React from "react";

import { useEffect, useState } from "react";
import Column from "../components/Column";
import axios from "axios";
import { DragDropContext } from "react-beautiful-dnd";
import { useSocket } from "../content/SocketContext";
import TaskModal from "../components/TaskModal";
const statusTypes = ["Todo", "In Progress", "Done"];

export default function Board() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const socket = useSocket();
  const refresh = () => fetchTasks();
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/tasks`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setTasks(res.data);
    } catch (err) {
      alert("Failed to fetch tasks");
    }
  };

 useEffect(() => {
  fetchTasks();

  if (!socket) return;

  socket.on("taskCreated", (task) => {
    setTasks((prev) => [...prev, task]);
  });

  socket.on("taskUpdated", (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
    );
  });

  socket.on("taskDeleted", (id) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
  });

  return () => {
    socket.off("taskCreated");
    socket.off("taskUpdated");
    socket.off("taskDeleted");
  };
}, [socket]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const updatedTasks = [...tasks];
    const draggedTask = updatedTasks.find((t) => t._id === draggableId);
    draggedTask.status = destination.droppableId;
    setTasks(updatedTasks);

    // Save change to backend
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/tasks/${draggableId}`, draggedTask, {
        headers: { Authorization: localStorage.getItem("token") },
      });
    } catch (err) {
      alert("Failed to update task status");
    }
  };


  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
        <div style={{ flex: 1 }}>
        <h2>Kanban Board</h2>
        <button onClick={() => setShowModal(true)}>+ New Task</button>
      </div></div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
          {statusTypes.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={tasks.filter((t) => t.status === status)}
            />
          ))}
        </div>
      </DragDropContext>

      {showModal && (
        <TaskModal onClose={() => setShowModal(false)} onCreated={refresh} />
      )}
    </>
  );
}

