module.exports = async function seedFlashcardSets(prisma) {
  // Get user IDs
  const users = await prisma.user.findMany({
    select: { id: true },
  });

  // Get category IDs
  const categories = await prisma.category.findMany({
    select: { id: true },
  });

  if (users.length === 0 || categories.length === 0) {
    console.log('No users or categories found, skipping flashcard sets seeding');
    return;
  }

  const flashcardSetData = [
    {
      userId: users[0].id,
      title: 'Basic Malay Greetings',
      description: 'Essential greetings and introductions in Malay',
      categoryId: categories[0].id,
    },
    {
      userId: users[0].id,
      title: 'Common Malay Phrases',
      description: 'Useful everyday phrases for beginners',
      categoryId: categories[4].id,
    },
    {
      userId: users[1].id,
      title: 'Malay Grammar Basics',
      description: 'Fundamental grammar rules in Malay',
      categoryId: categories[1].id,
    },
  ];

  await prisma.flashcardSet.createMany({
    data: flashcardSetData,
    skipDuplicates: true,
  });
};
