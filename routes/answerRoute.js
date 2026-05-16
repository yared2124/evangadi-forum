import express from "express";
import {
  getAnswersForQuestion,
  postAnswer,
} from "../controller/answerController.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/:question_id", getAnswersForQuestion);
router.post("/", authMiddleware, postAnswer);

export default router;
