<template>
  <div class="cat-zone card">
    <div
      :class="[
        'cat-emoji',
        {
          eating: catStore.action === 'eating',
          sleeping: catStore.action === 'sleeping',
          sad: catStore.mood === 'sad' && !catStore.temporaryEmoji,
          playing: catStore.action === 'playing',
          angry: catStore.catEmoji === '😾' || catStore.catEmoji === '😤',
          love: catStore.catEmoji === '😻',
          hungry: catStore.catEmoji === '😿',
          confused: catStore.catEmoji === '😼',
          temporary: !!catStore.temporaryEmoji,
        }
      ]"
      @click="handlePet"
      @mouseenter="onHover"
      @mouseleave="onLeave"
    >
      {{ catStore.catEmoji }}
      <div v-if="showTooltip && catStore.action === 'idle'" class="tooltip">Погладь меня!</div>
      <div v-if="showTooltip && catStore.catEmoji === '😾'" class="tooltip angry-tip">Ой, зря ты так...</div>
      <div v-if="showTooltip && catStore.catEmoji === '😻'" class="tooltip love-tip">Муррр, ещё!</div>
    </div>
    <div class="cat-name">
      <input v-model="catStore.cat.name" placeholder="Имя котика" maxlength="20">
      <span v-if="isTyping" class="typing-indicator">✏️</span>
    </div>
    <div class="mood-text">{{ catStore.moodText }}</div>

    <div class="bars">
      <div class="bar-wrap">
        <div class="bar-fill bar-hunger" :style="{ width: catStore.cat.hunger + '%' }">
          <span class="bar-label">Сытость: {{ Math.round(catStore.cat.hunger) }}%</span>
          <span class="bar-icon">🍖</span>
        </div>
      </div>
      <div class="bar-wrap">
        <div class="bar-fill bar-happy" :style="{ width: catStore.cat.happy + '%' }">
          <span class="bar-label">Счастье: {{ Math.round(catStore.cat.happy) }}%</span>
          <span class="bar-icon">😸</span>
        </div>
      </div>
      <div class="bar-wrap">
        <div class="bar-fill bar-thirst" :style="{ width: catStore.thirst + '%' }">
          <span class="bar-label">Жажда: {{ Math.round(catStore.thirst) }}%</span>
          <span class="bar-icon">💧</span>
        </div>
      </div>
    </div>

    <div class="weight-indicator">
      <span :class="weightClass">{{ statusIcon }} {{ catStore.cat.name }} — {{ statusLabel }}</span>
    </div>

    <div class="action-indicator" v-if="catStore.action !== 'idle'">
      <span v-if="catStore.action === 'eating'">😼 {{ catStore.cat.name }} уплетает за обе щеки!</span>
      <span v-if="catStore.action === 'sleeping'">😽 {{ catStore.cat.name }} спит...</span>
      <span v-if="catStore.action === 'playing'">🎾 {{ catStore.cat.name }} играет!</span>
      <span v-if="catStore.action === 'walking'">🚶 {{ catStore.cat.name }} гуляет...</span>
    </div>

    <div class="currency">
      💰 Мурчалки: <b>{{ Math.floor(catStore.murki) }}</b>
      <span v-if="catStore.murkiPerSec > 0" class="murki-rate">(+{{ catStore.murkiPerSec.toFixed(1) }}/сек)</span>
    </div>

    <div class="btn-group">
      <button class="btn" @click="handleFeed" :disabled="catStore.isEating || catStore.totalPastety === 0">
        🍽️ Позвать {{ catStore.cat.name }} кушать!
      </button>
      <button class="btn btn-blue" @click="handlePet">🤚 Погладить</button>
      <button class="btn btn-cyan" @click="handleWater">💧 Водички</button>
      <button class="btn btn-green" @click="handlePlay" :disabled="catStore.isEating || catStore.action === 'sleeping'">
        🎾 Играть
      </button>
      <button
        class="btn"
        :class="catStore.action === 'sleeping' ? 'btn-gold' : 'btn-purple'"
        @click="toggleSleep"
      >
        {{ catStore.action === 'sleeping' ? '🌅 Разбудить' : '😽 Спать' }}
      </button>
      <button class="btn btn-gold" @click="handleReset">🔄 Начать заново</button>
      <button class="btn btn-save" @click="handleSave" title="Сохранить игру">💾</button>
    </div>
    <div class="save-indicator" v-if="saveStatus !== 'idle'">
      <span :class="['save-badge', saveStatus]">
        {{ saveStatus === 'saved' ? '💾 Сохранено!' : '📂 Загружено!' }}
      </span>
    </div>

    <div class="floating-container">
      <div
        v-for="emoji in catStore.floatingEmojis"
        :key="emoji.id"
        class="floating-pasta"
        :style="{ left: emoji.x + '%', top: emoji.y + '%' }"
      >
        {{ emoji.emoji }}
      </div>
    </div>

    <teleport to="body">
      <div v-if="catStore.actionFlash" class="action-flash-overlay">
        <div class="action-flash-content">
          <span class="action-flash-emoji">{{ catStore.actionFlash.emoji }}</span>
          <span class="action-flash-text">{{ catStore.actionFlash.text }}</span>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCatStore } from '@/stores/catStore'
import { useCatInteractions } from '@/composables/useCatInteractions'
import { useGameLogStore } from '@/stores/gameLogStore'

const catStore = useCatStore()
const logStore = useGameLogStore()
const {
  showTooltip, isTyping,
  handlePet, handleFeed, handlePlay, toggleSleep,
  onHover, onLeave, handleReset, handleSave,
  saveStatus,
} = useCatInteractions()

const statusLabel = computed(() => {
  const h = catStore.cat.hunger
  const ha = catStore.cat.happy
  const t = catStore.thirst
  const w = catStore.weight

  if (h < 15 && t < 15) return 'критическое состояние! 🆘'
  if (h < 15) return 'умирает с голоду! 🍖😿'
  if (t < 15) return 'хочет пить! 😿'
  if (ha < 15) return 'глубоко несчастен... 💔'
  if (h < 30 && t < 30) return 'голоден и хочет пить 😓'
  if (h < 30) return 'хочет кушать 🍖'
  if (t < 30) return 'хотел бы водички 😿'
  if (ha >= 80 && h >= 70 && t >= 70) return 'абсолютно счастлив! 💖✨'
  if (ha >= 60 && h >= 50) return 'доволен жизнью 😊'

  if (w >= 80) return 'толстенький 🐷'
  if (w >= 60) return 'упитанный 🐱'
  if (w >= 40) return 'стройный 🐈'
  if (w >= 20) return 'худенький 🐈‍⬛'
  return 'дистрофик 😿'
})

const statusIcon = computed(() => {
  const h = catStore.cat.hunger
  const ha = catStore.cat.happy
  const t = catStore.thirst
  const w = catStore.weight

  if (h < 15 && t < 15) return '🆘'
  if (h < 15) return '🍖'
  if (t < 15) return '😿'
  if (ha < 15) return '💔'
  if (ha >= 80 && h >= 70 && t >= 70) return '💖'
  if (w >= 80) return '🐷'
  if (w >= 60) return '🐱'
  if (w >= 40) return '🐈'
  return '🐈‍⬛'
})

const weightClass = computed(() => {
  if (catStore.weight >= 80) return 'weight-fat'
  if (catStore.weight <= 20) return 'weight-thin'
  return ''
})

function handleWater() {
  const msg = catStore.drinkWater()
  logStore.add(msg)
}
</script>

<style scoped>
.cat-zone {
  text-align: center;
  grid-column: 1 / -1;
  position: relative;
  overflow: hidden;
  padding: 28px 24px;
  margin-bottom: 6px;
}

.cat-emoji {
  font-size: 8em;
  display: inline-block;
  animation: wiggle 1.5s infinite;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));
  cursor: pointer;
  transition: transform 0.2s, filter 0.3s;
  position: relative;
}

.cat-emoji:hover {
  transform: scale(1.15);
  filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.8));
}

.cat-emoji.eating {
  animation: munch 0.3s infinite;
}

.cat-emoji.sad {
  animation: shake 0.5s infinite;
  filter: grayscale(0.5);
}

.cat-emoji.sleeping {
  animation: sleep 3s infinite ease-in-out;
}

.cat-emoji.playing {
  animation: play 0.4s infinite alternate;
}

.cat-emoji.angry {
  animation: angry 0.3s infinite;
}

.cat-emoji.love {
  animation: love 0.6s infinite alternate;
  filter: drop-shadow(0 0 30px rgba(255, 105, 180, 0.7));
}

.cat-emoji.hungry {
  animation: hungry 1s infinite;
}

.cat-emoji.confused {
  animation: confused 0.5s infinite;
}

.cat-emoji.temporary {
  animation: popIn 0.3s ease-out;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}

@keyframes munch {
  0%, 100% { transform: scale(1) rotate(0); }
  50% { transform: scale(1.15) rotate(-5deg); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}

@keyframes sleep {
  0%, 100% { transform: scale(1) translateY(0); }
  50% { transform: scale(0.95) translateY(5px); }
}

@keyframes play {
  from { transform: translateX(-10px) rotate(-5deg); }
  to { transform: translateX(10px) rotate(5deg); }
}

@keyframes angry {
  0%, 100% { transform: translateY(0) rotate(0); }
  25% { transform: translateY(-5px) rotate(-10deg); }
  75% { transform: translateY(-5px) rotate(10deg); }
}

@keyframes love {
  from { transform: scale(1) rotate(-3deg); }
  to { transform: scale(1.1) rotate(3deg); }
}

@keyframes hungry {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

@keyframes confused {
  0%, 100% { transform: rotate(0); }
  33% { transform: rotate(-10deg); }
  66% { transform: rotate(10deg); }
}

@keyframes popIn {
  from { transform: scale(0.5); opacity: 0.5; }
  to { transform: scale(1); opacity: 1; }
}

.tooltip {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 14px;
  border-radius: 10px;
  font-size: 0.2em;
  white-space: nowrap;
  pointer-events: none;
  animation: fadeIn 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.tooltip.angry-tip {
  background: rgba(255, 70, 70, 0.85);
  border-color: #ff6b6b;
}

.tooltip.love-tip {
  background: rgba(255, 105, 180, 0.85);
  border-color: #ff6bb5;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-50%) translateY(5px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

.cat-name {
  font-size: 1.8em;
  margin: 10px 0;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.cat-name input {
  background: transparent;
  border: none;
  border-bottom: 2px dashed rgba(255, 255, 255, 0.4);
  color: white;
  font-size: 1em;
  font-weight: bold;
  text-align: center;
  font-family: inherit;
  outline: none;
  width: 100%;
  max-width: 260px;
  min-width: 120px;
}

.cat-name input:focus {
  border-bottom-color: gold;
}

.typing-indicator {
  font-size: 0.5em;
  animation: pulse 0.6s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.mood-text {
  font-size: 1.2em;
  font-style: italic;
  margin-bottom: 15px;
  min-height: 30px;
}

.bars {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 480px;
  margin: 0 auto;
}

.bar-wrap {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  height: 40px;
  overflow: hidden;
  position: relative;
}

.bar-fill {
  height: 100%;
  transition: width 0.5s ease;
  display: flex;
  align-items: center;
  padding: 0 14px;
  font-weight: bold;
  font-size: 0.95em;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
  min-width: 0;
}

.bar-label {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bar-icon {
  flex-shrink: 0;
  margin-left: auto;
  font-size: 1.3em;
  line-height: 1;
}

.bar-hunger { background: linear-gradient(90deg, #ff6b6b, #feca57); }
.bar-happy { background: linear-gradient(90deg, #48dbfb, #0abde3); }
.bar-thirst { background: linear-gradient(90deg, #74b9ff, #0984e3); }

.weight-indicator {
  text-align: center;
  font-size: 1em;
  margin: 6px 0;
  opacity: 0.85;
}

.weight-indicator .weight-fat {
  color: #feca57;
}

.weight-indicator .weight-thin {
  color: #ff6b6b;
}

.action-indicator {
  margin: 8px 0;
  font-size: 1.1em;
  animation: fadeIn 0.3s;
}

.currency {
  font-size: 1.5em;
  text-align: center;
  margin: 10px 0;
  padding: 10px;
  background: rgba(255, 215, 0, 0.2);
  border-radius: 15px;
  border: 2px solid gold;
}

.murki-rate {
  font-size: 0.7em;
  opacity: 0.8;
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 15px;
}

.btn {
  background: linear-gradient(135deg, #ff6b9d, #c44569);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  font-family: inherit;
}

.btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.btn:active:not(:disabled) { transform: translateY(0); }

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-blue { background: linear-gradient(135deg, #2193b0, #6dd5ed); }
.btn-green { background: linear-gradient(135deg, #56ab2f, #a8e063); }
.btn-cyan { background: linear-gradient(135deg, #0984e3, #74b9ff); }
.btn-gold { background: linear-gradient(135deg, #f7971e, #ffd200); color: #333; }
.btn-purple { background: linear-gradient(135deg, #9b59b6, #8e44ad); }
.btn-save {
  background: linear-gradient(135deg, #4a90d9, #357abd);
  padding: 10px 14px;
  font-size: 1.2em;
}

.save-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 20;
}

.save-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: bold;
  animation: popIn 0.3s ease-out;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.save-badge.saved {
  color: #a8e063;
  border-color: #56ab2f;
}

.save-badge.loaded {
  color: #6dd5ed;
  border-color: #2193b0;
}

@keyframes popIn {
  from { transform: scale(0.7); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.floating-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.floating-pasta {
  position: absolute;
  font-size: 3em;
  pointer-events: none;
  animation: floatUp 1.5s forwards;
}

@keyframes floatUp {
  0% { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(-200px) scale(0.3); }
}

.action-flash-overlay {
  position: fixed;
  top: 0;
  right: 0;
  pointer-events: none;
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 80px 20px 0 0;
  animation: flashSlide 0.4s ease-out;
}

.action-flash-content {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  padding: 14px 24px 14px 18px;
  border-radius: 18px;
  border: 2px solid rgba(255, 255, 255, 0.25);
  animation: flashPop 0.5s ease-out;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.action-flash-emoji {
  font-size: 2.8em;
  animation: flashBounce 0.6s ease-out;
  line-height: 1;
}

.action-flash-text {
  font-size: 1.05em;
  font-weight: bold;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.4);
  white-space: nowrap;
}

@keyframes flashSlide {
  from { transform: translateX(120px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes flashPop {
  from { transform: scale(0.7); opacity: 0; }
  60% { transform: scale(1.05); }
  to { transform: scale(1); opacity: 1; }
}

@keyframes flashBounce {
  0% { transform: scale(0) rotate(-15deg); }
  60% { transform: scale(1.2) rotate(5deg); }
  100% { transform: scale(1) rotate(0); }
}

@media (max-width: 480px) {
  .cat-emoji {
    font-size: 5em;
  }

  .cat-name {
    font-size: 1.3em;
  }

  .cat-name input {
    font-size: 0.9em;
    max-width: 160px;
  }

  .mood-text {
    font-size: 1em;
  }

  .currency {
    font-size: 1.2em;
    padding: 8px;
  }

  .btn {
    padding: 8px 14px;
    font-size: 0.85em;
    min-height: 38px;
  }

  .btn-group {
    gap: 6px;
  }

  .bars {
    max-width: 100%;
  }

  .bar-wrap {
    height: 40px;
  }

  .bar-fill {
    font-size: 0.85em;
    padding: 0 10px;
  }

  .bar-icon {
    font-size: 1.15em;
  }

  .tooltip {
    font-size: 0.15em;
    top: -22px;
    padding: 3px 10px;
  }
}
</style>
