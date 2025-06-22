const express = require('express');
const router = express.Router();
const flashcardController = require('../controllers/flashcardController');

/**
 * GET /flashcards
 * Retrieves all flashcards
 */
router.get('/', async (req, res) => {
  try {
    const flashcards = await flashcardController.getAllFlashcards();
    res.json(flashcards);
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    res.status(500).json({
      error: 'Failed to retrieve flashcards',
      details: error.message
    });
  }
});

/**
 * GET /flashcards/:id
 * Retrieves a single flashcard by ID
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const flashcard = await flashcardController.getFlashcardById(id);

    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }

    res.json(flashcard);
  } catch (error) {
    console.error('Error fetching flashcard:', error);
    res.status(500).json({
      error: 'Failed to retrieve flashcard',
      details: error.message
    });
  }
});

/**
 * GET /flashcards/set/:setId
 * Retrieves all flashcards for a specific set
 */
router.get('/set/:setId', async (req, res) => {
  const { setId } = req.params;
  
  try {
    const flashcards = await flashcardController.getFlashcardsBySetId(setId);
    res.json(flashcards);
  } catch (error) {
    console.error('Error fetching flashcards by set:', error);
    res.status(500).json({
      error: 'Failed to retrieve flashcards for this set',
      details: error.message
    });
  }
});

module.exports = router;
