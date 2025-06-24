<script setup>
import { defineProps, defineEmits } from 'vue';
import EmptyState from './EmptyState.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  selectedSet: {
    type: Object,
    default: null
  },
  selectedCategory: {
    type: Object,
    default: null
  },
  flashcards: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['close', 'start-learning']);

const closeModal = () => {
  emit('close');
};

const startLearning = () => {
  emit('start-learning');
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50" @click.self="closeModal">
    <div class="absolute inset-0 bg-gray-800 opacity-50"></div>
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden relative z-10"
    >
      <!-- Loading indicator inside modal -->
      <div v-if="isLoading" class="flex justify-center items-center py-12 flex-grow">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <template v-else>
        <!-- Modal Header with visual improvements -->
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-2xl font-semibold text-gray-800">{{ selectedSet?.name }}</h3>
              <p class="text-gray-600 mt-1">{{ selectedSet?.description }}</p>
            </div>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <i class="pi pi-times text-xl"></i>
            </button>
          </div>

          <!-- Category badge -->
          <div
            class="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-50 text-blue-700"
            v-if="selectedCategory"
          >
            <i :class="[selectedCategory.icon, 'mr-1 text-sm']"></i>
            {{ selectedCategory.name }}
          </div>
        </div>

        <!-- Modal Body with improved card design -->
        <div class="p-6 overflow-y-auto flex-grow">
          <div class="mb-4">
            <h4 class="text-lg font-semibold text-gray-800 mb-3">Flashcards in this set</h4>
            <p class="text-gray-600">
              Click "Start Learning" to begin your study session with these flashcards.
            </p>
          </div>

          <!-- Error message in modal -->
          <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{{ error }}</p>
          </div>

          <!-- Empty state for no flashcards -->
          <EmptyState
            v-else-if="flashcards.length === 0"
            title="No flashcards available"
            message="This set doesn't contain any flashcards yet."
            icon="pi pi-inbox"
            class="mb-4"
          />

          <!-- Preview of flashcards with improved styling -->
          <div v-else class="space-y-3 mt-6">
            <div
              v-for="card in flashcards"
              :key="card.id"
              class="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="text-xl font-medium text-gray-800 mb-1">{{ card.malay }}</div>
                  <div class="text-gray-600">{{ card.english }}</div>
                </div>
                <div
                  class="ml-4 flex-shrink-0 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1.5 rounded-full"
                >
                  {{ card.difficulty || 'Medium' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer with just the button -->
        <div class="p-6 border-t border-gray-100 flex justify-end">
          <button
            @click="startLearning"
            class="px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center shadow-sm"
            :disabled="flashcards.length === 0"
            :class="{ 'opacity-50 cursor-not-allowed': flashcards.length === 0 }"
          >
            Start Learning <i class="pi pi-arrow-right ml-2"></i>
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
