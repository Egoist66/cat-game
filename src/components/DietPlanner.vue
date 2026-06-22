<template>
  <div class="card diet-card">
    <h2>📋 Рацион котика</h2>

    <div class="diet-stats">
      <div class="diet-stat">
        <span>🍽️ Приёмов в день:</span>
        <b>{{ dietStore.sortedEntries.length }}</b>
      </div>
      <div class="diet-stat">
        <span>✅ Активных:</span>
        <b>{{ activeCount }}</b>
      </div>
      <div class="diet-stat" v-if="nextFeeding">
        <span>⏰ Следующий:</span>
        <b>{{ nextFeeding.time }} — {{ pastetyTypes[nextFeeding.pastetyKey]?.emoji }} {{ pastetyTypes[nextFeeding.pastetyKey]?.name }}</b>
      </div>
    </div>

    <div class="add-diet-row">
      <input type="time" v-model="newTime" />
      <select v-model="newPastetyKey">
        <option v-for="(t, key) in pastetyTypes" :key="key" :value="key">
          {{ t.emoji }} {{ t.name }} ({{ t.price }}💰)
        </option>
      </select>
      <input v-model="newLabel" placeholder="Метка (напр. 'Завтрак')" maxlength="30" />
      <button class="btn btn-green" @click="addDietEntry" :disabled="!newTime">
        ➕ Добавить
      </button>
    </div>

    <div class="diet-list" v-if="dietStore.sortedEntries.length > 0">
      <div
        v-for="entry in dietStore.sortedEntries"
        :key="entry.id"
        :class="['diet-entry', { disabled: !entry.enabled }]"
      >
        <span class="diet-time">{{ entry.time }}</span>
        <span class="diet-pastety">{{ pastetyTypes[entry.pastetyKey]?.emoji }} {{ pastetyTypes[entry.pastetyKey]?.name }}</span>
        <span class="diet-label" v-if="entry.label">{{ entry.label }}</span>
        <div class="diet-actions">
          <button
            class="btn-tiny"
            :class="entry.enabled ? 'btn-green' : 'btn-gold'"
            @click="dietStore.toggleEntry(entry.id)"
          >
            {{ entry.enabled ? '✅' : '⏸️' }}
          </button>
          <button class="btn-tiny btn-red" @click="removeEntry(entry.id)">🗑️</button>
        </div>
      </div>
    </div>
    <div v-else style="text-align:center;opacity:0.6;padding:20px;">
      Рацион пуст. Добавьте приёмы пищи! 🍽️
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDietStore } from '@/stores/dietStore'
import { useCatStore } from '@/stores/catStore'
import { useGameLogStore } from '@/stores/gameLogStore'
import { pastetyTypes } from '@/data/pastetyTypes'

const dietStore = useDietStore()
const catStore = useCatStore()
const logStore = useGameLogStore()

const newTime = ref('')
const newPastetyKey = ref('chicken')
const newLabel = ref('')

const royalReactions = [
  'ОО неужели расщедрился барин 👀',
  'Ничего себе, Роял Конин! Зажрался барин? 😼',
  'Ого, не ожидал! Роял Конин! Спасибо, барин! 💅',
  'Мяу?! Роял Конин? Ты точно не ошибся? 🤨',
  'Ну надо же, Роял Конин... А я уж думал, всю жизнь вискас жрать 😏',
]

function randomRoyalReaction(): string {
  return royalReactions[Math.floor(Math.random() * royalReactions.length)]
}

watch(newPastetyKey, (val) => {
  if (val === 'royal') {
    const msg = randomRoyalReaction()
    catStore.spawnFloatingEmoji('👑')
    logStore.add(`😼 ${catStore.cat.name}: ${msg}`)
  }
})

const activeCount = computed(() => dietStore.sortedEntries.filter(e => e.enabled).length)

const nextFeeding = computed(() => dietStore.getNextFeedingTime())

function addDietEntry() {
  if (!newTime.value) return
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
  dietStore.addEntry({
    id,
    time: newTime.value,
    pastetyKey: newPastetyKey.value,
    enabled: true,
    label: newLabel.value || '',
  })
  logStore.add(`📋 Добавлен приём пищи: ${newTime.value} — ${pastetyTypes[newPastetyKey.value].name}`)
  newTime.value = ''
  newLabel.value = ''
}

function removeEntry(id: string) {
  dietStore.removeEntry(id)
  logStore.add('🗑️ Приём пищи удалён из рациона')
}
</script>

<style scoped>
.diet-card {
  position: relative;
}

.diet-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px;
}

.diet-stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95em;
}

.diet-stat b {
  color: #ffd200;
}

.add-diet-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 15px;
  align-items: center;
}

.add-diet-row input[type="time"],
.add-diet-row select,
.add-diet-row input[type="text"] {
  padding: 8px 12px;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-family: inherit;
  outline: none;
  flex: 1 1 120px;
  min-width: 100px;
}

.add-diet-row input[type="time"] {
  flex: 0 1 110px;
  min-width: 90px;
}

.add-diet-row .btn {
  flex: 0 1 auto;
}

.add-diet-row select option {
  background: #333;
  color: white;
}

.add-diet-row input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.diet-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 300px;
  overflow-y: auto;
}

.diet-entry {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  transition: all 0.2s;
  border-left: 4px solid #56ab2f;
}

.diet-entry.disabled {
  opacity: 0.5;
  border-left-color: #666;
}

.diet-entry:hover {
  background: rgba(255, 255, 255, 0.14);
}

.diet-time {
  font-weight: bold;
  font-size: 1.2em;
  min-width: 60px;
  color: #ffd200;
}

.diet-pastety {
  flex: 1;
}

.diet-label {
  font-size: 0.85em;
  opacity: 0.7;
  font-style: italic;
}

.diet-actions {
  display: flex;
  gap: 4px;
}

.btn-tiny {
  border: none;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s;
}

.btn-green { background: linear-gradient(135deg, #56ab2f, #a8e063); color: white; }
.btn-gold { background: linear-gradient(135deg, #f7971e, #ffd200); color: #333; }
.btn-red { background: #e74c3c; color: white; }

.btn-tiny:hover {
  transform: scale(1.1);
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

.btn-green { background: linear-gradient(135deg, #56ab2f, #a8e063); }

@media (max-width: 480px) {
  .diet-stats {
    flex-direction: column;
    gap: 6px;
    padding: 8px;
  }

  .diet-stat {
    font-size: 0.85em;
  }

  .add-diet-row {
    gap: 6px;
  }

  .add-diet-row input,
  .add-diet-row select {
    flex: 1 1 100%;
    font-size: 0.85em;
    padding: 6px 10px;
  }

  .diet-entry {
    padding: 8px 10px;
    gap: 8px;
    flex-wrap: wrap;
  }

  .diet-time {
    font-size: 1em;
    min-width: 50px;
  }

  .diet-pastety {
    font-size: 0.9em;
  }

  .diet-label {
    font-size: 0.8em;
    width: 100%;
  }

  .btn {
    padding: 8px 14px;
    font-size: 0.85em;
    min-height: 38px;
  }
}
</style>
