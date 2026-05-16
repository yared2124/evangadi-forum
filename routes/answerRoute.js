import express from "express";
import {
  getAnswersForQuestion,
  postAnswer,
} from "../controllers/answerController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/:question_id", getAnswersForQuestion);
router.post("/", authMiddleware, postAnswer);

export default router;
