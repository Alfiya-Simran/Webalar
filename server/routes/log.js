import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Logs route works!" });
});

export default router;
