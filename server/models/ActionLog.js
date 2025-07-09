import mongoose from "mongoose";

const actionLogSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  action: { type: String, required: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  timestamp: { type: Date, default: Date.now }
});

const ActionLog = mongoose.model("ActionLog", actionLogSchema);
export default ActionLog;
