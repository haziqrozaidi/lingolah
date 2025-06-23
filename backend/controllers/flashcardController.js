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
