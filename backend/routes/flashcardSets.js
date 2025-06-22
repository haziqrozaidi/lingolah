const express = require('express');
const router = express.Router();
const flashcardSetController = require('../controllers/flashcardSetController');

/**
 * GET /flashcard-sets
 * Retrieves all flashcard sets with their flashcards and categories
 */
router.get('/', async (req, res) => {
  try {
    const flashcardSets = await flashcardSetController.getAllFlashcardSets();
    res.json(flashcardSets);
  } catch (error) {
    console.error('Error fetching flashcard sets:', error);
    res.status(500).json({
      error: 'Failed to retrieve flashcard sets',
      details: error.message
    });
  }
});

/**
 * GET /flashcard-sets/:id
 * Retrieves a single flashcard set by ID
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const flashcardSet = await flashcardSetController.getFlashcardSetById(id);

    if (!flashcardSet) {
      return res.status(404).json({ error: 'Flashcard set not found' });
    }

    res.json(flashcardSet);
  } catch (error) {
    console.error('Error fetching flashcard set:', error);
    res.status(500).json({
      error: 'Failed to retrieve flashcard set',
      details: error.message
    });
  }
});

/**
 * GET /flashcard-sets/category/:categoryId
 * Retrieves all flashcard sets for a specific category
 */
router.get('/category/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  
  try {
    const flashcardSets = await flashcardSetController.getFlashcardSetsByCategory(categoryId);
    res.json(flashcardSets);
  } catch (error) {
    console.error('Error fetching flashcard sets by category:', error);
    res.status(500).json({
      error: 'Failed to retrieve flashcard sets for this category',
      details: error.message
    });
  }
});

/**
 * GET /flashcard-sets/categories/all
 * Retrieves all categories for flashcard sets
 */
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await flashcardSetController.getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      error: 'Failed to retrieve categories',
      details: error.message
    });
  }
});

/**
 * POST /flashcard-sets
 * Creates a new empty flashcard set
 */
router.post('/', async (req, res) => {
  try {
    const { title, description, categoryId, userId: clerkUserId } = req.body;
    
    if (!title) {
      return res.status(400).json({
        error: 'Missing required field',
        details: 'Title is required'
      });
    }
    
    if (!categoryId) {
      return res.status(400).json({
        error: 'Missing required field',
        details: 'Category ID is required'
      });
    }
    
    if (!clerkUserId) {
      return res.status(400).json({
        error: 'Missing required field',
        details: 'User ID is required'
      });
    }
    
    const user = await flashcardSetController.findUserByClerkId(clerkUserId);
    
    if (!user) {
      return res.status(400).json({
        error: 'User not found',
        details: 'No user found with the provided ID'
      });
    }
    
    const newFlashcardSet = await flashcardSetController.createFlashcardSet({
      title,
      description,
      categoryId,
      userId: user.id
    });
    
    res.status(201).json(newFlashcardSet);
  } catch (error) {
    console.error('Error creating flashcard set:', error);
    
    if (error.code === 'P2003') {
      return res.status(400).json({
        error: 'Invalid reference',
        details: 'The category ID or user ID provided does not exist'
      });
    }
    
    if (error.code === 'P2002') {
      return res.status(400).json({
        error: 'Duplicate entry',
        details: 'A flashcard set with this title may already exist'
      });
    }
    
    res.status(500).json({
      error: 'Failed to create flashcard set',
      details: error.message
    });
  }
});

/**
 * PUT /flashcard-sets/:id
 * Updates an existing flashcard set
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, categoryId } = req.body;
  
  try {
    // Validation
    if (!title) {
      return res.status(400).json({
        error: 'Missing required field',
        details: 'Title is required'
      });
    }
    
    if (!categoryId) {
      return res.status(400).json({
        error: 'Missing required field',
        details: 'Category ID is required'
      });
    }
    
    // Update the flashcard set
    const updatedFlashcardSet = await flashcardSetController.updateFlashcardSet(id, {
      title,
      description,
      categoryId
    });
    
    res.json(updatedFlashcardSet);
  } catch (error) {
    console.error('Error updating flashcard set:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        error: 'Flashcard set not found',
        details: error.message
      });
    }
    
    if (error.code === 'P2003') {
      return res.status(400).json({
        error: 'Invalid reference',
        details: 'The category ID provided does not exist'
      });
    }
    
    res.status(500).json({
      error: 'Failed to update flashcard set',
      details: error.message
    });
  }
});

module.exports = router;
