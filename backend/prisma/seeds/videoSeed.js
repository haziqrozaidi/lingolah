module.exports = async function seedVideos(prisma) {
  const videoData = [
    {
      title: 'Introduction to Malay Language',
      url: 'https://example.com/videos/intro-to-malay',
      description: 'A beginner-friendly introduction to the Malay language',
      topic: 'Beginner',
      subtitles: '{"en": "path/to/subtitles-en.vtt", "ms": "path/to/subtitles-ms.vtt"}',
    },
    {
      title: 'Common Malay Phrases for Travelers',
      url: 'https://example.com/videos/malay-for-travelers',
      description: 'Learn essential phrases for traveling in Malaysia',
      topic: 'Phrases',
      subtitles: '{"en": "path/to/traveler-en.vtt", "ms": "path/to/traveler-ms.vtt"}',
    },
    {
      title: 'Malay Grammar Fundamentals',
      url: 'https://example.com/videos/malay-grammar',
      description: 'Learn basic grammar rules in Malay',
      topic: 'Grammar',
      subtitles: '{"en": "path/to/grammar-en.vtt", "ms": "path/to/grammar-ms.vtt"}',
    },
  ];

  await prisma.video.createMany({
    data: videoData,
    skipDuplicates: true,
  });
};
