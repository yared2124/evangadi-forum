import express from "express";
import {
  getAnswersForQuestion,
  getSingleAnswer,
  postAnswer,
  updateAnswer,
  deleteAnswer,
} from "../controllers/answerController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/:question_id", getAnswersForQuestion);
router.get("/single/:answer_id", getSingleAnswer);

// Protected routes
router.post("/", authMiddleware, postAnswer);
router.put("/:answer_id", authMiddleware, updateAnswer);
router.delete("/:answer_id", authMiddleware, deleteAnswer);

export default router;
