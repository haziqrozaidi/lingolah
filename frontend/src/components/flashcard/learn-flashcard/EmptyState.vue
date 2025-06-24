<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  icon: {
    type: String,
    default: 'pi pi-inbox'
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});
</script>

<template>
  <div class="bg-gray-50 rounded-lg p-8 text-center">
    <div class="text-gray-400 text-5xl mb-4">
      <i :class="icon"></i>
    </div>
    <h3 class="text-xl font-medium text-gray-700 mb-2">{{ title }}</h3>
    <p class="text-gray-500 mb-4">{{ message }}</p>
  </div>
</template>
