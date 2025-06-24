const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      username: "testuser",
      email: "testuser@example.com",
      role: "member",
    },
  });

  // Create a category
  const category = await prisma.category.create({
    data: {
      description: "Science",
    },
  });

  // Create a flashcard set
  const flashcardSet = await prisma.flashcardSet.create({
    data: {
      title: "Biology Basics",
      description: "Intro to biology terms",
      userId: user.id,
      categoryId: category.id,
    },
  });

  // Add flashcards
  await prisma.flashcard.createMany({
    data: [
      {
        setId: flashcardSet.id,
        frontText: "Cell",
        backText: "Basic unit of life",
        difficulty: "easy",
      },
      {
        setId: flashcardSet.id,
        frontText: "DNA",
        backText: "Genetic material",
        difficulty: "medium",
      },
    ],
  });

  const quizzes = [
    {
      title: "Basic Greetings",
      description: "Learn common Malay greetings",
      difficulty: "easy",
      type: "term",
    },
    {
      title: "Numbers 1-10",
      description: "Match numbers to their Malay words",
      difficulty: "easy",
      type: "match",
    },
    {
      title: "Family Members",
      description: "Identify family terms in Malay",
      difficulty: "easy",
      type: "mcq",
    },
    {
      title: "Common Objects",
      description: "Basic everyday items vocabulary",
      difficulty: "easy",
      type: "term",
    },
    {
      title: "Food & Drinks",
      description: "Malay food vocabulary",
      difficulty: "medium",
      type: "match",
    },
    {
      title: "Verb Conjugation",
      description: "Practice common verb forms",
      difficulty: "medium",
      type: "mcq",
    },
    {
      title: "Time & Dates",
      description: "Telling time and dates in Malay",
      difficulty: "medium",
      type: "term",
    },
    {
      title: "Shopping Phrases",
      description: "Essential market vocabulary",
      difficulty: "medium",
      type: "term",
    },
    {
      title: "Idioms & Proverbs",
      description: "Malay sayings and expressions",
      difficulty: "hard",
      type: "mcq",
    },
    {
      title: "Sentence Formation",
      description: "Build proper Malay sentences",
      difficulty: "hard",
      type: "term",
    },
    {
      title: "Dialect Comparison",
      description: "Compare standard Malay with regional dialects",
      difficulty: "hard",
      type: "match",
    },
    {
      title: "Listening Comprehension",
      description: "Audio-based questions",
      difficulty: "hard",
      type: "mcq",
    },
  ];

  for (const quizData of quizzes) {
    const questionCount = Math.floor(Math.random() * 7) + 4; // 4-10 questions
    console.log(`  → ${quizData.title} (${questionCount} questions)`);

    const createdQuiz = await prisma.quiz.create({
      data: {
        title: quizData.title,
        description: quizData.description,
        difficulty: quizData.difficulty,
        userId: user.id,
        type: quizData.type,
        questions: {
          create: Array.from({ length: questionCount }, (_, index) => {
            const questionText = `Sample question ${index + 1} for ${
              quizData.title
            }`;
            const order = index + 1;

            if (quizData.type === "mcq") {
              return {
                question: questionText,
                type: "mcq",
                order,
                choices: {
                  create: [
                    { text: `Choice A${order}`, isCorrect: false },
                    { text: `Choice B${order}`, isCorrect: true },
                    { text: `Choice C${order}`, isCorrect: false },
                    { text: `Choice D${order}`, isCorrect: false },
                  ],
                },
              };
            } else if (quizData.type === "match") {
              return {
                question: questionText,
                type: "match",
                order,
                choices: {
                  create: [
                    { text: `Pair A${order}`, isCorrect: true },
                    { text: `Pair B${order}`, isCorrect: true },
                    { text: `Pair C${order}`, isCorrect: true },
                  ],
                },
              };
            } else {
              // 'term' type
              return {
                question: questionText,
                type: "term",
                order,
                choices: { create: [] }, // term questions don't have choices
              };
            }
          }),
        },
      },
    });

    console.log(`    ✓ Created quiz: ${createdQuiz.title}`);
  }

  console.log("Seeding completed!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
