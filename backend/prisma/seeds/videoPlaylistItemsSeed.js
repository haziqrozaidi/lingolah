module.exports = async function seedVideoPlaylistItems(prisma) {
  // Get playlist IDs
  const playlists = await prisma.videoPlaylist.findMany({
    select: { id: true, title: true },
  });

  // Get video IDs
  const videos = await prisma.video.findMany({
    select: { id: true, title: true },
  });

  if (playlists.length === 0 || videos.length === 0) {
    console.log('No playlists or videos found, skipping playlist items seeding');
    return;
  }

  const beginnerPlaylistId = playlists.find(playlist => playlist.title === 'Beginner Malay Lessons')?.id;
  const travelPlaylistId = playlists.find(playlist => playlist.title === 'Travel Phrases')?.id;
  
  const introVideoId = videos.find(video => video.title === 'Introduction to Malay Language')?.id;
  const phrasesVideoId = videos.find(video => video.title === 'Common Malay Phrases for Travelers')?.id;
  const grammarVideoId = videos.find(video => video.title === 'Malay Grammar Fundamentals')?.id;

  const playlistItemsData = [];

  // Add videos to beginner playlist
  if (beginnerPlaylistId && introVideoId) {
    playlistItemsData.push({
      playlistId: beginnerPlaylistId,
      videoId: introVideoId,
    });
  }

  if (beginnerPlaylistId && grammarVideoId) {
    playlistItemsData.push({
      playlistId: beginnerPlaylistId,
      videoId: grammarVideoId,
    });
  }

  // Add videos to travel phrases playlist
  if (travelPlaylistId && phrasesVideoId) {
    playlistItemsData.push({
      playlistId: travelPlaylistId,
      videoId: phrasesVideoId,
    });
  }

  if (playlistItemsData.length > 0) {
    await prisma.videoPlaylistItems.createMany({
      data: playlistItemsData,
      skipDuplicates: true,
    });
  }
};
