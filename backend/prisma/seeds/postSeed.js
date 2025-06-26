module.exports = async function seedPosts(prisma) {
  // Get user IDs
  const users = await prisma.user.findMany({
    select: { id: true },
  });

  // Get community IDs
  const communities = await prisma.community.findMany({
    select: { id: true },
  });

  if (users.length === 0) {
    console.log('No users found, skipping posts seeding');
    return;
  }

  const postData = [
    {
      title: 'Learning Malay: My Journey',
      content: 'I started learning Malay a month ago and here are some tips that helped me...',
      category: 'Experience',
      viewCount: 45,
      date: new Date('2025-05-15'),
      userId: users[0].id,
      communityId: communities[0]?.id,
    },
    {
      title: 'Best Resources for Malay Grammar',
      content: 'After trying many different books and websites, I recommend these resources...',
      category: 'Resources',
      viewCount: 78,
      date: new Date('2025-06-01'),
      userId: users[1].id,
      communityId: communities[1]?.id,
    },
    {
      title: 'Understanding Malay Sentence Structure',
      content: 'The basic Malay sentence follows Subject-Verb-Object structure...',
      category: 'Grammar',
      viewCount: 105,
      date: new Date('2025-06-10'),
      userId: users[0].id,
      communityId: communities[2]?.id,
    },
  ];

  await prisma.post.createMany({
    data: postData,
    skipDuplicates: true,
  });
};
