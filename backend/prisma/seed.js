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
        {
            title: 'Introducing Yourself',
            url: 'https://placehold.co/320x180/3b82f6/ffffff?text=Introduction',
            description: 'Learn how to introduce yourself in Malay.',
            topic: 'Daily Conversations',
            subtitles: '',
        },
        {
            title: 'Shopping at the Market',
            url: 'https://placehold.co/320x180/3b82f6/ffffff?text=Market',
            description: 'Useful phrases for shopping at a market.',
            topic: 'Daily Conversations',
            subtitles: '',
        },
        {
            title: 'Booking a Hotel Room',
            url: 'https://placehold.co/320x180/3b82f6/ffffff?text=Hotel',
            description: 'How to book a hotel room in Malay.',
            topic: 'Travel',
            subtitles: '',
        },
        {
            title: 'Talking About the Weather',
            url: 'https://placehold.co/320x180/3b82f6/ffffff?text=Weather',
            description: 'Discussing the weather in Malay.',
            topic: 'Daily Conversations',
            subtitles: '',
        },
        {
            title: 'Making an Appointment',
            url: 'https://placehold.co/320x180/3b82f6/ffffff?text=Appointment',
            description: 'How to make an appointment.',
            topic: 'Daily Conversations',
            subtitles: '',
        },
        {
            title: 'Emergency Situations',
            url: 'https://placehold.co/320x180/3b82f6/ffffff?text=Emergency',
            description: 'What to say in emergencies.',
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