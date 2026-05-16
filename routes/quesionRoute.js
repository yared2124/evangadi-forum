import express from "express";
import {
  getAllQuestions,
  getSingleQuestion,
  postQuestion,
} from "../controller/questionController.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllQuestions);
router.get("/:question_id", getSingleQuestion);
router.post("/", authMiddleware, postQuestion);

export default router;
