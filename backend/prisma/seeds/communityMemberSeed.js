module.exports = async function seedCommunityMembers(prisma) {
  // Get user IDs
  const users = await prisma.user.findMany({
    select: { id: true },
  });

  // Get community IDs
  const communities = await prisma.community.findMany({
    select: { id: true },
  });

  if (users.length === 0 || communities.length === 0) {
    console.log('No users or communities found, skipping community members seeding');
    return;
  }

  // Create community member data
  const communityMemberData = [];

  // Admin joins all communities as approved
  if (users.length > 0 && communities.length > 0) {
    for (const community of communities) {
      communityMemberData.push({
        userId: users[0].id,
        communityId: community.id,
        status: 'approved'
      });
    }
  }

  // Other users join some communities
  if (users.length > 1 && communities.length > 0) {
    communityMemberData.push({
      userId: users[1].id,
      communityId: communities[0].id,
      status: 'approved'
    });
  }

  if (users.length > 2 && communities.length > 1) {
    communityMemberData.push({
      userId: users[2].id,
      communityId: communities[1].id,
      status: 'pending'
    });
  }

  if (communityMemberData.length > 0) {
    await prisma.communityMember.createMany({
      data: communityMemberData,
      skipDuplicates: true,
    });
  }
};
