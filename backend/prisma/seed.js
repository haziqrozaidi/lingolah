const { PrismaClient } = require("../generated/prisma");
const { faker } = require('@faker-js/faker');

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
    // Quiz 1: MCQ Type
  const mcqQuiz = await prisma.quiz.create({
    data: {
      title: 'Multiple Choice Quiz',
      description: 'Test your knowledge with these multiple choice questions',
      difficulty: 'medium',
      type: 'mcq',
      userId: user.id,
      questions: {
        create: [
          createMcqQuestion(1, [
            { text: 'Correct Answer', isCorrect: true },
            { text: 'Wrong Answer 1', isCorrect: false },
            { text: 'Wrong Answer 2', isCorrect: false },
            { text: 'Wrong Answer 3', isCorrect: false },
          ]),
          createMcqQuestion(2, [
            { text: 'Option A', isCorrect: false },
            { text: 'Option B', isCorrect: true },
            { text: 'Option C', isCorrect: false },
            { text: 'Option D', isCorrect: false },
          ]),
          createMcqQuestion(3, [
            { text: 'Choice 1', isCorrect: false },
            { text: 'Choice 2', isCorrect: true },
            { text: 'Choice 3', isCorrect: false },
          ]),
          createMcqQuestion(4, [
            { text: 'First Option', isCorrect: true },
            { text: 'Second Option', isCorrect: false },
          ]),
          createMcqQuestion(5, [
            { text: 'Yes', isCorrect: true },
            { text: 'No', isCorrect: false },
          ]),
        ],
      },
    },
    include: {
      questions: true,
    },
  });

  // Quiz 2: Match Type
  const matchQuiz = await prisma.quiz.create({
    data: {
      title: 'Matching Quiz',
      description: 'Match the items on the left with their correct pairs on the right',
      difficulty: 'easy',
      type: 'match',
      userId: user.id,
      questions: {
        create: [
          createMatchQuestion(1, [
            { left: 'Capital of France', right: 'Paris' },
            { left: 'Capital of Germany', right: 'Berlin' },
          ]),
          createMatchQuestion(2, [
            { left: 'Author of 1984', right: 'George Orwell' },
            { left: 'Author of Moby Dick', right: 'Herman Melville' },
          ]),
          createMatchQuestion(3, [
            { left: 'Chemical symbol for Gold', right: 'Au' },
            { left: 'Chemical symbol for Silver', right: 'Ag' },
          ]),
          createMatchQuestion(4, [
            { left: 'Planet closest to the Sun', right: 'Mercury' },
            { left: 'Largest planet', right: 'Jupiter' },
          ]),
          createMatchQuestion(5, [
            { left: 'Programming language for web', right: 'JavaScript' },
            { left: 'Language for data analysis', right: 'Python' },
          ]),
        ],
      },
    },
    include: {
      questions: true,
    },
  });

  // Quiz 3: Open Type
  const openQuiz = await prisma.quiz.create({
    data: {
      title: 'Open-Ended Quiz',
      description: 'Answer these questions in your own words',
      difficulty: 'hard',
      type: 'term',
      userId: user.id,
      questions: {
        create: [
          createOpenQuestion(1, 'What is the capital of Australia?', 'Canberra'),
          createOpenQuestion(2, 'Explain the theory of relativity in simple terms', 'A theory explaining gravity as the curvature of spacetime'),
          createOpenQuestion(3, 'Who painted the Mona Lisa?', 'Leonardo da Vinci'),
          createOpenQuestion(4, 'What is the largest organ in the human body?', 'Skin'),
          createOpenQuestion(5, 'What year did World War II end?', '1945'),
        ],
      },
    },
    include: {
      questions: true,
    },
  });

  console.log('Created 3 quizzes:');
  console.log(`- MCQ Quiz: ${mcqQuiz.id} with ${mcqQuiz.questions.length} questions`);
  console.log(`- Match Quiz: ${matchQuiz.id} with ${matchQuiz.questions.length} questions`);
  console.log(`- Open Quiz: ${openQuiz.id} with ${openQuiz.questions.length} questions`);

  // Helper functions to create different question types
  function createMcqQuestion(order, choices) {
    return {
      type: "mcq",
      question: faker.lorem.words(3).replace(".", "?"),
      order,
      choices: {
        create: choices,
      },
    };
  }

  function createMatchQuestion(order, pairs) {
    return {
      type: "match",
      question: `Match the following items (Question ${order})`,
      order,
      matchPairs: {
        create: pairs.map((pair, idx) => ({
          leftItem: pair.left,
          rightItem: pair.right,
        })),
      },
    };
  }

  function createOpenQuestion(order, question, correctAnswer) {
    return {
      type: "term",
      question,
      correctAnswer,
      order,
    };
  }

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
