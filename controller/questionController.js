import db from "../db/dbconfig.js";

// GET /api/questions/
export const getAllQuestions = async (req, res) => {
  try {
    const [questions] = await db.query(`
            SELECT 
                q.id as question_id,
                q.title,
                q.description as content,
                u.username as user_name,
                u.id as user_id,
                q.created_at,
                (SELECT COUNT(*) FROM answerTable WHERE question_id = q.id) as answer_count
            FROM questionTabel q
            JOIN userTable u ON q.user_id = u.id
            ORDER BY q.created_at DESC
        `);

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "No questions found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        count: questions.length,
        questions,
      },
    });
  } catch (error) {
    console.error("Get all questions error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

// GET /api/questions/:question_id
export const getSingleQuestion = async (req, res) => {
  try {
    const questionId = req.params.question_id;

    if (!questionId || isNaN(questionId)) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Invalid question ID",
      });
    }

    const [questions] = await db.query(
      `
            SELECT 
                q.id as question_id,
                q.title,
                q.description as content,
                q.user_id,
                u.username as user_name,
                q.created_at,
                (SELECT COUNT(*) FROM answerTable WHERE question_id = q.id) as answer_count
            FROM questionTabel q
            JOIN userTable u ON q.user_id = u.id
            WHERE q.id = ?
        `,
      [questionId],
    );

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "The requested question could not be found",
      });
    }

    res.status(200).json({
      success: true,
      data: { question: questions[0] },
    });
  } catch (error) {
    console.error("Get single question error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

// POST /api/questions/
export const postQuestion = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Please provide a question title",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Please provide a question description",
      });
    }

    const [result] = await db.query(
      "INSERT INTO questionTabel (title, description, user_id) VALUES (?, ?, ?)",
      [title.trim(), description.trim(), userId],
    );

    res.status(201).json({
      success: true,
      message: "Question created successfully",
      data: {
        question_id: result.insertId,
        title: title.trim(),
        description: description.trim(),
      },
    });
  } catch (error) {
    console.error("Post question error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

// PUT /api/questions/:question_id
export const updateQuestion = async (req, res) => {
  try {
    const questionId = req.params.question_id;
    const { title, description } = req.body;
    const userId = req.user.id;

    // Check if question exists and belongs to user
    const [questions] = await db.query(
      "SELECT id, user_id FROM questionTabel WHERE id = ?",
      [questionId],
    );

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Question not found",
      });
    }

    if (questions[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "You are not authorized to update this question",
      });
    }

    const updates = [];
    const values = [];

    if (title && title.trim()) {
      updates.push("title = ?");
      values.push(title.trim());
    }
    if (description && description.trim()) {
      updates.push("description = ?");
      values.push(description.trim());
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "No fields to update",
      });
    }

    values.push(questionId);
    await db.query(
      `UPDATE questionTabel SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
    });
  } catch (error) {
    console.error("Update question error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

// DELETE /api/questions/:question_id
export const deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.question_id;
    const userId = req.user.id;

    // Check if question exists and belongs to user
    const [questions] = await db.query(
      "SELECT id, user_id FROM questionTabel WHERE id = ?",
      [questionId],
    );

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Question not found",
      });
    }

    if (questions[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "You are not authorized to delete this question",
      });
    }

    await db.query("DELETE FROM questionTabel WHERE id = ?", [questionId]);

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Delete question error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};
