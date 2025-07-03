const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  action: String,
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ActionLog", logSchema);
