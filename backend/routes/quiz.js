const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");

/**
 * GET /quizzes
 */
router.get("/", async (req, res) => {
  try {
    const quizzes = await quizController.getAllQuizzes();
    res.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({
      error: "Failed to retrieve quizzes",
      details: error.message,
    });
  }
});

/**
 * GET /quizzes/:id
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const quiz = await quizController.getQuizById(id);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({
      error: "Failed to retrieve quiz",
      details: error.message,
    });
  }
});

/**
 * POST /quizzes/:quizId/attempts
 * Add or update a quiz attempt for a user
 */
router.post("/:quizId/attempts", async (req, res) => {
  const { quizId } = req.params;
  const { userId, score } = req.body;

  console.log('Received request with:', { quizId, userId, score }); // Debug log

  if (!userId || typeof userId !== 'string') {
    console.error('Invalid userId:', userId); // Debug log
    return res.status(400).json({
      error: "Invalid or missing userId",
      requiredFields: ["userId (string)"],
    });
  }

  if (typeof score !== "number" || score < 0) {
    return res.status(400).json({
      error: "Invalid score",
      requiredFields: ["score (positive number)"],
    });
  }

  try {
    console.log(
      `Received attempt data - userId: ${userId}, quizId: ${quizId}, score: ${score}`
    );

    const attempt = await quizController.addOrUpdateQuizAttempt(
      userId,
      quizId,
      score
    );

    res.status(200).json(attempt);
  } catch (error) {
    console.error("Error saving quiz attempt:", error);
    res.status(500).json({
      error: "Failed to save quiz attempt",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});
/**
 * GET /quizzes/:quizId/attempts/:userId
 * Get all attempts for a specific quiz by a specific user
 */
router.get("/:quizId/attempts/:userId", async (req, res) => {
  const { quizId, userId } = req.params;

  try {
    const attempts = await quizController.getQuizAttempts(quizId, userId);
    res.status(200).json(attempts);
  } catch (error) {
    console.error("Error fetching quiz attempts:", error);
    res.status(500).json({
      error: "Failed to retrieve quiz attempts",
      details: error.message,
    });
  }
});

/**
 * POST /quizzes
 */
router.post("/", async (req, res) => {
  const { title, userId, description } = req.body;

  if (!title || !userId) {
    return res.status(400).json({
      error: "Missing required fields",
      requiredFields: ["title", "userId"],
    });
  }

  try {
    const quiz = await quizController.createQuiz({
      title,
      description,
      userId,
    });

    res.status(201).json(quiz);
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({
      error: "Failed to create quiz",
      details: error.message,
    });
  }
});

/**
 * POST /quizzes/:quizId/questions
 */
router.post("/:quizId/questions", async (req, res) => {
  const { quizId } = req.params;
  const { type, question, order } = req.body;

  if (!type || !question) {
    return res.status(400).json({
      error: "Missing required fields",
      requiredFields: ["type", "question"],
    });
  }

  try {
    const newQuestion = await quizController.addQuestionToQuiz(quizId, {
      type,
      question,
      order,
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({
      error: "Failed to add question",
      details: error.message,
    });
  }
});

/**
 * POST /questions/:questionId/choices
 */
router.post("/questions/:questionId/choices", async (req, res) => {
  const { questionId } = req.params;
  const { text, isCorrect } = req.body;

  if (!text || typeof isCorrect !== "boolean") {
    return res.status(400).json({
      error: "Missing required fields",
      requiredFields: ["text", "isCorrect (true/false)"],
    });
  }

  try {
    const newChoice = await quizController.addChoiceToQuestion(questionId, {
      text,
      isCorrect,
    });

    res.status(201).json(newChoice);
  } catch (error) {
    console.error("Error adding choice:", error);
    res.status(500).json({
      error: "Failed to add choice",
      details: error.message,
    });
  }
});

/**
 * DELETE /quizzes/:id
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await quizController.deleteQuiz(id);
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({
      error: "Failed to delete quiz",
      details: error.message,
    });
  }
});

module.exports = router;
