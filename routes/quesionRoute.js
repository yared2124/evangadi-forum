import express from "express";
import {
  getAllQuestions,
  getSingleQuestion,
  postQuestion,
} from "../controllers/questionController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllQuestions);
router.get("/:question_id", getSingleQuestion);
router.post("/", authMiddleware, postQuestion);

export default router;