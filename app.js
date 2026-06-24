import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from "./db/dbconfig.js";

// Import routes
import userRoutes from "./routes/userRoute.js";
import questionRoutes from "./routes/questionRoute.js"; // ← Make sure this file exists
import answerRoutes from "./routes/answerRoute.js";

// Import middleware
import authMiddleware from "./Middleware/authMiddleware.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5500;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: "Endpoint not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message: "An unexpected error occurred.",
  });
});

// Start server
async function start() {
  try {
    // Test database connection
    const [result] = await dbConnection.query(
      "SELECT 'Connection successful' as message",
    );
    console.log("✅ Database connection established");
    console.log(`📁 Using database: ${process.env.DATABASE}`);
    console.log(`👤 User: ${process.env.USER}`);

    await app.listen(port);
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`📡 API available at http://localhost:${port}/api`);
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

start();
