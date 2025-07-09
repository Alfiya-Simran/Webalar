const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 A user connected");

    socket.on("taskCreated", (task) => {
      socket.broadcast.emit("taskCreated", task);
    });

    socket.on("taskUpdated", (task) => {
      socket.broadcast.emit("taskUpdated", task);
    });

    socket.on("taskDeleted", (taskId) => {
      socket.broadcast.emit("taskDeleted", taskId);
    });

    socket.on("disconnect", () => {
      console.log("🔴 A user disconnected");
    });
  });
};

export default setupSocket;
