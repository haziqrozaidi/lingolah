<template>
  <div class="card">
    <h1>Questions</h1>
    <div class="grid-container">
      <div v-for="n in visibleNumbers" :key="n" class="grid-item" @click="goTo">
        {{ n }}
      </div>
    </div>
    <div v-if="questionNumber > initialCount" class="expand-button" @click="toggleExpand">
      <i :class="isExpanded ? 'pi pi-angle-up' : 'pi pi-angle-down'" class="text-lg"></i>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'ExpandableQuestionsGrid',
  props: {
    goTo: {
      type: Function,
      required: true,
    },
    questionNumber: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isExpanded: false,
    }
  },
  computed: {
    visibleNumbers() {
      return this.isExpanded
        ? Array.from({ length: this.questionNumber }, (_, i) => i + 1)
        : Array.from({ length: this.initialCount }, (_, i) => i + 1)
    },
    initialCount() {
      return Math.min(this.questionNumber, 12)
    },
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded
      $('.card').toggleClass('expanded')
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.card {
  font-family: Arial, sans-serif;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 18px;
  max-width: 320px;
  min-width: 300px;
  max-height: 250px;
  margin: 0 auto;
  padding-bottom: 40px; /* Space for button */
  position: sticky;
  top: 20px;
}

.card.expanded {
  max-height: fit-content;
  /* background-color: black; */
}

.card h1 {
  font-size: 18px;
  margin-bottom: 16px;
  text-align: center;
  color: #163b8d;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-style: normal;
  line-height: 1.5;
  max-height: 26px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  row-gap: 16px;
  column-gap: 38px;
  margin-bottom: 15px;
  align-self: center;
  justify-items: center;
  max-width: fit-content;
}

.grid-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid #2563eb;
  color: #2563eb;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
}
.grid-item:hover {
  background-color: #e0e0e0;
}

.expand-button {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  width: 38px;
  height: 38px;
  color: #2563eb;
}

.expand-button:hover {
  background-color: #e0e0e0;
}


</style>
