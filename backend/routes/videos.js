const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Récupérer toutes les vidéos avec leur catégorie
router.get('/', async (req, res) => {
  try {
    const videos = await prisma.video.findMany();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtenir une vidéo par son ID YouTube
router.get('/youtube/:youtubeId', async (req, res) => {
  try {
    const { youtubeId } = req.params;
    
    // Rechercher la vidéo par l'ID YouTube extrait de l'URL
    const video = await prisma.video.findFirst({
      where: {
        url: {
          contains: youtubeId
        }
      }
    });
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;