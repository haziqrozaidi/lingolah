const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.video.createMany({
    data: [
      {
        title: 'Ordering Food at a Restaurant',
        url: 'https://placehold.co/320x180/3b82f6/ffffff?text=Restaurant',
        description: 'Learn how to order food in Malay.',
        topic: 'Daily Conversations',
        subtitles: '',
      },
      {
        title: 'Asking for Directions',
        url: 'https://placehold.co/320x180/3b82f6/ffffff?text=Directions',
        description: 'How to ask for directions.',
        topic: 'Daily Conversations',
        subtitles: '',
      },
 
    ]
  });
}

main()
  .then(() => {
    console.log('Seeding done');
    prisma.$disconnect();
  })
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });