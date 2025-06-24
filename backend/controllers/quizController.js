const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

/**
 * Get all quizzes
 */
exports.getAllQuizzes = async () => {
  const quizzes = await prisma.quiz.findMany({
    include: {
      user: {
        select: { id: true, username: true }
      },
      questions: {
        include: { choices: true }
      }
    },
    orderBy: { id: 'asc' }
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
        select: { id: true, username: true }
      },
      questions: {
        include: { choices: true }
      }
    }
  });

  if (!quiz) return null;

  return formatQuiz(quiz);
};

/**
 * Create a new quiz
 */
exports.createQuiz = async (quizData) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: quizData.userId }
  });

  if (!existingUser) {
    throw new Error(`User with ID ${quizData.userId} not found`);
  }

  const newQuiz = await prisma.quiz.create({
    data: {
      title: quizData.title,
      description: quizData.description || '',
      userId: quizData.userId,
      difficulty: quizData.difficulty,
      type: quizData.type

    },
    include: {
      user: {
        select: { id: true, username: true }
      },
      questions: true
    }
  });

  return formatQuiz(newQuiz);
};

/**
 * Add question to quiz
 */
exports.addQuestionToQuiz = async (quizId, questionData) => {
  const existingQuiz = await prisma.quiz.findUnique({
    where: { id: quizId }
  });

  if (!existingQuiz) {
    throw new Error(`Quiz with ID ${quizId} not found`);
  }

  const newQuestion = await prisma.quizQuestion.create({
    data: {
      quizId: quizId,
      type: questionData.type,
      question: questionData.question,
      order: questionData.order || 0
    },
    include: {
      choices: true
    }
  });

  return formatQuestion(newQuestion);
};

/**
 * Add choice to question
 */
exports.addChoiceToQuestion = async (questionId, choiceData) => {
  const existingQuestion = await prisma.quizQuestion.findUnique({
    where: { id: questionId }
  });

  if (!existingQuestion) {
    throw new Error(`Question with ID ${questionId} not found`);
  }

  const newChoice = await prisma.quizChoice.create({
    data: {
      questionId: questionId,
      text: choiceData.text,
      isCorrect: choiceData.isCorrect
    }
  });

  return newChoice;
};

/**
 * Delete a quiz
 */
exports.deleteQuiz = async (id) => {
  const existingQuiz = await prisma.quiz.findUnique({
    where: { id }
  });

  if (!existingQuiz) {
    throw new Error(`Quiz with ID ${id} not found`);
  }

  await prisma.quiz.delete({
    where: { id }
  });

  return true;
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
    questions: quiz.questions.map(formatQuestion)
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
    choices: question.choices || []
  };
}
