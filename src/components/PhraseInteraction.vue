<template>
  <div class="card phrase-card">
    <h2>🗣️ Скажи котику</h2>
    <div class="phrase-input-row">
      <input
        v-model="userPhrase"
        @keyup.enter="sayPhrase"
        placeholder="Напиши что-нибудь котику..."
        maxlength="100"
      />
      <button class="btn btn-blue" @click="sayPhrase" :disabled="!userPhrase.trim()">
        💬 Сказать
      </button>
    </div>
    <div v-if="lastReaction" class="reaction-bubble">
      <span class="reaction-emoji">{{ lastReaction.emoji }}</span>
      <span class="reaction-text">{{ lastReaction.text }}</span>
    </div>
    <div v-if="lastEffects" class="effects-row">
      <span v-if="lastEffects.happy !== 0" :class="['effect', lastEffects.happy > 0 ? 'positive' : 'negative']">
        😸 {{ lastEffects.happy > 0 ? '+' : '' }}{{ lastEffects.happy }}
      </span>
      <span v-if="lastEffects.hunger !== 0" :class="['effect', lastEffects.hunger > 0 ? 'positive' : 'negative']">
        🍖 {{ lastEffects.hunger > 0 ? '+' : '' }}{{ lastEffects.hunger }}
      </span>
      <span v-if="lastEffects.murki !== 0" :class="['effect', lastEffects.murki > 0 ? 'positive' : 'negative']">
        💰 {{ lastEffects.murki > 0 ? '+' : '' }}{{ lastEffects.murki }}
      </span>
    </div>

    <details>
      <summary>⚙️ Управление фразами</summary>
      <div class="phrase-settings">
        <h3>📖 Стандартные реакции</h3>
        <div class="reactions-list">
          <div v-for="r in phraseStore.defaultReactions" :key="r.phrase" class="reaction-item builtin">
            <span class="reaction-item-emoji">{{ r.emoji }}</span>
            <span>"{{ r.phrase }}" → {{ r.reaction }}</span>
          </div>
        </div>

        <h3>➕ Добавить свою фразу</h3>
        <div class="add-phrase-form">
          <input v-model="newPhrase" placeholder="Фраза (напр. 'привет')" maxlength="50" />
          <input v-model="newReaction" placeholder="Реакция котика" maxlength="100" />
          <div class="effect-inputs">
            <label class="effect-slider">
              <span class="effect-label">😸 Счастье</span>
              <div class="slider-row">
                <input v-model.number="newHappy" type="range" min="-30" max="30" step="1" />
                <span class="slider-value" :class="newHappy >= 0 ? 'pos' : 'neg'">{{ newHappy > 0 ? '+' : '' }}{{ newHappy }}</span>
              </div>
            </label>
            <label class="effect-slider">
              <span class="effect-label">🍖 Сытость</span>
              <div class="slider-row">
                <input v-model.number="newHunger" type="range" min="-30" max="30" step="1" />
                <span class="slider-value" :class="newHunger >= 0 ? 'pos' : 'neg'">{{ newHunger > 0 ? '+' : '' }}{{ newHunger }}</span>
              </div>
            </label>
            <label class="effect-slider">
              <span class="effect-label">💰 Мурчалки</span>
              <div class="slider-row">
                <input v-model.number="newMurki" type="range" min="-30" max="30" step="1" />
                <span class="slider-value" :class="newMurki >= 0 ? 'pos' : 'neg'">{{ newMurki > 0 ? '+' : '' }}{{ newMurki }}</span>
              </div>
            </label>
          </div>
          <button class="btn btn-green" @click="addPhrase" :disabled="!newPhrase.trim() || !newReaction.trim()">
            ✅ Добавить
          </button>
        </div>

        <div v-if="phraseStore.customOnly.length > 0" class="custom-phrases">
          <h3>🗂️ Мои фразы</h3>
          <div v-for="(r, i) in phraseStore.customOnly" :key="i" class="reaction-item custom">
            <span class="reaction-item-emoji">{{ r.emoji }}</span>
            <span>"{{ r.phrase }}" → {{ r.reaction }}</span>
            <button class="btn-small btn-red" @click="removePhrase(i)">✕</button>
          </div>
        </div>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import { usePhraseStore } from '@/stores/phraseStore'
import { usePhraseInteractions } from '@/composables/usePhraseInteractions'

const phraseStore = usePhraseStore()
const {
  userPhrase, lastReaction, lastEffects,
  newPhrase, newReaction, newHappy, newHunger, newMurki,
  sayPhrase, addPhrase, removePhrase,
} = usePhraseInteractions()
</script>

<style scoped>
.phrase-card {
  position: relative;
}

.phrase-input-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.phrase-input-row input {
  flex: 1;
  padding: 10px 14px;
  border-radius: 15px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-family: inherit;
  font-size: 1em;
  outline: none;
}

.phrase-input-row input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.phrase-input-row input:focus {
  border-color: #6dd5ed;
}

.reaction-bubble {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 12px 18px;
  margin: 10px 0;
  animation: popIn 0.3s ease-out;
}

@keyframes popIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.reaction-emoji {
  font-size: 2.5em;
}

.reaction-text {
  font-size: 1.1em;
  font-style: italic;
}

.effects-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.effect {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.9em;
  font-weight: bold;
  animation: popIn 0.3s;
}

.effect.positive {
  background: rgba(86, 171, 47, 0.4);
  color: #a8e063;
}

.effect.negative {
  background: rgba(255, 107, 107, 0.4);
  color: #ff6b6b;
}

details {
  margin-top: 10px;
}

details summary {
  cursor: pointer;
  font-size: 0.95em;
  opacity: 0.8;
  padding: 5px;
  border-radius: 8px;
  user-select: none;
}

details summary:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.05);
}

.phrase-settings {
  margin-top: 15px;
}

.phrase-settings h3 {
  font-size: 1.1em;
  margin: 15px 0 10px;
  opacity: 0.9;
}

.reactions-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 200px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  padding: 10px;
}

.reaction-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.9em;
}

.reaction-item.builtin {
  background: rgba(255, 255, 255, 0.05);
}

.reaction-item.custom {
  background: rgba(109, 213, 237, 0.15);
}

.reaction-item-emoji {
  font-size: 1.5em;
}

.add-phrase-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  padding: 12px;
  border-radius: 12px;
}

.add-phrase-form input {
  padding: 8px 12px;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-family: inherit;
  outline: none;
}

.add-phrase-form input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.effect-inputs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.effect-slider {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.effect-label {
  font-size: 0.85em;
  opacity: 0.85;
}

.slider-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 0;
}

.slider-row input[type="range"] {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, #ff6b6b, #666 50%, #56ab2f);
  outline: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.slider-row input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: 3px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.15s;
}

.slider-row input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.slider-row input[type="range"]::-moz-range-thumb {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: 3px solid rgba(255, 255, 255, 0.4);
}

.slider-value {
  min-width: 40px;
  text-align: center;
  font-weight: bold;
  font-size: 1.1em;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.2);
}

.slider-value.pos {
  color: #a8e063;
}

.slider-value.neg {
  color: #ff6b6b;
}

.custom-phrases {
  margin-top: 10px;
}

.btn-small {
  border: none;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85em;
  font-weight: bold;
  transition: all 0.2s;
}

.btn-red {
  background: #e74c3c;
  color: white;
}

.btn-red:hover {
  background: #c0392b;
}

.btn-blue {
  background: linear-gradient(135deg, #2193b0, #6dd5ed);
}

.btn-green {
  background: linear-gradient(135deg, #56ab2f, #a8e063);
}

.btn {
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
  white-space: nowrap;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .phrase-input-row input {
    font-size: 0.9em;
    padding: 8px 10px;
  }

  .reaction-emoji {
    font-size: 2em;
  }

  .reaction-text {
    font-size: 0.95em;
  }

  .reactions-list {
    max-height: 140px;
  }

  .effect-inputs {
    gap: 6px;
  }

  .slider-row input[type="range"] {
    height: 10px;
  }

  .slider-row input[type="range"]::-webkit-slider-thumb {
    width: 24px;
    height: 24px;
  }

  .slider-value {
    min-width: 32px;
    font-size: 0.95em;
  }

  .effect-label {
    font-size: 0.8em;
  }

  .add-phrase-form {
    padding: 8px;
  }

  .add-phrase-form input {
    font-size: 0.85em;
    padding: 6px 10px;
  }

  .btn {
    padding: 8px 14px;
    font-size: 0.85em;
    min-height: 38px;
  }
}
</style>
