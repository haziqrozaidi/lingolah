module.exports = async function seedQuizQuestions(prisma) {
  // Get quiz IDs
  const quizzes = await prisma.quiz.findMany({
    select: { id: true, title: true },
  });

  if (quizzes.length === 0) {
    console.log('No quizzes found, skipping quiz questions seeding');
    return;
  }

  const basicsQuizId = quizzes.find(quiz => quiz.title === 'Malay Basics Quiz')?.id;
  const grammarQuizId = quizzes.find(quiz => quiz.title === 'Malay Grammar Challenge')?.id;

  const questionData = [];
  
  // Questions for basics quiz
  if (basicsQuizId) {
    questionData.push(
      {
        quizId: basicsQuizId,
        type: 'mcq',
        question: 'How do you say "Hello" in Malay?',
        order: 1,
      },
      {
        quizId: basicsQuizId,
        type: 'match',
        question: 'Match the Malay greetings with their English translations',
        order: 2,
      },
      {
        quizId: basicsQuizId,
        type: 'open',
        question: 'What is the Malay word for "Thank you"?',
        correctAnswer: 'Terima kasih',
        order: 3,
      }
    );
  }

  // Questions for grammar quiz
  if (grammarQuizId) {
    questionData.push(
      {
        quizId: grammarQuizId,
        type: 'mcq',
        question: 'Which of these is the correct way to form a plural in Malay?',
        order: 1,
      },
      {
        quizId: grammarQuizId,
        type: 'open',
        question: 'Explain how to form a negative sentence in Malay',
        correctAnswer: 'Use the word "tidak" before the verb',
        order: 2,
      }
    );
  }

  if (questionData.length > 0) {
    await prisma.quizQuestion.createMany({
      data: questionData,
      skipDuplicates: true,
    });
  }
};
