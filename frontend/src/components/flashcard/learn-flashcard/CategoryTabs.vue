<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  selectedCategory: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['select-category']);

const selectCategory = (category) => {
  emit('select-category', category);
};
</script>

<template>
  <div class="mb-6 overflow-x-auto" v-if="selectedCategory && categories.length > 0">
    <div class="flex space-x-2 pb-2">
      <button
        v-for="category in categories"
        :key="category.id"
        @click="selectCategory(category)"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-colors',
          selectedCategory.id === category.id
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        ]"
      >
        <i :class="[category.icon, 'mr-2']"></i>
        {{ category.name }}
      </button>
    </div>
  </div>
  
  <!-- Category description -->
  <div class="mb-6" v-if="selectedCategory">
    <div :class="['p-4 rounded-lg', selectedCategory.color]">
      <h2 class="text-xl font-semibold text-gray-800">{{ selectedCategory.name }}</h2>
      <p class="text-gray-700">{{ selectedCategory.description }}</p>
    </div>
  </div>
</template>
