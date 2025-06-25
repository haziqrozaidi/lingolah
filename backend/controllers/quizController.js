const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

/**
 * Get all quizzes
 */
exports.getAllQuizzes = async () => {
  const quizzes = await prisma.quiz.findMany({
    include: {
      user: {
        select: { id: true, username: true },
      },
      questions: {
        include: { choices: true, matchPairs: true },
      },
    },
    orderBy: { id: "asc" },
  });

  return quizzes.map(formatQuiz);
};

/**
 * Get a quiz by ID
 */
exports.getQuizById = async (id) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, username: true },
      },
      questions: {
        include: { choices: true, matchPairs: true },
      },
    },
  });

  if (!quiz) return null;

  return formatQuiz(quiz);
};

/**
 * Create a new quiz
 */
exports.createQuiz = async (quizData) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: quizData.userId },
  });

  console.error("Creating quiz with data:", quizData); // Debug log

  if (!existingUser) {
    throw new Error(`User with ID ${quizData.userId} not found`);
  }

  const newQuiz = await prisma.quiz.create({
    data: {
      title: quizData.title,
      description: quizData.description || "",
      userId: quizData.userId,
      difficulty: quizData.difficulty,
      type: quizData.type,
    },
    include: {
      user: {
        select: { id: true, username: true },
      },
      questions: true,
    },
  });

  return formatQuiz(newQuiz);
};

/**
 * Delete a question from a quiz, including its choices and matchPairs
 */
exports.deleteQuestionFromQuiz = async (quizId, questionId) => {
  const question = await prisma.quizQuestion.findUnique({
    where: { id: questionId },
  });

  if (!question || question.quizId !== quizId) {
    throw new Error(`Question with ID ${questionId} not found in quiz ${quizId}`);
  }

  // Delete choices and matchPairs related to the question
  await prisma.quizChoice.deleteMany({ where: { questionId } });
  await prisma.quizMatchPair.deleteMany({ where: { questionId } });

  // Delete the question itself
  await prisma.quizQuestion.delete({ where: { id: questionId } });

  return true;
};

/**
 * Add a question to a quiz, including choices or matchPairs if provided
 */
exports.addQuestionWithDetails = async (quizId, questionData) => {
  const existingQuiz = await prisma.quiz.findUnique({
    where: { id: quizId },
  });

  if (!existingQuiz) {
    throw new Error(`Quiz with ID ${quizId} not found`);
  }

  // Create the question
  const newQuestion = await prisma.quizQuestion.create({
    data: {
      quizId: quizId,
      type: questionData.type,
      question: questionData.question,
      correctAnswer: questionData.correctAnswer || "",
      order: questionData.order || 0,
    },
  });

  // Add choices if MCQ
  if (questionData.type === "mcq" && Array.isArray(questionData.choices)) {
    for (const choice of questionData.choices) {
      await prisma.quizChoice.create({
        data: {
          questionId: newQuestion.id,
          text: choice.text,
          isCorrect: !!choice.isCorrect,
        },
      });
    }
  }

  // Add matchPairs if match type
  if (questionData.type === "match" && Array.isArray(questionData.matchPairs)) {
    for (const pair of questionData.matchPairs) {
      await prisma.quizMatchPair.create({
        data: {
          questionId: newQuestion.id,
          leftItem: pair.leftItem,
          rightItem: pair.rightItem,
        },
      });
    }
  }

  // Fetch the question with choices/matchPairs
  const fullQuestion = await prisma.quizQuestion.findUnique({
    where: { id: newQuestion.id },
    include: {
      choices: true,
      matchPairs: true,
    },
  });

  return formatQuestion(fullQuestion);
};

/**
 * Get all questions for a quiz
 */
exports.getQuizQuestions = async (quizId) => {
  const questions = await prisma.quizQuestion.findMany({
    where: { quizId },
    include: {
      choices: true,
      matchPairs: true,
    },
    orderBy: { order: "asc" },
  });

  return questions.map(formatQuestion);
};

/**
 * Add question to quiz
 */
exports.addQuestionToQuiz = async (quizId, questionData) => {
  const existingQuiz = await prisma.quiz.findUnique({
    where: { id: quizId },
  });

  if (!existingQuiz) {
    throw new Error(`Quiz with ID ${quizId} not found`);
  }

  const newQuestion = await prisma.quizQuestion.create({
    data: {
      quizId: quizId,
      type: questionData.type,
      question: questionData.question,
      correctAnswer: questionData.correctAnswer || "",
      order: questionData.order || 0,
    },
    include: {
      choices: true,
    },
  });

  return formatQuestion(newQuestion);
};

/**
 * Add choice to question
 */
exports.addChoiceToQuestion = async (questionId, choiceData) => {
  const existingQuestion = await prisma.quizQuestion.findUnique({
    where: { id: questionId },
  });

  if (!existingQuestion) {
    throw new Error(`Question with ID ${questionId} not found`);
  }

  const newChoice = await prisma.quizChoice.create({
    data: {
      questionId: questionId,
      text: choiceData.text,
      isCorrect: choiceData.isCorrect,
    },
  });

  return newChoice;
};

/**
 * Delete a quiz
 */
exports.deleteQuiz = async (id) => {
  const existingQuiz = await prisma.quiz.findUnique({
    where: { id },
  });

  if (!existingQuiz) {
    throw new Error(`Quiz with ID ${id} not found`);
  }

  await prisma.quiz.delete({
    where: { id },
  });

  return true;
};

/**
 * Add or update a quiz attempt for a user
 * If an attempt exists for the user and quiz, update the result; otherwise, create a new attempt.
 */
exports.addOrUpdateQuizAttempt = async (userId, quizId, result) => {
  // Verify user exists
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    throw new Error(`User with ID ${userId} not found`);
  }

  // Verify quiz exists
  const quizExists = await prisma.quiz.findUnique({
    where: { id: quizId },
  });

  if (!quizExists) {
    throw new Error(`Quiz with ID ${quizId} not found`);
  }
  const existingAttempt = await prisma.quizAttempt.findFirst({
    where: {
      userId,
      quizId,
    },
  });

  if (existingAttempt) {
    // Update the existing attempt
    const updatedAttempt = await prisma.quizAttempt.update({
      where: { id: existingAttempt.id },
      data: { result },
    });
    return updatedAttempt;
  } else {
    // Create a new attempt
    const newAttempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        result,
        completedAt: new Date(),
      },
    });
    return newAttempt;
  }
};

/**
 * Get all quiz attempts for a quiz (optionally filtered by user)
 */
exports.getQuizAttempts = async (quizId, userId = null) => {
  const where = { quizId };
  if (userId) where.userId = userId;

  const attempts = await prisma.quizAttempt.findMany({
    where,
    include: {
      user: { select: { id: true, username: true } },
      quiz: { select: { id: true, title: true } },
    },
    orderBy: { completedAt: "desc" },
  });

  return attempts;
};

/**
 * Helper to format quiz
 */
function formatQuiz(quiz) {
  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    user: quiz.user,
    difficulty: quiz.difficulty,
    type: quiz.type,
    questions: quiz.questions.map(formatQuestion),
  };
}

/**
 * Helper to format question
 */
function formatQuestion(question) {
  return {
    id: question.id,
    type: question.type,
    question: question.question,
    order: question.order,
    correctAnswer: question.correctAnswer,
    choices: question.choices || [],
    matchPairs: question.matchPairs || [],
  };
}
