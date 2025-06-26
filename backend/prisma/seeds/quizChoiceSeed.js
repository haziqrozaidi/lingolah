module.exports = async function seedQuizChoices(prisma) {
  // Get MCQ questions
  const mcqQuestions = await prisma.quizQuestion.findMany({
    where: { type: 'mcq' },
    select: { id: true, question: true },
  });

  if (mcqQuestions.length === 0) {
    console.log('No MCQ questions found, skipping quiz choices seeding');
    return;
  }

  const choicesData = [];

  // For "How do you say 'Hello' in Malay?"
  const helloQuestion = mcqQuestions.find(q => q.question.includes('Hello'));
  if (helloQuestion) {
    choicesData.push(
      {
        questionId: helloQuestion.id,
        text: 'Helo / Hai',
        isCorrect: true,
      },
      {
        questionId: helloQuestion.id,
        text: 'Selamat',
        isCorrect: false,
      },
      {
        questionId: helloQuestion.id,
        text: 'Terima kasih',
        isCorrect: false,
      },
      {
        questionId: helloQuestion.id,
        text: 'Apa khabar',
        isCorrect: false,
      }
    );
  }

  // For "Which of these is the correct way to form a plural in Malay?"
  const pluralQuestion = mcqQuestions.find(q => q.question.includes('plural'));
  if (pluralQuestion) {
    choicesData.push(
      {
        questionId: pluralQuestion.id,
        text: 'Add "banyak" before the noun',
        isCorrect: true,
      },
      {
        questionId: pluralQuestion.id,
        text: 'Add "-s" to the end of the noun',
        isCorrect: false,
      },
      {
        questionId: pluralQuestion.id,
        text: 'Duplicate the noun (e.g., buku-buku for books)',
        isCorrect: true, // Duplication is also correct
      },
      {
        questionId: pluralQuestion.id,
        text: 'Add "lebih" before the noun',
        isCorrect: false,
      }
    );
  }

  if (choicesData.length > 0) {
    await prisma.quizChoice.createMany({
      data: choicesData,
      skipDuplicates: true,
    });
  }
};
