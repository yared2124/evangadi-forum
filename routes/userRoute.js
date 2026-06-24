import express from "express";
import {
  register,
  login,
  checkUser,
  getProfile,
  updateProfile,
  deleteAccount,
  getUserQuestions,
  getUserAnswers,
} from "../controllers/userController.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/register", register);
router.post("/login", login);

// Protected routes (authentication required)
router.get("/checkUser", authMiddleware, checkUser);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.delete("/account", authMiddleware, deleteAccount);
router.get("/questions", authMiddleware, getUserQuestions);
router.get("/answers", authMiddleware, getUserAnswers);

export default router;
