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
          🍖 Сытость: {{ Math.round(catStore.cat.hunger) }}%
        </div>
      </div>
      <div class="bar-wrap">
        <div class="bar-fill bar-happy" :style="{ width: catStore.cat.happy + '%' }">
          😸 Счастье: {{ Math.round(catStore.cat.happy) }}%
        </div>
      </div>
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
  </div>
</template>

<script setup lang="ts">
import { useCatStore } from '@/stores/catStore'
import { useCatInteractions } from '@/composables/useCatInteractions'

const catStore = useCatStore()
const {
  showTooltip, isTyping,
  handlePet, handleFeed, handlePlay, toggleSleep,
  onHover, onLeave, handleReset, handleSave,
  saveStatus,
} = useCatInteractions()
</script>

<style scoped>
.cat-zone {
  text-align: center;
  grid-column: 1 / -1;
  position: relative;
  overflow: hidden;
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
  max-width: 400px;
  margin: 0 auto;
}

.bar-wrap {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  height: 25px;
  overflow: hidden;
  position: relative;
}

.bar-fill {
  height: 100%;
  transition: width 0.5s ease;
  display: flex;
  align-items: center;
  padding-left: 10px;
  font-weight: bold;
  font-size: 0.9em;
}

.bar-hunger { background: linear-gradient(90deg, #ff6b6b, #feca57); }
.bar-happy { background: linear-gradient(90deg, #48dbfb, #0abde3); }

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

  .tooltip {
    font-size: 0.15em;
    top: -22px;
    padding: 3px 10px;
  }
}
</style>
