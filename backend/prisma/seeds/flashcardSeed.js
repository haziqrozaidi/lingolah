module.exports = async function seedFlashcards(prisma) {
  // Get flashcard set IDs
  const flashcardSets = await prisma.flashcardSet.findMany({
    select: { id: true, title: true },
  });

  if (flashcardSets.length === 0) {
    console.log('No flashcard sets found, skipping flashcards seeding');
    return;
  }

  const greetingsSetId = flashcardSets.find(set => set.title === 'Basic Malay Greetings')?.id;
  const phrasesSetId = flashcardSets.find(set => set.title === 'Common Malay Phrases')?.id;
  const grammarSetId = flashcardSets.find(set => set.title === 'Malay Grammar Basics')?.id;

  const flashcardData = [];

  // Add cards to the greetings set
  if (greetingsSetId) {
    flashcardData.push(
      {
        setId: greetingsSetId,
        frontText: 'Hello',
        backText: 'Helo / Hai',
        difficulty: 'Easy',
      },
      {
        setId: greetingsSetId,
        frontText: 'Good morning',
        backText: 'Selamat pagi',
        difficulty: 'Easy',
      },
      {
        setId: greetingsSetId,
        frontText: 'Good afternoon',
        backText: 'Selamat tengah hari',
        difficulty: 'Easy',
      },
      {
        setId: greetingsSetId,
        frontText: 'Good evening',
        backText: 'Selamat petang',
        difficulty: 'Easy',
      },
      {
        setId: greetingsSetId,
        frontText: 'Good night',
        backText: 'Selamat malam',
        difficulty: 'Easy',
      }
    );
  }

  // Add cards to the phrases set
  if (phrasesSetId) {
    flashcardData.push(
      {
        setId: phrasesSetId,
        frontText: 'Thank you',
        backText: 'Terima kasih',
        difficulty: 'Easy',
      },
      {
        setId: phrasesSetId,
        frontText: 'You\'re welcome',
        backText: 'Sama-sama',
        difficulty: 'Easy',
      },
      {
        setId: phrasesSetId,
        frontText: 'How are you?',
        backText: 'Apa khabar?',
        difficulty: 'Medium',
      }
    );
  }

  // Add cards to the grammar set
  if (grammarSetId) {
    flashcardData.push(
      {
        setId: grammarSetId,
        frontText: 'I (pronoun)',
        backText: 'Saya',
        difficulty: 'Easy',
      },
      {
        setId: grammarSetId,
        frontText: 'You (pronoun)',
        backText: 'Awak / Anda',
        difficulty: 'Easy',
      },
      {
        setId: grammarSetId,
        frontText: 'Present tense structure',
        backText: 'Subject + Verb (no conjugation required)',
        difficulty: 'Medium',
      }
    );
  }

  if (flashcardData.length > 0) {
    await prisma.flashcard.createMany({
      data: flashcardData,
      skipDuplicates: true,
    });
  }
};
