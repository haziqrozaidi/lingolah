module.exports = async function seedQuizMatchPairs(prisma) {
  // Get match questions
  const matchQuestions = await prisma.quizQuestion.findMany({
    where: { type: 'match' },
    select: { id: true, question: true },
  });

  if (matchQuestions.length === 0) {
    console.log('No match questions found, skipping quiz match pairs seeding');
    return;
  }

  const pairsData = [];

  // For "Match the Malay greetings with their English translations"
  const greetingsQuestion = matchQuestions.find(q => q.question.includes('Malay greetings'));
  if (greetingsQuestion) {
    pairsData.push(
      {
        questionId: greetingsQuestion.id,
        leftItem: 'Selamat pagi',
        rightItem: 'Good morning',
      },
      {
        questionId: greetingsQuestion.id,
        leftItem: 'Selamat petang',
        rightItem: 'Good evening',
      },
      {
        questionId: greetingsQuestion.id,
        leftItem: 'Selamat malam',
        rightItem: 'Good night',
      },
      {
        questionId: greetingsQuestion.id,
        leftItem: 'Apa khabar',
        rightItem: 'How are you',
      }
    );
  }

  if (pairsData.length > 0) {
    await prisma.quizMatchPair.createMany({
      data: pairsData,
      skipDuplicates: true,
    });
  }
};
