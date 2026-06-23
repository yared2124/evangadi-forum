import db from "../config/db.js";

// ==================== ANSWER ENDPOINTS ====================

// GET /api/answer/:question_id
export const getAnswersForQuestion = async (req, res) => {
  try {
    const questionId = req.params.question_id;

    if (!questionId || isNaN(questionId)) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Invalid question ID",
      });
    }

    // Check if question exists
    const [questions] = await db.query(
      "SELECT id FROM questionTabel WHERE id = ?",
      [questionId],
    );

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "The requested question could not be found",
      });
    }

    const [answers] = await db.query(
      `
      SELECT 
        a.id as answer_id,
        a.answer as content,
        u.id as user_id,
        u.username as user_name,
        a.created_at
      FROM answerTable a
      JOIN userTable u ON a.user_id = u.id
      WHERE a.question_id = ?
      ORDER BY a.created_at ASC
    `,
      [questionId],
    );

    res.status(200).json({
      success: true,
      data: {
        count: answers.length,
        answers,
      },
    });
  } catch (error) {
    console.error("Get answers error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

// GET /api/answer/:answer_id/single
export const getSingleAnswer = async (req, res) => {
  try {
    const answerId = req.params.answer_id;

    if (!answerId || isNaN(answerId)) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Invalid answer ID",
      });
    }

    const [answers] = await db.query(
      `
      SELECT 
        a.id as answer_id,
        a.answer as content,
        u.id as user_id,
        u.username as user_name,
        a.question_id,
        a.created_at
      FROM answerTable a
      JOIN userTable u ON a.user_id = u.id
      WHERE a.id = ?
    `,
      [answerId],
    );

    if (answers.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Answer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { answer: answers[0] },
    });
  } catch (error) {
    console.error("Get single answer error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

// POST /api/answer
export const postAnswer = async (req, res) => {
  try {
    const { questionid, answer } = req.body;
    const userId = req.user.id;

    if (!questionid || isNaN(questionid)) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Please provide a valid question id",
      });
    }

    if (!answer || !answer.trim()) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Please provide an answer",
      });
    }

    // Check if question exists
    const [questions] = await db.query(
      "SELECT id FROM questionTabel WHERE id = ?",
      [questionid],
    );

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "The requested question could not be found",
      });
    }

    const [result] = await db.query(
      "INSERT INTO answerTable (question_id, user_id, answer) VALUES (?, ?, ?)",
      [questionid, userId, answer.trim()],
    );

    res.status(201).json({
      success: true,
      message: "Answer posted successfully",
      data: {
        answer_id: result.insertId,
        question_id: questionid,
        answer: answer.trim(),
      },
    });
  } catch (error) {
    console.error("Post answer error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

// PUT /api/answer/:answer_id
export const updateAnswer = async (req, res) => {
  try {
    const answerId = req.params.answer_id;
    const { answer } = req.body;
    const userId = req.user.id;

    // Check if answer exists and belongs to user
    const [answers] = await db.query(
      "SELECT id, user_id FROM answerTable WHERE id = ?",
      [answerId],
    );

    if (answers.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Answer not found",
      });
    }

    if (answers[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "You are not authorized to update this answer",
      });
    }

    if (!answer || !answer.trim()) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Please provide an answer",
      });
    }

    await db.query("UPDATE answerTable SET answer = ? WHERE id = ?", [
      answer.trim(),
      answerId,
    ]);

    res.status(200).json({
      success: true,
      message: "Answer updated successfully",
    });
  } catch (error) {
    console.error("Update answer error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

// DELETE /api/answer/:answer_id
export const deleteAnswer = async (req, res) => {
  try {
    const answerId = req.params.answer_id;
    const userId = req.user.id;

    // Check if answer exists and belongs to user
    const [answers] = await db.query(
      "SELECT id, user_id FROM answerTable WHERE id = ?",
      [answerId],
    );

    if (answers.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Answer not found",
      });
    }

    if (answers[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "You are not authorized to delete this answer",
      });
    }

    await db.query("DELETE FROM answerTable WHERE id = ?", [answerId]);

    res.status(200).json({
      success: true,
      message: "Answer deleted successfully",
    });
  } catch (error) {
    console.error("Delete answer error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};
