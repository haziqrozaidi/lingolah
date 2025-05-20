import { ref } from 'vue';

// Flashcard categories with sets
export const flashcardCategories = ref([
  {
    id: 1,
    name: 'Beginner Vocabulary',
    description: 'Essential words and phrases for absolute beginners',
    icon: 'pi pi-book',
    color: 'bg-blue-100',
    sets: [
      { id: 101, name: 'Greetings', description: 'Common greetings and introductions', cardCount: 25 },
      { id: 102, name: 'Numbers', description: 'Count from 1 to 100 in Malay', cardCount: 30 },
      { id: 103, name: 'Colors', description: 'Basic color vocabulary', cardCount: 15 },
      { id: 104, name: 'Family', description: 'Family relationship terms', cardCount: 20 }
    ]
  },
  {
    id: 2,
    name: 'Daily Conversations',
    description: 'Practical phrases for everyday situations',
    icon: 'pi pi-comments',
    color: 'bg-green-100',
    sets: [
      { id: 201, name: 'At the Restaurant', description: 'Order food and ask for the bill', cardCount: 40 },
      { id: 202, name: 'Shopping', description: 'Negotiate prices and make purchases', cardCount: 35 },
      { id: 203, name: 'Transportation', description: 'Get around using public transport', cardCount: 30 },
      { id: 204, name: 'Asking for Directions', description: 'Find your way around town', cardCount: 25 }
    ]
  },
  {
    id: 3,
    name: 'Grammar Concepts',
    description: 'Fundamental grammar rules and patterns',
    icon: 'pi pi-file-edit',
    color: 'bg-purple-100',
    sets: [
      { id: 301, name: 'Subject Pronouns', description: 'Personal pronouns in Malay', cardCount: 15 },
      { id: 302, name: 'Verb Affixes', description: 'Common verb prefixes and suffixes', cardCount: 30 },
      { id: 303, name: 'Question Forms', description: 'How to ask different types of questions', cardCount: 25 }
    ]
  },
  {
    id: 4,
    name: 'Thematic Vocabulary',
    description: 'Words grouped by themes and situations',
    icon: 'pi pi-list',
    color: 'bg-yellow-100',
    sets: [
      { id: 401, name: 'Weather', description: 'Talk about the weather and seasons', cardCount: 20 },
      { id: 402, name: 'Food and Cuisine', description: 'Malaysian dishes and ingredients', cardCount: 45 },
      { id: 403, name: 'Hobbies', description: 'Activities and interests vocabulary', cardCount: 30 },
      { id: 404, name: 'Professions', description: 'Job titles and workplace terms', cardCount: 25 }
    ]
  },
  {
    id: 5,
    name: 'Cultural Expressions',
    description: 'Idioms, proverbs, and cultural phrases',
    icon: 'pi pi-globe',
    color: 'bg-red-100',
    sets: [
      { id: 501, name: 'Malay Proverbs', description: 'Common proverbs and their meanings', cardCount: 30 },
      { id: 502, name: 'Slang and Colloquialisms', description: 'Informal expressions used daily', cardCount: 40 },
      { id: 503, name: 'Cultural References', description: 'Terms related to Malaysian culture', cardCount: 35 }
    ]
  }
]);

// Individual flashcards for each set
const flashcardData = {
  // Beginner Vocabulary - Greetings
  101: [
    { id: 1, malay: 'Selamat pagi', english: 'Good morning' },
    { id: 2, malay: 'Selamat petang', english: 'Good evening' },
    { id: 3, malay: 'Apa khabar?', english: 'How are you?' },
    { id: 4, malay: 'Saya baik', english: 'I am fine' },
    { id: 5, malay: 'Terima kasih', english: 'Thank you' }
  ],
  
  // Beginner Vocabulary - Numbers
  102: [
    { id: 1, malay: 'Satu', english: 'One' },
    { id: 2, malay: 'Dua', english: 'Two' },
    { id: 3, malay: 'Tiga', english: 'Three' },
    { id: 4, malay: 'Empat', english: 'Four' },
    { id: 5, malay: 'Lima', english: 'Five' }
  ],
  
  // Beginner Vocabulary - Colors
  103: [
    { id: 1, malay: 'Merah', english: 'Red' },
    { id: 2, malay: 'Biru', english: 'Blue' },
    { id: 3, malay: 'Hijau', english: 'Green' },
    { id: 4, malay: 'Kuning', english: 'Yellow' },
    { id: 5, malay: 'Hitam', english: 'Black' }
  ],
  
  // Beginner Vocabulary - Family
  104: [
    { id: 1, malay: 'Ibu', english: 'Mother' },
    { id: 2, malay: 'Bapa', english: 'Father' },
    { id: 3, malay: 'Adik', english: 'Younger sibling' },
    { id: 4, malay: 'Abang', english: 'Older brother' },
    { id: 5, malay: 'Kakak', english: 'Older sister' }
  ],
  
  // Daily Conversations - At the Restaurant
  201: [
    { id: 1, malay: 'Saya ingin memesan', english: 'I would like to order' },
    { id: 2, malay: 'Berapa harganya?', english: 'How much does it cost?' },
    { id: 3, malay: 'Boleh saya lihat menu?', english: 'Can I see the menu?' },
    { id: 4, malay: 'Air kosong, sila', english: 'Water, please' },
    { id: 5, malay: 'Bil, sila', english: 'Bill, please' }
  ],
  
  // Daily Conversations - Shopping
  202: [
    { id: 1, malay: 'Berapa harga ini?', english: 'How much is this?' },
    { id: 2, malay: 'Adakah diskaun?', english: 'Is there a discount?' },
    { id: 3, malay: 'Terlalu mahal', english: 'Too expensive' },
    { id: 4, malay: 'Saya ambil ini', english: 'I\'ll take this' },
    { id: 5, malay: 'Ada saiz lain?', english: 'Do you have other sizes?' }
  ],
  
  // Grammar Concepts - Subject Pronouns
  301: [
    { id: 1, malay: 'Saya', english: 'I' },
    { id: 2, malay: 'Anda/Awak', english: 'You (formal/informal)' },
    { id: 3, malay: 'Dia', english: 'He/She' },
    { id: 4, malay: 'Kami', english: 'We (exclusive)' },
    { id: 5, malay: 'Kita', english: 'We (inclusive)' }
  ],
  
  // Thematic Vocabulary - Weather
  401: [
    { id: 1, malay: 'Panas', english: 'Hot' },
    { id: 2, malay: 'Hujan', english: 'Rain' },
    { id: 3, malay: 'Mendung', english: 'Cloudy' },
    { id: 4, malay: 'Cerah', english: 'Sunny' },
    { id: 5, malay: 'Angin', english: 'Wind' }
  ],
  
  // Cultural Expressions - Malay Proverbs
  501: [
    { id: 1, malay: 'Bagai aur dengan tebing', english: 'Like bamboo and riverbank (inseparable)' },
    { id: 2, malay: 'Seperti katak di bawah tempurung', english: 'Like a frog under a coconut shell (narrow-minded)' },
    { id: 3, malay: 'Sikit-sikit, lama-lama jadi bukit', english: 'Bit by bit, eventually becomes a hill (small efforts add up)' },
    { id: 4, malay: 'Ada udang di sebalik batu', english: 'There\'s a prawn behind the rock (hidden agenda)' },
    { id: 5, malay: 'Sambil menyelam minum air', english: 'Drinking water while diving (doing two things at once)' }
  ]
};

/**
 * Get flashcards for a specific set ID
 * @param {number} setId - The ID of the flashcard set
 * @returns {Array} - Array of flashcard objects
 */
export function getFlashcards(setId) {
  if (flashcardData[setId]) {
    return flashcardData[setId];
  }
  
  // Generate placeholder data for sets without specific data
  return Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    malay: `Malay Word ${i + 1}`,
    english: `English Translation ${i + 1}`
  }));
}

/**
 * Get all available flashcard sets as a flat array
 * @returns {Array} - Array of all flashcard sets
 */
export function getAllFlashcardSets() {
  return flashcardCategories.value.flatMap(category => category.sets);
}

/**
 * Find a flashcard set by ID
 * @param {number} setId - The ID of the flashcard set
 * @returns {Object|null} - The flashcard set or null if not found
 */
export function getFlashcardSetById(setId) {
  for (const category of flashcardCategories.value) {
    const set = category.sets.find(s => s.id === setId);
    if (set) return set;
  }
  return null;
}

/**
 * Find the category of a specific flashcard set
 * @param {number} setId - The ID of the flashcard set
 * @returns {Object|null} - The category or null if not found
 */
export function getCategoryForSet(setId) {
  return flashcardCategories.value.find(category => 
    category.sets.some(set => set.id === setId)
  ) || null;
}
