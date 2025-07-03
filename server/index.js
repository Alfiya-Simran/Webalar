const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const socketio = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/task"));
app.use("/api/logs", require("./routes/logs"));

// Socket setup
require("./sockets/taskSocket")(io);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));
