import dbConection from "../db/dbconfig.js";

export const getAnswersForQuestion = async (req, res) => {
  const questionId = req.params.question_id;

  try {
    const [questions] = await dbConection.query(
      "SELECT id FROM questionTabel WHERE id = ?",
      [questionId],
    );
    if (questions.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: "The requested question could not be found.",
      });
    }

    const [answers] = await dbConection.query(
      `
      SELECT a.id as answer_id, a.answer as content,
             u.username as user_name, a.created_at
      FROM answerTable a
      JOIN userTable u ON a.user_id = u.id
      WHERE a.question_id = ?
      ORDER BY a.created_at ASC
    `,
      [questionId],
    );

    res.status(200).json({ answers });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

export const postAnswer = async (req, res) => {
  const { questionid, answer } = req.body;
  const userId = req.user.id;

  if (!answer || answer.trim() === "") {
    return res.status(400).json({
      error: "Bad Request",
      message: "Please provide answer",
    });
  }

  if (!questionid) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Please provide question id",
    });
  }

  try {
    const [questions] = await dbConection.query(
      "SELECT id FROM questionTabel WHERE id = ?",
      [questionid],
    );
    if (questions.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: "The requested question could not be found.",
      });
    }

    await dbConection.query(
      "INSERT INTO answerTable (question_id, user_id, answer) VALUES (?, ?, ?)",
      [questionid, userId, answer],
    );
    res.status(201).json({ message: "Answer posted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};
