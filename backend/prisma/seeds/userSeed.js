module.exports = async function seedUsers(prisma) {
  // First, check if the specific users already exist to avoid duplicates
  const existingAdmin = await prisma.user.findUnique({
    where: { id: 'cmcauko2g0000uj143dqz620o' },
  });

  const existingLearner = await prisma.user.findUnique({
    where: { id: 'cmcd1nnvt0000uja19qb0cshw' },
  });

  // Create data array for the specific user records
  const userData = [];

  // Add admin user if it doesn't exist
  if (!existingAdmin) {
    userData.push({
      id: 'cmcauko2g0000uj143dqz620o',
      clerkUserId: 'user_2yxv1rKHNjeYc5n4qmGfk9qeOwr',
      username: 'admin',
      email: 'admin@gmail.com',
      role: 'admin',
      createdAt: new Date('2025-06-24 18:16:52.695')
    });
  }

  // Add learner user if it doesn't exist
  if (!existingLearner) {
    userData.push({
      id: 'cmcd1nnvt0000uja19qb0cshw',
      clerkUserId: 'user_2yxvS7hV6LtMAJcqSNBnCG9E8bR',
      username: 'learner',
      email: 'learner@gmail.com',
      role: 'member',
      createdAt: new Date('2025-06-26 07:10:42.089')
    });
  }

  // Add some additional sample users
  userData.push(
    {
      username: 'teacher1',
      email: 'teacher1@example.com',
      role: 'teacher',
    },
    {
      username: 'student1',
      email: 'student1@example.com',
      role: 'member',
    },
    {
      username: 'student2',
      email: 'student2@example.com',
      role: 'member',
    }
  );

  // Create all users in database
  if (userData.length > 0) {
    await prisma.user.createMany({
      data: userData,
      skipDuplicates: true,
    });
  }
};
