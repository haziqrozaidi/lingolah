<template>
  <div
    class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-200 flex flex-col"
  >
    <div class="flex justify-between items-start mb-3">
      <div>
        <h3 class="font-medium text-gray-800 text-lg mb-1">{{ flashcard.frontText }}</h3>
        <p class="text-gray-600">{{ flashcard.backText }}</p>
      </div>
      <div class="flex space-x-2">
        <button
          class="text-blue-500 hover:text-blue-700 transition duration-200"
          aria-label="Edit flashcard"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          class="text-red-500 hover:text-red-700 transition duration-200"
          aria-label="Delete flashcard"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
    <div class="mt-auto pt-3 flex justify-between items-center text-sm">
      <span class="text-gray-500">{{ flashcard.setName }}</span>
      <span
        :class="{
          'bg-green-100 text-green-800': flashcard.difficulty === 'Easy',
          'bg-yellow-100 text-yellow-800': flashcard.difficulty === 'Medium',
          'bg-red-100 text-red-800': flashcard.difficulty === 'Hard',
        }"
        class="px-2 py-1 rounded-full text-xs font-medium"
      >
        {{ flashcard.difficulty }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlashcardItem',
  props: {
    flashcard: {
      type: Object,
      required: true,
    },
  },
}
</script>
