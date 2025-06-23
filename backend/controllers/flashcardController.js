const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

/**
 * Get all flashcards
 */
exports.getAllFlashcards = async () => {
  try {
    const flashcards = await prisma.flashcard.findMany({
      include: {
        set: {
          include: {
            category: true,
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        }
      },
      orderBy: {
        setId: 'asc'
      }
    });

    return flashcards.map(formatFlashcard);
  } catch (error) {
    console.error('Error in getAllFlashcards:', error);
    throw error;
  }
};

/**
 * Get flashcards by set ID
 */
exports.getFlashcardsBySetId = async (setId) => {
  try {
    const flashcards = await prisma.flashcard.findMany({
      where: { setId },
      include: {
        set: {
          include: {
            category: true,
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        }
      },
      orderBy: {
        id: 'asc'
      }
    });

    return flashcards.map(formatFlashcard);
  } catch (error) {
    console.error('Error in getFlashcardsBySetId:', error);
    throw error;
  }
};

/**
 * Get a single flashcard by ID
 */
exports.getFlashcardById = async (id) => {
  try {
    const flashcard = await prisma.flashcard.findUnique({
      where: { id },
      include: {
        set: {
          include: {
            category: true,
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        }
      }
    });

    if (!flashcard) {
      return null;
    }

    return formatFlashcard(flashcard);
  } catch (error) {
    console.error('Error in getFlashcardById:', error);
    throw error;
  }
};

/**
 * Create a new flashcard
 * Required fields: frontText, backText, difficulty, setId
 */
exports.createFlashcard = async (flashcardData) => {
  try {
    // Check if the set exists
    const existingSet = await prisma.flashcardSet.findUnique({
      where: { id: flashcardData.setId }
    });

    if (!existingSet) {
      throw new Error(`Flashcard set with ID ${flashcardData.setId} not found`);
    }

    // Create the flashcard
    const newFlashcard = await prisma.flashcard.create({
      data: {
        frontText: flashcardData.frontText,
        backText: flashcardData.backText,
        difficulty: flashcardData.difficulty,
        setId: flashcardData.setId
      },
      include: {
        set: {
          include: {
            category: true,
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        }
      }
    });

    return formatFlashcard(newFlashcard);
  } catch (error) {
    console.error('Error in createFlashcard:', error);
    throw error;
  }
};

/**
 * Update an existing flashcard
 * Required fields: id, frontText, backText, difficulty, setId
 */
exports.updateFlashcard = async (id, flashcardData) => {
  try {
    // Check if the flashcard exists
    const existingFlashcard = await prisma.flashcard.findUnique({
      where: { id }
    });

    if (!existingFlashcard) {
      throw new Error(`Flashcard with ID ${id} not found`);
    }

    // Check if the set exists if setId is being updated
    if (flashcardData.setId && flashcardData.setId !== existingFlashcard.setId) {
      const existingSet = await prisma.flashcardSet.findUnique({
        where: { id: flashcardData.setId }
      });

      if (!existingSet) {
        throw new Error(`Flashcard set with ID ${flashcardData.setId} not found`);
      }
    }

    // Update the flashcard
    const updatedFlashcard = await prisma.flashcard.update({
      where: { id },
      data: {
        frontText: flashcardData.frontText,
        backText: flashcardData.backText,
        difficulty: flashcardData.difficulty,
        setId: flashcardData.setId
      },
      include: {
        set: {
          include: {
            category: true,
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        }
      }
    });

    return formatFlashcard(updatedFlashcard);
  } catch (error) {
    console.error('Error in updateFlashcard:', error);
    throw error;
  }
};

/**
 * Delete a flashcard by ID
 */
exports.deleteFlashcard = async (id) => {
  try {
    // Check if the flashcard exists
    const existingFlashcard = await prisma.flashcard.findUnique({
      where: { id }
    });

    if (!existingFlashcard) {
      throw new Error(`Flashcard with ID ${id} not found`);
    }

    // Delete the flashcard
    await prisma.flashcard.delete({
      where: { id }
    });

    return true;
  } catch (error) {
    console.error('Error in deleteFlashcard:', error);
    throw error;
  }
};

/**
 * Helper function to format flashcard data
 */
function formatFlashcard(flashcard) {
  return {
    id: flashcard.id,
    setId: flashcard.setId,
    frontText: flashcard.frontText,
    backText: flashcard.backText,
    difficulty: flashcard.difficulty,
    set: flashcard.set ? {
      id: flashcard.set.id,
      title: flashcard.set.title,
      description: flashcard.set.description,
      categoryId: flashcard.set.categoryId,
      category: flashcard.set.category,
      user: flashcard.set.user
    } : null
  };
}
