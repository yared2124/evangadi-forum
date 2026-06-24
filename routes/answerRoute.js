import express from "express";
import {
  getAnswersForQuestion,
  postAnswer,
  updateAnswer,
  deleteAnswer,
} from "../controllers/answerController.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router();

// Public route (no authentication required)
router.get("/:question_id", getAnswersForQuestion);

// Protected routes (authentication required)
router.post("/", authMiddleware, postAnswer);
router.put("/:answer_id", authMiddleware, updateAnswer);
router.delete("/:answer_id", authMiddleware, deleteAnswer);

export default router;
