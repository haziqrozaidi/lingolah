const express = require("express");
const router = express.Router();
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// Get all videos
router.get("/", async (req, res) => {
  try {
    const videos = await prisma.video.findMany();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a video by its YouTube ID
router.get("/youtube/:youtubeId", async (req, res) => {
  try {
    const { youtubeId } = req.params;

    // Search for the video by the YouTube ID extracted from the URL
    const video = await prisma.video.findFirst({
      where: {
        url: {
          contains: youtubeId,
        },
      },
    });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new video
router.post("/", async (req, res) => {
  try {
    const { title, url, description, topic, subtitles } = req.body;
    const video = await prisma.video.create({
      data: { title, url, description, topic, subtitles },
    });
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a video
router.delete("/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    await prisma.video.delete({ where: { video_id: parseInt(videoId) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a video
router.put("/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, url, description, topic, subtitles } = req.body;
    const updated = await prisma.video.update({
      where: { video_id: parseInt(videoId) },
      data: { title, url, description, topic, subtitles },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
