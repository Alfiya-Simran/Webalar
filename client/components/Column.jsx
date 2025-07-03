import React from "react";

import { Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

export default function Column({ status, tasks }) {
  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            flex: 1,
            background: "#f2f2f2",
            padding: "1rem",
            borderRadius: "8px",
            minHeight: "300px",
          }}
        >
          <h3>{status}</h3>
          {tasks.map((task, index) => (
            <TaskCard key={task._id} task={task} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
