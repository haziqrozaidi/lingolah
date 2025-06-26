module.exports = async function seedVideoPlaylists(prisma) {
  // Get user IDs
  const users = await prisma.user.findMany({
    select: { id: true },
  });

  if (users.length === 0) {
    console.log('No users found, skipping video playlists seeding');
    return;
  }

  const videoPlaylistData = [
    {
      userId: users[0].id,
      title: 'Beginner Malay Lessons',
    },
    {
      userId: users[1].id,
      title: 'Travel Phrases',
    },
  ];

  await prisma.videoPlaylist.createMany({
    data: videoPlaylistData,
    skipDuplicates: true,
  });
};
