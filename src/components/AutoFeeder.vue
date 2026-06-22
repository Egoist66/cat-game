<template>
  <div class="card auto-feeder-card">
    <h2>🤖 Автокормушка</h2>
    <div class="feeder-status">
      <span :class="['status-dot', autoFeedEnabled ? 'active' : 'inactive']"></span>
      <span>{{ autoFeedEnabled ? '🟢 Активна' : '🔴 Отключена' }}</span>
    </div>
    <div class="feeder-controls">
      <button
        class="btn"
        :class="autoFeedEnabled ? 'btn-red' : 'btn-green'"
        @click="toggleAutoFeed"
      >
        {{ autoFeedEnabled ? '⏹ Выключить' : '▶ Включить' }}
      </button>
    </div>
    <div v-if="autoFeedEnabled && nextMeal" class="next-meal-info">
      ⏰ Следующее кормление: <b>{{ nextMeal.time }}</b>
      {{ pastetyTypes[nextMeal.pastetyKey]?.emoji }}
    </div>
    <div v-if="autoFeedEnabled && !nextMeal" class="next-meal-info warning">
      ⚠️ В расписании нет активных приёмов пищи
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDietStore } from '@/stores/dietStore'
import { useCatStore } from '@/stores/catStore'
import { useGameLogStore } from '@/stores/gameLogStore'
import { useModalStore } from '@/stores/modalStore'
import { pastetyTypes } from '@/data/pastetyTypes'

const dietStore = useDietStore()
const catStore = useCatStore()
const logStore = useGameLogStore()
const modalStore = useModalStore()

const autoFeedEnabled = computed(() => dietStore.autoFeedEnabled)

const nextMeal = computed(() => dietStore.getNextFeedingTime())

async function toggleAutoFeed() {
  if (dietStore.autoFeedEnabled) {
    dietStore.toggleAutoFeed()
    logStore.add('🤖 Автокормушка выключена')
    return
  }

  if (dietStore.sortedEntries.length === 0) {
    const ok = await modalStore.confirm({
      title: 'Нет расписания',
      message: 'Сначала добавь приёмы пищи в разделе "Рацион котика"!',
      confirmText: 'OK',
      cancelText: '',
      icon: '📋',
    })
    return
  }

  dietStore.toggleAutoFeed()
  logStore.add('🤖 Автокормушка включена! Котик будет накормлен по расписанию')
}
</script>

<style scoped>
.auto-feeder-card {
  position: relative;
}

.feeder-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px 0;
  font-size: 1.1em;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-dot.active {
  background: #56ab2f;
  box-shadow: 0 0 10px #56ab2f;
  animation: pulse 1.5s infinite;
}

.status-dot.inactive {
  background: #666;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 5px #56ab2f; }
  50% { box-shadow: 0 0 15px #56ab2f; }
}

.feeder-controls {
  margin: 10px 0;
}

.next-meal-info {
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 0.95em;
  margin-top: 10px;
}

.next-meal-info.warning {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
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
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.btn-green { background: linear-gradient(135deg, #56ab2f, #a8e063); }
.btn-red { background: linear-gradient(135deg, #e74c3c, #c0392b); }

@media (max-width: 480px) {
  .feeder-status {
    font-size: 0.95em;
  }

  .next-meal-info {
    font-size: 0.85em;
    padding: 6px 10px;
  }

  .btn {
    padding: 8px 16px;
    font-size: 0.85em;
    min-height: 38px;
  }
}
</style>
