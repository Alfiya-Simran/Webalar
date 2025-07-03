const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  getTasks, createTask, updateTask, deleteTask, getLogs
} = require("../controllers/taskController");
const { smartAssignTask } = require("../controllers/taskController");

router.post("/:id/smart-assign", auth, smartAssignTask);

router.get("/", auth, getTasks);
router.post("/", auth, createTask);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);
router.get("/logs", auth, getLogs);

module.exports = router;
