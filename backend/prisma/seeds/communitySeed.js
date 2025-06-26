module.exports = async function seedCommunities(prisma) {
  // Get admin user ID for establishing communities
  const adminUser = await prisma.user.findUnique({
    where: { username: 'admin' },
    select: { id: true },
  });
  
  const establishedBy = adminUser?.id || 'cmcauko2g0000uj143dqz620o';
  
  const communityData = [
    {
      name: 'Malay Beginners',
      establishedDate: new Date('2025-01-15'),
      establishedBy,
      memberCount: 1
    },
    {
      name: 'Intermediate Learners',
      establishedDate: new Date('2025-02-20'),
      establishedBy,
      memberCount: 1
    },
    {
      name: 'Advanced Speakers',
      establishedDate: new Date('2025-03-10'),
      establishedBy,
      memberCount: 1
    },
  ];

  await prisma.community.createMany({
    data: communityData,
    skipDuplicates: true,
  });
};
