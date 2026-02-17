import express from "express";
const router = express.Router();
// import authMiddleware from '../Middleware/authMiddleware.js';


router.post("/all-answer", (req, res) => {
    res.send("all answer route");});




export default router;