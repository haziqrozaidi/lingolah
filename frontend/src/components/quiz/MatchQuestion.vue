<template>
  <div class="flashcard">
    <!-- Main flashcard content -->
    <div class="term-section">
      <h2 class="label">Match</h2>
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

    <div class="matching-container">
      <div class="columns-container">
        <!-- Left Column -->
        <div class="column left-column">
          <div
            v-for="(leftItem, index) in leftItems"
            :key="'left-' + index"
            class="match-item"
            :class="{
              selected: selectedLeft === index,
              matched: leftMatches[index] !== null,
            }"
            :style="getMatchStyle(index, 'left')"
            @click="selectLeft(index)"
          >
            {{ leftItem }}
          </div>
        </div>

        <!-- Right Column -->
        <div class="column right-column">
          <div
            v-for="(rightItem, index) in rightItems"
            :key="'right-' + index"
            class="match-item"
            :class="{
              selected: selectedRight === index,
              matched: rightMatches.includes(index),
            }"
            :style="getMatchStyle(index, 'right')"
            @click="selectRight(index)"
          >
            {{ rightItem }}
          </div>
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
  name: 'MatchingFlashcard',
  props: {
    leftItems: {
      type: Array,
      required: true,
    },
    rightItems: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // leftItems: ['was cooking', 'was cooking', 'was cooking', 'was cooking'],
      // rightItems: ['cooked', 'cooked', 'cooked', 'had cooked'],
      selectedLeft: null,
      selectedRight: null,
      leftMatches: Array(4).fill(null),
      rightMatches: [],
      matchColors: [
        '#FFCE6B',
        '#4ECDC4',
        '#45B7D1',
        '#A37EBD',
        '#FFFB7A',
        '#98D8C8',
        '#F06292',
        '#7986CB',
      ],
      currentMatches: {},
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
    selectLeft(index) {
      if (this.leftMatches[index] !== null) return

      this.selectedLeft = index
      this.selectedRight = null

      if (this.selectedLeft !== null && this.selectedRight !== null) {
        this.createMatch()
      }
    },
    selectRight(index) {
      if (this.rightMatches.includes(index)) return

      this.selectedRight = index

      if (this.selectedLeft !== null && this.selectedRight !== null) {
        this.createMatch()
      }
    },
    createMatch() {
      const matchId = `${this.selectedLeft}-${this.selectedRight}`
      const colorIndex = Object.keys(this.currentMatches).length % this.matchColors.length

      this.currentMatches[matchId] = this.matchColors[colorIndex]
      this.leftMatches[this.selectedLeft] = this.selectedRight
      this.rightMatches.push(this.selectedRight)

      this.selectedLeft = null
      this.selectedRight = null
    },
    getMatchStyle(index, side) {
      if (side === 'left' && this.leftMatches[index] !== null) {
        const matchId = `${index}-${this.leftMatches[index]}`
        return {
          backgroundColor: `${this.currentMatches[matchId]}20`,
          borderLeft: `4px solid ${this.currentMatches[matchId]}`,
          borderColor: this.currentMatches[matchId],
        }
      }
      if (side === 'right' && this.rightMatches.includes(index)) {
        const matchId = Object.keys(this.currentMatches).find((key) => key.endsWith(`-${index}`))
        if (matchId) {
          return {
            backgroundColor: `${this.currentMatches[matchId]}20`,
            borderRight: `4px solid ${this.currentMatches[matchId]}`,
            borderColor: this.currentMatches[matchId],
          }
        }
      }
      return {}
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

.matching-container {
  margin-top: 2rem;
  height: calc(100% - 100px);
  display: flex;
  flex-direction: column;
}

.columns-container {
  display: flex;
  gap: 40px;
  height: 100%;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.match-item {
  padding: 15px 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  color: #163b8d;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.match-item:hover {
  background-color: #f5f5f5;
}

.match-item.selected {
  border-color: #4a89dc;
  background-color: #f0f7ff;
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
