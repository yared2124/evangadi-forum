import dbConection from "../db/dbconfig.js";

export const getAllQuestions = async (req, res) => {
  try {
    const [questions] = await dbConection.query(`
      SELECT q.id as question_id, q.title, q.description as content,
             u.username as user_name, q.created_at
      FROM questionTabel q
      JOIN userTable u ON q.user_id = u.id
      ORDER BY q.created_at DESC
    `);

    if (questions.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: "No questions found.",
      });
    }
    res.status(200).json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

export const getSingleQuestion = async (req, res) => {
  const questionId = req.params.question_id;

  try {
    const [questions] = await dbConection.query(
      `SELECT q.id as question_id, q.title, q.description as content,
              q.user_id, q.created_at
       FROM questionTabel q
       WHERE q.id = ?`,
      [questionId],
    );

    if (questions.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: "The requested question could not be found.",
      });
    }
    res.status(200).json({ question: questions[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

export const postQuestion = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;

  if (!title || !description) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  try {
    await dbConection.query(
      "INSERT INTO questionTabel (title, description, user_id) VALUES (?, ?, ?)",
      [title, description, userId],
    );
    res.status(201).json({ message: "Question created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};
