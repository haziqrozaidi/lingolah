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

/**
 * POST /flashcards
 * Creates a new flashcard
 */
router.post('/', async (req, res) => {
  const { frontText, backText, difficulty, setId } = req.body;
  
  // Validate required fields
  if (!frontText || !backText || !difficulty || !setId) {
    return res.status(400).json({
      error: 'Missing required fields',
      requiredFields: ['frontText', 'backText', 'difficulty', 'setId']
    });
  }
  
  try {
    const flashcard = await flashcardController.createFlashcard({
      frontText,
      backText,
      difficulty,
      setId
    });
    
    res.status(201).json(flashcard);
  } catch (error) {
    console.error('Error creating flashcard:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        error: 'Failed to create flashcard',
        details: error.message
      });
    }
    
    res.status(500).json({
      error: 'Failed to create flashcard',
      details: error.message
    });
  }
});

/**
 * PUT /flashcards/:id
 * Updates an existing flashcard
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { frontText, backText, difficulty, setId } = req.body;
  
  // Validate required fields
  if (!frontText || !backText || !difficulty || !setId) {
    return res.status(400).json({
      error: 'Missing required fields',
      requiredFields: ['frontText', 'backText', 'difficulty', 'setId']
    });
  }
  
  try {
    const flashcard = await flashcardController.updateFlashcard(id, {
      frontText,
      backText,
      difficulty,
      setId
    });
    
    res.json(flashcard);
  } catch (error) {
    console.error('Error updating flashcard:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        error: 'Failed to update flashcard',
        details: error.message
      });
    }
    
    res.status(500).json({
      error: 'Failed to update flashcard',
      details: error.message
    });
  }
});

/**
 * DELETE /flashcards/:id
 * Deletes a flashcard
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await flashcardController.deleteFlashcard(id);
    res.status(200).json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        error: 'Failed to delete flashcard',
        details: error.message
      });
    }
    
    res.status(500).json({
      error: 'Failed to delete flashcard',
      details: error.message
    });
  }
});

module.exports = router;
