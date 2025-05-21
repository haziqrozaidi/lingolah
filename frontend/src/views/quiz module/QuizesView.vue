<template>
  <div class="quizzes-page">
    <h1>Malay Language Quizzes</h1>
    <div class="quiz-grid">
      <!-- Beginner Level -->
      <div class="difficulty-section">
        <h2>Beginner Level</h2>
        <div class="quiz-cards">
          <QuizCard 
            title="Basic Greetings"
            description="Learn common Malay greetings"
            difficulty="easy"
            type="term"
            :question-count="8"
            @click="startQuiz('greetings')"
          />
          <QuizCard 
            title="Numbers 1-10"
            description="Match numbers to their Malay words"
            difficulty="easy"
            type="match"
            :question-count="5"
            @click="startQuiz('numbers')"
          />
          <QuizCard 
            title="Family Members"
            description="Identify family terms in Malay"
            difficulty="easy"
            type="mcq"
            :question-count="6"
            @click="startQuiz('family')"
          />
          <QuizCard 
            title="Common Objects"
            description="Basic everyday items vocabulary"
            difficulty="easy"
            type="flashcard"
            :question-count="10"
            @click="startQuiz('objects')"
          />
        </div>
      </div>

      <!-- Intermediate Level -->
      <div class="difficulty-section">
        <h2>Intermediate Level</h2>
        <div class="quiz-cards">
          <QuizCard 
            title="Food & Drinks"
            description="Malay food vocabulary"
            difficulty="medium"
            type="match"
            :question-count="8"
            @click="startQuiz('food')"
          />
          <QuizCard 
            title="Verb Conjugation"
            description="Practice common verb forms"
            difficulty="medium"
            type="mcq"
            :question-count="10"
            @click="startQuiz('verbs')"
          />
          <QuizCard 
            title="Time & Dates"
            description="Telling time and dates in Malay"
            difficulty="medium"
            type="term"
            :question-count="7"
            @click="startQuiz('time')"
          />
          <QuizCard 
            title="Shopping Phrases"
            description="Essential market vocabulary"
            difficulty="medium"
            type="fill-blank"
            :question-count="8"
            @click="startQuiz('shopping')"
          />
        </div>
      </div>

      <!-- Advanced Level -->
      <div class="difficulty-section">
        <h2>Advanced Level</h2>
        <div class="quiz-cards">
          <QuizCard 
            title="Idioms & Proverbs"
            description="Malay sayings and expressions"
            difficulty="hard"
            type="mcq"
            :question-count="12"
            @click="startQuiz('idioms')"
          />
          <QuizCard 
            title="Sentence Formation"
            description="Build proper Malay sentences"
            difficulty="hard"
            type="rearrange"
            :question-count="10"
            @click="startQuiz('sentences')"
          />
          <QuizCard 
            title="Dialect Comparison"
            description="Compare standard Malay with regional dialects"
            difficulty="hard"
            type="compare"
            :question-count="8"
            @click="startQuiz('dialects')"
          />
          <QuizCard 
            title="Listening Comprehension"
            description="Audio-based questions"
            difficulty="hard"
            type="audio"
            :question-count="6"
            @click="startQuiz('listening')"
          />
        </div>
      </div>
    </div>

    <!-- Quiz Modal -->
    <QuizModal 
      v-if="activeQuiz"
      :quiz-type="activeQuiz"
      @close="activeQuiz = null"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import QuizCard from '@/components/quiz/QuizCard.vue';
import QuizModal from '@/components/quiz/QuizModal.vue';

const activeQuiz = ref(null);

const startQuiz = (quizType) => {
  activeQuiz.value = quizType;
};
</script>

<style scoped>
.quizzes-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  color: #163b8d;
  margin-bottom: 2rem;
  font-size: 2.5rem;
}

.difficulty-section {
  margin-bottom: 3rem;
}

.difficulty-section h2 {
  color: #163b8d;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

.quiz-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.quiz-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .quiz-cards {
    grid-template-columns: 1fr;
  }
}
</style>