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
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/checkUser", authMiddleware, checkUser);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.delete("/account", authMiddleware, deleteAccount);
router.get("/questions", authMiddleware, getUserQuestions);
router.get("/answers", authMiddleware, getUserAnswers);

export default router;
