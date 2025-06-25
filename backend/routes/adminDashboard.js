var express = require("express");
var router = express.Router();
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const cors = require('cors');

// Apply CORS ONLY to this router
router.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
// GET /api/admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {    // FlashcardSet and Flashcard stats
    const [
      totalSets,
      totalCards,
      setsCreatedThisMonth,
      cardsAddedThisMonth,
      mostPopularSet,
      mostActiveUser,
      // Community stats
      totalPosts,
      totalComments,
      reportedPosts,
      resolvedReports,
      newPostsThisWeek,
      newUsers,
      topContributor,
      // Video stats
      totalVideos,
      totalPlaylists,
      videosAddedThisMonth,
      playlistsAddedThisMonth,
      mostWatchedVideo
    ] = await Promise.all([
      // FlashcardSet stats
      prisma.flashcardSet.count(),
      prisma.flashcard.count(),
      prisma.flashcardSet.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      prisma.flashcard.count({
        where: {
          // Use createdAt from FlashcardSet, not Flashcard itself, since Flashcard doesn't have createdAt in the schema
          set: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        }
      }),
      // Most popular set: by number of cards (as usageCount doesn't exist)
      prisma.flashcardSet.findFirst({
        orderBy: {
          flashcards: {
            _count: 'desc'
          }
        },
        include: {
          flashcards: true
        }
      }),
      // Most active user: by number of flashcardSets created
      prisma.user.findFirst({
        orderBy: {
          flashcardSets: {
            _count: 'desc'
          }
        }
      }),
      // Community stats
      prisma.post.count(),
      prisma.comment.count(),
      prisma.post.count({
        where: {
          reported: true,
          reportResolved: false
        }
      }),
      prisma.post.count({
        where: {
          reported: true,
          reportResolved: true
        }
      }),
      prisma.post.count({
        where: {
          date: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),      prisma.user.findFirst({
        orderBy: {
          posts: {
            _count: 'desc'
          }
        }
      }),
      // Video stats
      prisma.video.count(),
      prisma.videoPlaylist.count(),
      prisma.video.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      prisma.videoPlaylist.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      // Most watched video: by counting progress entries
      prisma.video.findFirst({
        orderBy: {
          progress: {
            _count: 'desc'
          }
        }
      }),
    ]);    res.json({
      flashcards: {
        totalSets,
        totalCards,
        setsCreatedThisMonth,
        cardsAddedThisMonth,
        mostPopularSet: mostPopularSet ? mostPopularSet.title : null,
        mostActiveUser: mostActiveUser ? mostActiveUser.username : null
      },
      community: {
        totalPosts,
        totalComments,
        reportedPosts,
        resolvedReports,
        newPostsThisWeek,
        newUsers,
        topContributor: topContributor ? topContributor.username : null
      },
      videos: {
        totalVideos,
        totalPlaylists,
        videosAddedThisMonth,
        playlistsAddedThisMonth,
        mostWatchedVideo: mostWatchedVideo ? mostWatchedVideo.title : null
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;