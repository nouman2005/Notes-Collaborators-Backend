import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createNote,
  getMyNotes,
  getNoteById,
  getNoteByShareToken,
  shareNote,
  updateNote,
} from "../controllers/note.controller.js";
const router = express.Router();

router.post("/", protect, createNote);
router.get("/", protect, getMyNotes);
router.get("/:id", protect, getNoteById);
router.put("/:noteId", protect, updateNote);
router.post("/:noteId/share", protect, shareNote);
router.get("/share/:token", getNoteByShareToken);

export default router;
