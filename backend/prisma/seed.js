const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
await prisma.video.createMany({
    data: [

        {
            title: 'At the Airport',
            url: 'https://placehold.co/320x180/10b981/ffffff?text=Airport',
            description: 'Useful phrases for navigating the airport.',
            topic: 'Travel',
            subtitles: '',
        },
        {
            title: 'Booking a Hotel',
            url: 'https://placehold.co/320x180/f59e42/ffffff?text=Hotel',
            description: 'How to book a hotel room and ask for amenities.',
            topic: 'Travel',
            subtitles: '',
        },
        {
            title: 'Asking for Directions',
            url: 'https://placehold.co/320x180/6366f1/ffffff?text=Directions',
            description: 'Phrases to ask and understand directions.',
            topic: 'Travel',
            subtitles: '',
        },
        {
            title: 'Ordering Food Abroad',
            url: 'https://placehold.co/320x180/ef4444/ffffff?text=Food',
            description: 'How to order food and drinks in a foreign country.',
            topic: 'Travel',
            subtitles: '',
        }
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