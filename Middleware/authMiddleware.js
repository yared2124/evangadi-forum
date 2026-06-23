import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Authentication invalid - No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token using JWT_SECRET from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Authentication invalid - Invalid token",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Authentication invalid - Token expired",
      });
    }

    return res.status(401).json({
      success: false,
      error: "Unauthorized",
      message: "Authentication invalid",
    });
  }
};

export default authMiddleware;
