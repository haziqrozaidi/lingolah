const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

async function main() {
  console.log("Starting to seed the database...");

  // Create Users - using the exact provided data
  const admin = await prisma.user.upsert({
    where: { id: "cmcauko2g0000uj143dqz620o" },
    update: {},
    create: {
      id: "cmcauko2g0000uj143dqz620o",
      clerkUserId: "user_2yxv1rKHNjeYc5n4qmGfk9qeOwr",
      username: "admin",
      email: "admin@gmail.com",
      role: "admin",
      createdAt: new Date("2025-06-24T18:16:52.695Z"),
    },
  });

  const learner = await prisma.user.upsert({
    where: { id: "cmcaulkpn0001uj1461x1kp9w" },
    update: {},
    create: {
      id: "cmcaulkpn0001uj1461x1kp9w",
      clerkUserId: "user_2yxvS7hV6LtMAJcqSNBnCG9E8bR",
      username: "learner",
      email: "learner@gmail.com",
      role: "member",
      createdAt: new Date("2025-06-24T18:17:35.004Z"),
    },
  });

  console.log("Users created:", { admin, learner });

  // Create Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: "cat001" },
      update: {},
      create: {
        id: "cat001",
        description: "Basic Vocabulary",
      },
    }),
    prisma.category.upsert({
      where: { id: "cat002" },
      update: {},
      create: {
        id: "cat002",
        description: "Daily Conversations",
      },
    }),
    prisma.category.upsert({
      where: { id: "cat003" },
      update: {},
      create: {
        id: "cat003",
        description: "Grammar",
      },
    }),
    prisma.category.upsert({
      where: { id: "cat004" },
      update: {},
      create: {
        id: "cat004",
        description: "Cultural Phrases",
      },
    }),
  ]);

  console.log("Categories created:", categories);

  // Create FlashcardSets
  const flashcardSets = await Promise.all([
    prisma.flashcardSet.create({
      data: {
        title: "Basic Malay Greetings",
        description: "Learn common Malay greetings and introductions",
        userId: admin.id,
        categoryId: "cat001",
        flashcards: {
          create: [
            {
              frontText: "Hello",
              backText: "Helo / Hai",
              difficulty: "Easy",
            },
            {
              frontText: "Good morning",
              backText: "Selamat pagi",
              difficulty: "Easy",
            },
            {
              frontText: "Good afternoon",
              backText: "Selamat tengah hari",
              difficulty: "Easy",
            },
            {
              frontText: "Good evening",
              backText: "Selamat petang",
              difficulty: "Easy",
            },
            {
              frontText: "Good night",
              backText: "Selamat malam",
              difficulty: "Easy",
            },
          ],
        },
      },
    }),
    prisma.flashcardSet.create({
      data: {
        title: "Common Malay Phrases",
        description: "Everyday useful expressions in Malay language",
        userId: admin.id,
        categoryId: "cat002",
        flashcards: {
          create: [
            {
              frontText: "How are you?",
              backText: "Apa khabar?",
              difficulty: "Easy",
            },
            {
              frontText: "My name is...",
              backText: "Nama saya ialah...",
              difficulty: "Easy",
            },
            {
              frontText: "Nice to meet you",
              backText: "Selamat berkenalan",
              difficulty: "Medium",
            },
            {
              frontText: "Thank you",
              backText: "Terima kasih",
              difficulty: "Easy",
            },
            {
              frontText: "You're welcome",
              backText: "Sama-sama",
              difficulty: "Easy",
            },
          ],
        },
      },
    }),
    prisma.flashcardSet.create({
      data: {
        title: "Malay Numbers",
        description: "Learn how to count in Malay",
        userId: learner.id,
        categoryId: "cat001",
        flashcards: {
          create: [
            {
              frontText: "One",
              backText: "Satu",
              difficulty: "Easy",
            },
            {
              frontText: "Two",
              backText: "Dua",
              difficulty: "Easy",
            },
            {
              frontText: "Three",
              backText: "Tiga",
              difficulty: "Easy",
            },
            {
              frontText: "Four",
              backText: "Empat",
              difficulty: "Easy",
            },
            {
              frontText: "Five",
              backText: "Lima",
              difficulty: "Easy",
            },
          ],
        },
      },
    }),
    prisma.flashcardSet.create({
      data: {
        title: "Basic Malay Grammar",
        description: "Essential grammar rules in Malay language",
        userId: admin.id,
        categoryId: "cat003",
        flashcards: {
          create: [
            {
              frontText: "I am",
              backText: "Saya adalah",
              difficulty: "Medium",
            },
            {
              frontText: "You are",
              backText: "Kamu adalah",
              difficulty: "Medium",
            },
            {
              frontText: "He/She is",
              backText: "Dia adalah",
              difficulty: "Medium",
            },
            {
              frontText: "We are",
              backText: "Kami adalah",
              difficulty: "Medium",
            },
            {
              frontText: "They are",
              backText: "Mereka adalah",
              difficulty: "Medium",
            },
          ],
        },
      },
    }),
    prisma.flashcardSet.create({
      data: {
        title: "Malaysian Cultural Expressions",
        description: "Unique cultural phrases and expressions from Malaysia",
        userId: admin.id,
        categoryId: "cat004",
        flashcards: {
          create: [
            {
              frontText: "Welcome (to my home)",
              backText: "Selamat datang (ke rumah saya)",
              difficulty: "Medium",
            },
            {
              frontText: "Happy Eid",
              backText: "Selamat Hari Raya",
              difficulty: "Medium",
            },
            {
              frontText: "Happy New Year",
              backText: "Selamat Tahun Baru",
              difficulty: "Easy",
            },
            {
              frontText: "I'm sorry",
              backText: "Saya minta maaf",
              difficulty: "Medium",
            },
            {
              frontText: "Excuse me",
              backText: "Maafkan saya",
              difficulty: "Medium",
            },
          ],
        },
      },
    }),
  ]);

  console.log("Flashcard sets created:", flashcardSets);

  // Create Community
  const community = await prisma.community.create({
    data: {
      name: "Malay Language Enthusiasts",
      establishedDate: new Date("2025-01-01T00:00:00.000Z"),
      establishedBy: admin.id,
      memberCount: 2,
      members: {
        create: [
          {
            userId: admin.id,
            status: "approved",
          },
          {
            userId: learner.id,
            status: "approved",
          },
        ],
      },
    },
  });

  console.log("Community created:", community);

  // Create Posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: "Welcome to Lingolah!",
        content:
          "Welcome to our Malay language learning platform. Feel free to introduce yourself in the comments!",
        category: "Announcement",
        viewCount: 25,
        date: new Date("2025-06-20T10:00:00.000Z"),
        userId: admin.id,
        communityId: community.id,
      },
    }),
    prisma.post.create({
      data: {
        title: "Malay Pronunciation Tips",
        content:
          'In Malay, the letter "c" is pronounced as "ch" like in "chair". The letter "e" can be pronounced as the "e" in "pen" or the "a" in "about".',
        category: "Learning",
        viewCount: 15,
        date: new Date("2025-06-21T14:30:00.000Z"),
        userId: admin.id,
        communityId: community.id,
        comments: {
          create: {
            content: "This is really helpful! Thanks for sharing.",
            userId: learner.id,
          },
        },
      },
    }),
    prisma.post.create({
      data: {
        title: "My Learning Journey",
        content:
          "I just started learning Malay and I'm loving it! The vocabulary is easier than I expected.",
        category: "Discussion",
        viewCount: 10,
        date: new Date("2025-06-22T09:15:00.000Z"),
        userId: learner.id,
        communityId: community.id,
        likes: {
          create: {
            userId: admin.id,
          },
        },
      },
    }),
  ]);

  console.log("Posts created:", posts);

  // Create Videos
  const videos = await Promise.all([
    prisma.video.create({
      data: {
        title: "Nasi lemak",
        url: "https://www.youtube.com/watch?v=RLUGJFuvvDc",
        description: "Learn how to cook Nasi lemak, a popular Malaysian dish.",
        topic: "Food",
        subtitles: "",
      },
    }),
    prisma.video.create({
      data: {
        title: "Tioman Island",
        url: "https://www.youtube.com/watch?v=4tXmFMo03QA",
        description:
          "Explore the beauty of Tioman Island, a tropical paradise in Malaysia.",
        topic: "Travel",
        subtitles: "",
      },
    }),
  ]);

  console.log("Videos created:", videos);

  // Create Video Playlist for admin
  const playlist = await prisma.videoPlaylist.create({
    data: {
      userId: admin.id,
      title: "Beginner Malay Course",
      videos: {
        create: [{ videoId: videos[0].id }, { videoId: videos[1].id }],
      },
    },
  });

  console.log("Video playlist created:", playlist);

  // Create Progress records
  // Get some flashcards to create progress for
  const flashcards = await prisma.flashcard.findMany({
    take: 5,
  });

  const progressRecords = await Promise.all(
    flashcards.map((card) =>
      prisma.progress.create({
        data: {
          cardId: card.id,
          userId: learner.id,
          lastReview: new Date("2025-06-20T18:00:00.000Z"),
          nextReview: new Date("2025-06-25T18:00:00.000Z"),
        },
      })
    )
  );

  console.log("Progress records created:", progressRecords);

  // Create Video Progress
  const videoProgress = await prisma.videoProgress.create({
    data: {
      userId: learner.id,
      videoId: videos[0].id,
      watchDate: new Date("2025-06-22T20:15:00.000Z"),
    },
  });

  console.log("Video progress created:", videoProgress);

  // Create a Report
  const report = await prisma.report.create({
    data: {
      postId: posts[2].id,
      reporterId: admin.id,
      reason: "Test Report",
      details: "This is just a test report to populate the database",
      dateReported: new Date("2025-06-23T08:30:00.000Z"),
    },
  });

  console.log("Report created:", report);

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
