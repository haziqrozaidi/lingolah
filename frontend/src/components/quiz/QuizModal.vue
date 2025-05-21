<template>
  <div class="quiz-modal-overlay">
    <div class="quiz-modal">
      <button class="close-btn" @click="$emit('close')">×</button>
      <component :is="currentQuizComponent" />
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue';

const props = defineProps({
  quizType: String
});

const currentQuizComponent = computed(() => {
  // This would return different quiz components based on quizType
  // For example: 
  // if (props.quizType === 'greetings') return GreetingsQuiz;
  // if (props.quizType === 'numbers') return NumbersQuiz;
  // etc.
  return defineAsyncComponent(() => import(`@/components/quizzes/${props.quizType}.vue`));
});
</script>