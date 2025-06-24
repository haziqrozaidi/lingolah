const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

/**
 * Calculates the next review date based on difficulty rating
 * 
 * @param {number} difficulty - Difficulty rating (1=Hard, 2=Good, 3=Easy)
 * @returns {Date} - Next review date
 */
function calculateNextReviewDate(difficulty) {
  const now = new Date();
  
  switch(difficulty) {
    case 1: // Hard
      return new Date(now.setDate(now.getDate() + 1)); // 1 day later
    case 2: // Good
      return new Date(now.setDate(now.getDate() + 3)); // 3 days later
    case 3: // Easy
      return new Date(now.setDate(now.getDate() + 5)); // 5 days later
    default:
      return new Date(now.setDate(now.getDate() + 1)); // Default to 1 day
  }
}

/**
 * Validate that a user exists in the database
 * @param {string} userId - The user's ID
 * @returns {Promise<boolean>} - Whether the user exists
 */
async function validateUser(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    return !!user;
  } catch (error) {
    console.error('Error validating user:', error);
    throw error;
  }
}

/**
 * Update progress for a flashcard
 * Required fields: cardId, difficulty
 * userId is taken from the request (authenticated user)
 */
exports.updateProgress = async (cardId, userId, difficulty) => {
  try {
    // Validate user exists
    const userExists = await validateUser(userId);
    if (!userExists) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    // Check if the card exists
    const card = await prisma.flashcard.findUnique({
      where: { id: cardId }
    });

    if (!card) {
      throw new Error(`Flashcard with ID ${cardId} not found`);
    }

    // Calculate the next review date based on difficulty
    const now = new Date();
    const nextReview = calculateNextReviewDate(difficulty);

    // Try to find existing progress
    const existingProgress = await prisma.progress.findFirst({
      where: {
        cardId,
        userId
      }
    });

    let progress;
    
    if (existingProgress) {
      // Update existing progress
      progress = await prisma.progress.update({
        where: {
          id: existingProgress.id
        },
        data: {
          lastReview: now,
          nextReview
        }
      });
    } else {
      // Create new progress entry
      progress = await prisma.progress.create({
        data: {
          cardId,
          userId,
          lastReview: now,
          nextReview
        }
      });
    }

    return formatProgress(progress);
  } catch (error) {
    console.error('Error in updateProgress:', error);
    throw error;
  }
};

/**
 * Get progress for a specific card and user
 */
exports.getProgressForCard = async (cardId, userId) => {
  try {
    // Validate user exists
    const userExists = await validateUser(userId);
    if (!userExists) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    const progress = await prisma.progress.findFirst({
      where: {
        cardId,
        userId
      },
      include: {
        card: true
      }
    });

    if (!progress) {
      return null;
    }

    return formatProgress(progress);
  } catch (error) {
    console.error('Error in getProgressForCard:', error);
    throw error;
  }
};

/**
 * Get all due flashcards for a user
 */
exports.getDueFlashcards = async (userId) => {
  try {
    // Validate user exists
    const userExists = await validateUser(userId);
    if (!userExists) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    const now = new Date();
    
    // Get progress entries where nextReview date is before or equal to now
    const dueProgress = await prisma.progress.findMany({
      where: {
        userId,
        nextReview: {
          lte: now
        }
      },
      include: {
        card: {
          include: {
            set: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });

    return dueProgress.map(formatDueFlashcard);
  } catch (error) {
    console.error('Error in getDueFlashcards:', error);
    throw error;
  }
};

/**
 * Helper function to format progress data
 */
function formatProgress(progress) {
  return {
    id: progress.id,
    cardId: progress.cardId,
    userId: progress.userId,
    lastReview: progress.lastReview,
    nextReview: progress.nextReview,
    card: progress.card ? {
      id: progress.card.id,
      frontText: progress.card.frontText,
      backText: progress.card.backText,
      difficulty: progress.card.difficulty,
      setId: progress.card.setId
    } : null
  };
}

/**
 * Helper function to format due flashcard data
 */
function formatDueFlashcard(progress) {
  return {
    progressId: progress.id,
    lastReview: progress.lastReview,
    nextReview: progress.nextReview,
    card: {
      id: progress.card.id,
      frontText: progress.card.frontText,
      backText: progress.card.backText,
      difficulty: progress.card.difficulty,
      setId: progress.card.setId,
      set: progress.card.set ? {
        id: progress.card.set.id,
        title: progress.card.set.title,
        description: progress.card.set.description,
        category: progress.card.set.category
      } : null
    }
  };
}
