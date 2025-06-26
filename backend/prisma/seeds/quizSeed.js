module.exports = async function seedQuizzes(prisma) {
  // Get user IDs
  const users = await prisma.user.findMany({
    select: { id: true },
  });

  if (users.length === 0) {
    console.log('No users found, skipping quizzes seeding');
    return;
  }

  const quizData = [
    {
      userId: users[0].id,
      title: 'Malay Basics Quiz',
      description: 'Test your knowledge of basic Malay vocabulary and phrases',
      difficulty: 'beginner',
      type: 'mixed',
    },
    {
      userId: users[0].id,
      title: 'Malay Grammar Challenge',
      description: 'Advanced quiz on Malay grammar rules and sentence structure',
      difficulty: 'intermediate',
      type: 'grammar',
    },
  ];

  await prisma.quiz.createMany({
    data: quizData,
    skipDuplicates: true,
  });
};
