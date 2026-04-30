import express from "express";
import {
  createEntry,
  getEntries,
  updateEntry,
  deleteEntry
} from "../controllers/journalController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createEntry);
router.get("/", protect, getEntries);
router.put("/:id", protect, updateEntry);
router.delete("/:id", protect, deleteEntry);

export default router;