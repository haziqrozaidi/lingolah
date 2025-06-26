const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

// Import seed functions
const seedUsers = require('./seeds/userSeed');
const seedCategories = require('./seeds/categorySeed');
const seedCommunities = require('./seeds/communitySeed');
const seedCommunityMembers = require('./seeds/communityMemberSeed');
const seedFlashcardSets = require('./seeds/flashcardSetSeed');
const seedFlashcards = require('./seeds/flashcardSeed');
const seedVideos = require('./seeds/videoSeed');
const seedVideoPlaylists = require('./seeds/videoPlaylistSeed');
const seedVideoPlaylistItems = require('./seeds/videoPlaylistItemsSeed');
const seedPosts = require('./seeds/postSeed');
const seedQuizzes = require('./seeds/quizSeed');
const seedQuizQuestions = require('./seeds/quizQuestionSeed');
const seedQuizChoices = require('./seeds/quizChoiceSeed');
const seedQuizMatchPairs = require('./seeds/quizMatchPairSeed');

async function main() {
  console.log('Starting database seeding...');

  try {
    // Seed data in order of dependencies
    await seedUsers(prisma); // First, seed users
    console.log('✅ Users seeded successfully');

    await seedCategories(prisma); // Seed categories before flashcard sets
    console.log('✅ Categories seeded successfully');
    
    await seedCommunities(prisma); // Seed communities before community members
    console.log('✅ Communities seeded successfully');
    
    await seedCommunityMembers(prisma); // Requires users and communities
    console.log('✅ Community members seeded successfully');
    
    await seedFlashcardSets(prisma); // Requires users and categories
    console.log('✅ Flashcard sets seeded successfully');
    
    await seedFlashcards(prisma); // Requires flashcard sets
    console.log('✅ Flashcards seeded successfully');
    
    await seedVideos(prisma); // Seed videos before progress/playlists
    console.log('✅ Videos seeded successfully');
    
    await seedVideoPlaylists(prisma); // Requires users
    console.log('✅ Video playlists seeded successfully');
    
    await seedVideoPlaylistItems(prisma); // Requires playlists and videos
    console.log('✅ Video playlist items seeded successfully');
    
    await seedPosts(prisma); // Requires users and communities
    console.log('✅ Posts seeded successfully');
    
    await seedQuizzes(prisma); // Requires users
    console.log('✅ Quizzes seeded successfully');
    
    await seedQuizQuestions(prisma); // Requires quizzes
    console.log('✅ Quiz questions seeded successfully');
    
    await seedQuizChoices(prisma); // Requires quiz questions
    console.log('✅ Quiz choices seeded successfully');
    
    await seedQuizMatchPairs(prisma); // Requires quiz questions
    console.log('✅ Quiz match pairs seeded successfully');
    
    console.log('✅ All data seeded successfully!');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
