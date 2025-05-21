<template>
  <div class="flashcard">
    <div class="term-section">
      <h2 class="label">Multiple Choice</h2>
      <div class="icon-row">
        <div class="icon-button" @click="toggleExpand">
          <i :class="'pi pi-sign-out'" class="text-lg"></i>
        </div>
        <div class="icon-button" @click="showReportPopup = true">
          <i :class="'pi pi-exclamation-triangle'" class="text-lg"></i>
        </div>
        <div class="icon-button" @click="toggleFavorite">
          <i :class="['pi pi-heart', { 'text-red-500': isFavorite }]" class="text-lg"></i>
        </div>
      </div>
    </div>

    <div class="translation-section">
      <div class="content">{{ term }}</div>
    </div>

    <div class="answer-section">
      <h2 class="answer-label">Select the correct term</h2>
      <div class="options-container">
        <div
          v-for="(option, index) in options"
          :key="index"
          class="option"
          :class="{ selected: selectedOption === index }"
          @click="selectOption(index)"
        >
          <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
          <span class="option-text">{{ option }}</span>
        </div>
      </div>
    </div>

    <!-- Report Question Popup -->
    <div v-if="showReportPopup" class="popup-overlay">
      <div class="report-popup">
        <div class="popup-header">
          <h3>Report Question</h3>
          <button @click="showReportPopup = false" class="close-btn">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <div class="popup-content">
          <div class="report-options">
            <div class="option" v-for="(option, index) in reportOptions" :key="index">
              <input
                type="radio"
                :id="'option-' + index"
                v-model="selectedReportOption"
                :value="option.value"
              />
              <label :for="'option-' + index">{{ option.label }}</label>
            </div>

            <div class="option" v-if="selectedReportOption === 'other'">
              <input type="radio" id="option-other" v-model="selectedReportOption" value="other" />
              <label for="option-other">Other:</label>
              <textarea
                v-model="customReportReason"
                placeholder="Please specify..."
                class="custom-reason-input"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="popup-footer">
          <button @click="submitReport" class="submit-btn" :disabled="!selectedReportOption">
            Submit Report
          </button>
          <button @click="showReportPopup = false" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlashcardComponent',
  props: {
    term: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: () => ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    },
  },
  data() {
    return {
      userAnswer: '',
      // options: ['was cooking', 'cooked', 'was cooking', 'had cooked'],
      selectedOption: null,
      showReportPopup: false,
      isFavorite: false,
      selectedReportOption: null,
      customReportReason: '',
      reportOptions: [
        { value: 'incorrect', label: 'Incorrect answer' },
        { value: 'typo', label: 'Typo in question' },
        { value: 'ambiguous', label: 'Question is ambiguous' },
        { value: 'duplicate', label: 'Duplicate question' },
        { value: 'other', label: 'Other reason' },
      ],
    }
  },
  methods: {
    selectOption(index) {
      this.selectedOption = index
      this.$emit('answer-selected', index)
    },
    toggleFavorite() {
      this.isFavorite = !this.isFavorite
      this.$emit('favorite-toggled', this.isFavorite)
    },

    submitReport() {
      const reportData = {
        option: this.selectedReportOption,
        customReason: this.customReportReason,
        timestamp: new Date().toISOString(),
      }

      this.$emit('question-reported', reportData)
      this.showReportPopup = false
      this.selectedReportOption = null
      this.customReportReason = ''

      // Show success message
      alert('Thank you for your report! We will review this question.')
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.cdnfonts.com/css/bw-modelica-ss01');
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
.flashcard {
  font-family: 'Poppins', sans-serif;
  max-width: 964px;
  height: 520px;
  margin: 20px 0px;
  padding: 33px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 800px;
}
.icon-row {
  display: flex;
  justify-content: space-between;
}

.term-section {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 18px;
  color: #163b8d;
}

.icon-button {
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
  margin-left: 10px;
}

.icon-button:hover {
  background-color: #e0e0e0;
}

.content {
  font-size: 32px;
  margin: 4rem 0px 5.85rem;
  align-content: center;
  color: #163b8d;

  /* height: 154px; */
}

.answer-section {
  margin-top: 145px;
}

.answer-label {
  font-size: 17px;
  color: #163b8d;
  font-weight: 600;
  margin-bottom: 1rem;
  font-family: 'Bw Modelica SS01', sans-serif;
}
.options-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.option {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option:hover {
  background-color: #f5f5f5;
}

.option.selected {
  border-color: #4a89dc;
  background-color: #f0f7ff;
}

.option-letter {
  font-weight: bold;
  margin-right: 15px;
  color: #4a89dc;
  width: 20px;
}

.option-text {
  flex-grow: 1;
}

/* Popup Styles */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.report-popup {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.popup-header {
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.popup-header h3 {
  margin: 0;
  font-size: 18px;
  color: #163b8d;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
}

.popup-content {
  padding: 20px;
}

.report-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.option label {
  cursor: pointer;
}

.custom-reason-input {
  width: 100%;
  margin-top: 8px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  min-height: 80px;
  font-family: inherit;
}

.popup-footer {
  padding: 16px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.submit-btn,
.cancel-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
}

.submit-btn {
  background-color: #163b8d;
  color: white;
  border: none;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.cancel-btn {
  background-color: white;
  border: 1px solid #ddd;
  color: #333;
}

.text-red-500 {
  color: #ef4444;
}
</style>
