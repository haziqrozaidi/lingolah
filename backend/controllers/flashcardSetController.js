const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

/**
 * Get all flashcard sets
 */
exports.getAllFlashcardSets = async () => {
  try {
    const flashcardSets = await prisma.flashcardSet.findMany({
      include: {
        flashcards: true,
        category: true,
        user: {
          select: {
            id: true,
            username: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return flashcardSets.map(formatFlashcardSet);
  } catch (error) {
    console.error('Error in getAllFlashcardSets:', error);
    throw error;
  }
};

/**
 * Get a single flashcard set by ID
 */
exports.getFlashcardSetById = async (id) => {
  try {
    const flashcardSet = await prisma.flashcardSet.findUnique({
      where: { id },
      include: {
        flashcards: true,
        category: true,
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    if (!flashcardSet) {
      return null;
    }

    return formatFlashcardSet(flashcardSet);
  } catch (error) {
    console.error('Error in getFlashcardSetById:', error);
    throw error;
  }
};

/**
 * Get flashcard sets by category
 */
exports.getFlashcardSetsByCategory = async (categoryId) => {
  try {
    const flashcardSets = await prisma.flashcardSet.findMany({
      where: { categoryId },
      include: {
        flashcards: true,
        category: true,
        user: {
          select: {
            id: true,
            username: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return flashcardSets.map(formatFlashcardSet);
  } catch (error) {
    console.error('Error in getFlashcardSetsByCategory:', error);
    throw error;
  }
};

/**
 * Get all categories
 */
exports.getAllCategories = async () => {
  try {
    return await prisma.category.findMany({
      orderBy: {
        description: 'asc'
      }
    });
  } catch (error) {
    console.error('Error in getAllCategories:', error);
    throw error;
  }
};

/**
 * Find user by Clerk ID
 */
exports.findUserByClerkId = async (clerkUserId) => {
  try {
    return await prisma.user.findFirst({
      where: {
        clerkUserId: clerkUserId
      }
    });
  } catch (error) {
    console.error('Error in findUserByClerkId:', error);
    throw error;
  }
};

/**
 * Create a new flashcard set
 * By default, a new flashcard set contains no flashcards
 */
exports.createFlashcardSet = async (setData) => {
  try {
    // Create the flashcard set
    const newSet = await prisma.flashcardSet.create({
      data: {
        title: setData.title,
        description: setData.description,
        userId: setData.userId,
        categoryId: setData.categoryId,
        // Timestamps are handled automatically by Prisma
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            username: true
          }
        },
        flashcards: true // Include empty flashcards array
      }
    });
    
    return formatFlashcardSet(newSet);
  } catch (error) {
    console.error('Error in createFlashcardSet:', error);
    throw error;
  }
};

/**
 * Update an existing flashcard set
 * Updates the title, description, and categoryId for a given flashcard set
 */
exports.updateFlashcardSet = async (id, setData) => {
  try {
    // Find the flashcard set to ensure it exists
    const existingSet = await prisma.flashcardSet.findUnique({
      where: { id },
    });

    if (!existingSet) {
      throw new Error(`Flashcard set with ID ${id} not found`);
    }

    // Update the flashcard set
    const updatedSet = await prisma.flashcardSet.update({
      where: { id },
      data: {
        title: setData.title,
        description: setData.description,
        categoryId: setData.categoryId,
        // updatedAt is handled automatically by Prisma's @updatedAt
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            username: true
          }
        },
        flashcards: true
      }
    });
    
    return formatFlashcardSet(updatedSet);
  } catch (error) {
    console.error('Error in updateFlashcardSet:', error);
    throw error;
  }
};

/**
 * Helper function to format flashcard set data
 */
function formatFlashcardSet(set) {
  return {
    id: set.id,
    userId: set.userId,
    title: set.title,
    description: set.description,
    categoryId: set.categoryId,
    createdAt: set.createdAt.toISOString(),
    updatedAt: set.updatedAt.toISOString(),
    flashcards: set.flashcards.map(card => ({
      id: card.id,
      setId: card.setId,
      frontText: card.frontText,
      backText: card.backText,
      difficulty: card.difficulty
    }))
  };
}
