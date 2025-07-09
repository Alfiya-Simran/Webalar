import Task from "../models/Task.js";
import ActionLog from "../models/ActionLog.js";
import User from "../models/User.js";

export const getTasks = async (req, res) => {
  const tasks = await Task.find().populate("assignedTo", "name email");
  res.json(tasks);
};

export const createTask = async (req, res) => {
  const task = await Task.create(req.body);
  await ActionLog.create({
    taskId: task._id,
    action: `Task '${task.title}' created`,
    performedBy: req.user.id
  });
  res.status(201).json(task);
};

export const updateTask = async (req, res) => {
  const { updatedAt } = req.body;

  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ msg: "Task not found" });

  if (updatedAt && new Date(updatedAt) < task.updatedAt) {
    return res.status(409).json({
      msg: "Conflict detected",
      serverVersion: task
    });
  }

  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });

  await ActionLog.create({
    taskId: updated._id,
    action: `Task '${updated.title}' updated`,
    performedBy: req.user.id
  });

  res.json(updated);
};

export const deleteTask = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  await ActionLog.create({
    taskId: task._id,
    action: `Task '${task.title}' deleted`,
    performedBy: req.user.id
  });
  res.json({ msg: "Deleted" });
};

export const getLogs = async (req, res) => {
  const logs = await ActionLog.find()
    .sort({ timestamp: -1 })
    .limit(20)
    .populate("performedBy", "name");
  res.json(logs);
};

export const smartAssignTask = async (req, res) => {
  try {
    const tasks = await Task.find({
      status: { $in: ["Todo", "In Progress"] },
    });

    const userTaskCount = {};

    tasks.forEach((task) => {
      const uid = task.assignedTo?.toString();
      if (uid) userTaskCount[uid] = (userTaskCount[uid] || 0) + 1;
    });

    const users = await User.find();

    let bestUser = null;
    let minTasks = Infinity;

    users.forEach((user) => {
      const count = userTaskCount[user._id.toString()] || 0;
      if (count < minTasks) {
        bestUser = user;
        minTasks = count;
      }
    });

    if (!bestUser) return res.status(404).json({ msg: "No users found" });

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo: bestUser._id },
      { new: true }
    );

    await ActionLog.create({
      taskId: task._id,
      action: `Task '${task.title}' assigned to ${bestUser.name} (Smart Assign)`,
      performedBy: req.user.id
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
