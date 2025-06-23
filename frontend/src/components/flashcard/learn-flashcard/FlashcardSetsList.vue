<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  flashcardSets: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['set-click']);

// Helper functions to calculate difficulty dots
const getFilledDots = (cardCount) => {
  return Math.min(5, Math.floor(cardCount / 10));
};

const getEmptyDots = (cardCount) => {
  return Math.max(0, 5 - Math.floor(cardCount / 10));
};

const handleSetClick = (set) => {
  emit('set-click', set);
};
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="set in flashcardSets"
      :key="set.id"
      @click="handleSetClick(set)"
      class="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div class="flex justify-between items-start mb-3">
        <h3 class="text-lg font-semibold text-gray-800">{{ set.name }}</h3>
        <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
          >{{ set.cardCount }} cards</span
        >
      </div>
      <p class="text-gray-600 mb-4">{{ set.description }}</p>
      <div class="flex justify-between items-center">
        <div class="flex space-x-1">
          <template v-for="n in getFilledDots(set.cardCount)" :key="`filled-${n}`">
            <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
          </template>
          <template v-for="n in getEmptyDots(set.cardCount)" :key="`empty-${n}`">
            <span class="w-2 h-2 bg-gray-200 rounded-full"></span>
          </template>
        </div>
        <button class="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center">
          Start Learning <i class="pi pi-arrow-right ml-1"></i>
        </button>
      </div>
    </div>
  </div>
</template>
