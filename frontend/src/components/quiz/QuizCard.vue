<template>
  <div 
    class="quiz-card"
    :class="difficulty"
    @click="$emit('click')"
  >
    <div class="quiz-header">
      <span class="quiz-type">{{ typeLabel }}</span>
      <span class="quiz-difficulty">{{ difficulty }}</span>
    </div>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <div class="quiz-footer">
      <span>{{ questionCount }} questions</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: String,
  description: String,
  difficulty: String,
  type: String,
  questionCount: Number
});

const typeLabel = computed(() => {
  const types = {
    term: 'Term',
    mcq: 'MCQ',
    match: 'Matching',
    flashcard: 'Flashcards',
    'fill-blank': 'Fill Blank',
    rearrange: 'Rearrange',
    compare: 'Comparison',
    audio: 'Listening'
  };
  return types[props.type] || props.type;
});
</script>

<style scoped>
.quiz-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.quiz-card:hover {
  transform: translateY(-5px);
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.quiz-type {
  background: #e0e7ff;
  color: #4f46e5;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.quiz-difficulty {
  font-size: 0.8rem;
  font-weight: 500;
}

.quiz-card.easy .quiz-difficulty {
  color: #10b981;
}

.quiz-card.medium .quiz-difficulty {
  color: #f59e0b;
}

.quiz-card.hard .quiz-difficulty {
  color: #ef4444;
}

.quiz-card h3 {
  color: #163b8d;
  margin-bottom: 0.5rem;
}

.quiz-card p {
  color: #6b7280;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.quiz-footer {
  font-size: 0.8rem;
  color: #9ca3af;
}
</style>