module.exports = async function seedCategories(prisma) {
  const categoryData = [
    { description: 'Vocabulary' },
    { description: 'Grammar' },
    { description: 'Pronunciation' },
    { description: 'Reading' },
    { description: 'Common Phrases' },
    { description: 'Beginner' },
    { description: 'Intermediate' },
    { description: 'Advanced' },
  ];

  await prisma.category.createMany({
    data: categoryData,
    skipDuplicates: true,
  });
};
