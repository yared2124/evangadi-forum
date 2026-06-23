import express from "express";
import {
  getAllQuestions,
  getSingleQuestion,
  postQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllQuestions);
router.get("/:question_id", getSingleQuestion);

// Protected routes
router.post("/", authMiddleware, postQuestion);
router.put("/:question_id", authMiddleware, updateQuestion);
router.delete("/:question_id", authMiddleware, deleteQuestion);

export default router;
