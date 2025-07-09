import express from "express";
import auth from "../middlewares/authMiddleware.js";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getLogs,
  smartAssignTask
} from "../controllers/taskController.js";

const router = express.Router();

router.post("/:id/smart-assign", auth, smartAssignTask);
router.get("/", auth, getTasks);
router.post("/", auth, createTask);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);
router.get("/logs", auth, getLogs);

export default router;
