import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ==================== AUTH ENDPOINTS ====================

// POST /api/user/register
export const register = async (req, res) => {
  try {
    const { username, first_name, last_name, email, password } = req.body;

    // Validate required fields
    if (!username || !first_name || !last_name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Please provide all required fields",
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Password must be at least 8 characters",
      });
    }

    // Check if user already exists
    const [existingUsers] = await db.query(
      "SELECT id FROM userTable WHERE username = ? OR email = ?",
      [username, email],
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        error: "Conflict",
        message: "User with this username or email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      `INSERT INTO userTable 
       (username, first_name, last_name, email, password_hash) 
       VALUES (?, ?, ?, ?, ?)`,
      [username, first_name, last_name, email, hashedPassword],
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        userId: result.insertId,
        username,
        email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

// POST /api/user/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Please provide email and password",
      });
    }

    // Find user by email
    const [users] = await db.query(
      "SELECT id, username, email, password_hash FROM userTable WHERE email = ?",
      [email],
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

// GET /api/user/checkUser
export const checkUser = async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    res.status(200).json({
      success: true,
      message: "Valid user",
      data: {
        userid: req.user.id.toString(),
        username: req.user.username,
        email: req.user.email,
      },
    });
  } catch (error) {
    console.error("Check user error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

// ==================== USER MANAGEMENT ENDPOINTS ====================

// GET /api/user/profile
export const getProfile = async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT id, username, first_name, last_name, email, created_at 
       FROM userTable WHERE id = ?`,
      [req.user.id],
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { user: users[0] },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

// PUT /api/user/profile
export const updateProfile = async (req, res) => {
  try {
    const { first_name, last_name, email, username } = req.body;
    const userId = req.user.id;

    // Check if email or username is taken by another user
    if (email || username) {
      const [existing] = await db.query(
        `SELECT id FROM userTable 
         WHERE (email = ? OR username = ?) AND id != ?`,
        [email, username, userId],
      );

      if (existing.length > 0) {
        return res.status(409).json({
          success: false,
          error: "Conflict",
          message: "Email or username already taken",
        });
      }
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (first_name) {
      updates.push("first_name = ?");
      values.push(first_name);
    }
    if (last_name) {
      updates.push("last_name = ?");
      values.push(last_name);
    }
    if (email) {
      updates.push("email = ?");
      values.push(email);
    }
    if (username) {
      updates.push("username = ?");
      values.push(username);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "No fields to update",
      });
    }

    values.push(userId);
    await db.query(
      `UPDATE userTable SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

// DELETE /api/user/account
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete user (cascading will delete questions and answers)
    await db.query("DELETE FROM userTable WHERE id = ?", [userId]);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

// GET /api/user/questions
export const getUserQuestions = async (req, res) => {
  try {
    const userId = req.user.id;

    const [questions] = await db.query(
      `SELECT id, title, description, created_at 
       FROM questionTabel 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [userId],
    );

    res.status(200).json({
      success: true,
      data: { questions },
    });
  } catch (error) {
    console.error("Get user questions error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

// GET /api/user/answers
export const getUserAnswers = async (req, res) => {
  try {
    const userId = req.user.id;

    const [answers] = await db.query(
      `SELECT a.id, a.answer, a.question_id, a.created_at,
              q.title as question_title
       FROM answerTable a
       JOIN questionTabel q ON a.question_id = q.id
       WHERE a.user_id = ? 
       ORDER BY a.created_at DESC`,
      [userId],
    );

    res.status(200).json({
      success: true,
      data: { answers },
    });
  } catch (error) {
    console.error("Get user answers error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};
