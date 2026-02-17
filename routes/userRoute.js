import express from "express";
const router = express.Router();
// authenthication middleware
import authMiddleware from '../Middleware/authMiddleware.js';

// user controllers
import { register, login, checkUser } from "../controller/userController.js";

// registration route
router.post("/register", register);
// login route
router.post("/login", login);
// check user
router.get("/check", authMiddleware, checkUser);

export default router 

