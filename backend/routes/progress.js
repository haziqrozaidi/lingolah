const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

/**
 * Middleware to extract user ID from request
 * This handles Clerk user IDs by looking up the corresponding internal user ID
 */
const extractUserId = async (req, res, next) => {
  try {
    // First try to get clerkUserId from headers
    let clerkUserId = req.headers['user-id'];
    
    // If not in headers, try request body
    if (!clerkUserId && req.body && req.body.userId) {
      clerkUserId = req.body.userId;
    }
    
    // If still no clerkUserId, return auth error
    if (!clerkUserId) {
      return res.status(401).json({ error: 'Authentication required', details: 'User ID not provided' });
    }
    
    // Look up the internal user ID based on the Clerk user ID
    const user = await prisma.user.findFirst({
      where: {
        clerkUserId: clerkUserId
      }
    });
    
    // If no user found with this Clerk ID
    if (!user) {
      return res.status(404).json({ error: 'User not found', details: 'No user exists with the provided authentication ID' });
    }
    
    // Add internal userId to request object
    req.userId = user.id;
    next();
  } catch (error) {
    console.error('Error in extractUserId middleware:', error);
    return res.status(500).json({ error: 'Authentication error', details: 'Failed to process authentication' });
  }
};

/**
 * Apply the middleware to all routes in this router
 */
router.use(extractUserId);

/**
 * Route to update flashcard progress
 * POST /progress/update
 * Requires authentication
 * Body: { cardId, difficulty }
 */
router.post('/update', async (req, res) => {
  try {
    const { cardId, difficulty } = req.body;
    
    // Validation
    if (!cardId) {
      return res.status(400).json({ error: 'Missing required field: cardId' });
    }
    
    if (difficulty === undefined || ![1, 2, 3].includes(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty value. Must be 1 (Hard), 2 (Good), or 3 (Easy)' });
    }
    
    // Get userId from middleware - this is now the internal user ID
    const userId = req.userId;
    
    const progress = await progressController.updateProgress(cardId, userId, difficulty);
    
    res.status(200).json(progress);
  } catch (error) {
    console.error('Error in update progress route:', error);
    
    // Handle specific errors
    if (error.message.includes('User with ID') && error.message.includes('not found')) {
      return res.status(404).json({ error: 'User not found', details: error.message });
    }
    
    if (error.message.includes('Flashcard with ID') && error.message.includes('not found')) {
      return res.status(404).json({ error: 'Flashcard not found', details: error.message });
    }
    
    res.status(500).json({ error: 'Failed to update progress', details: error.message });
  }
});

/**
 * Route to get progress for a specific card
 * GET /progress/card/:cardId
 * Requires authentication
 */
router.get('/card/:cardId', async (req, res) => {
  try {
    const { cardId } = req.params;
    
    // Get userId from middleware - this is now the internal user ID
    const userId = req.userId;
    
    const progress = await progressController.getProgressForCard(cardId, userId);
    
    if (!progress) {
      return res.status(404).json({ error: 'No progress found for this flashcard' });
    }
    
    res.status(200).json(progress);
  } catch (error) {
    console.error('Error in get card progress route:', error);
    
    // Handle specific errors
    if (error.message.includes('User with ID') && error.message.includes('not found')) {
      return res.status(404).json({ error: 'User not found', details: error.message });
    }
    
    res.status(500).json({ error: 'Failed to fetch progress', details: error.message });
  }
});

/**
 * Route to get all due flashcards for current user
 * GET /progress/due
 * Requires authentication
 */
router.get('/due', async (req, res) => {
  try {
    // Get userId from middleware - this is now the internal user ID
    const userId = req.userId;
    
    const dueFlashcards = await progressController.getDueFlashcards(userId);
    
    res.status(200).json(dueFlashcards);
  } catch (error) {
    console.error('Error in get due flashcards route:', error);
    
    // Handle specific errors
    if (error.message.includes('User with ID') && error.message.includes('not found')) {
      return res.status(404).json({ error: 'User not found', details: error.message });
    }
    
    res.status(500).json({ error: 'Failed to fetch due flashcards', details: error.message });
  }
});

module.exports = router;
