<template>
  <div class="card" style="grid-column: 1 / -1;">
    <div class="title-row">
      <h2>📜 Дневник котика</h2>
      <div class="log-actions">
        <span class="log-count">{{ logStore.entries.length }} записей</span>
        <button
          v-if="logStore.entries.length > 0"
          class="btn-tiny btn-red"
          @click="clearLog"
        >
          🗑️ Очистить
        </button>
      </div>
    </div>
    <div class="log" ref="logContainer">
      <div v-for="(entry, i) in logStore.entries" :key="i" class="log-entry">
        {{ entry }}
      </div>
      <div v-if="logStore.entries.length === 0" class="log-empty">
        Тут пока пусто... Позови котика кушать!
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useGameLogStore } from '@/stores/gameLogStore'
import { useModalStore } from '@/stores/modalStore'

const logStore = useGameLogStore()
const modalStore = useModalStore()
const logContainer = ref<HTMLElement | null>(null)

watch(
  () => logStore.entries.length,
  async () => {
    await nextTick()
    if (logContainer.value) {
      logContainer.value.scrollTop = 0
    }
  }
)

async function clearLog() {
  const ok = await modalStore.confirm({
    title: 'Очистить дневник?',
    message: 'Все записи будут удалены безвозвратно!',
    confirmText: 'Очистить',
    cancelText: 'Отмена',
    icon: '📜',
    danger: true,
  })
  if (ok) logStore.clear()
}
</script>

<style scoped>
.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

h2 {
  font-size: 1.4em;
}

.log-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.log-count {
  font-size: 0.85em;
  opacity: 0.6;
}

.log {
  max-height: 200px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 10px;
  font-size: 0.9em;
}

.log-entry {
  padding: 4px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  animation: slideIn 0.3s;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

.log-empty {
  text-align: center;
  opacity: 0.6;
  padding: 20px;
}

.btn-tiny {
  border: none;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85em;
  transition: all 0.2s;
}

.btn-red {
  background: #e74c3c;
  color: white;
}

.btn-tiny:hover {
  transform: scale(1.1);
}

@media (max-width: 480px) {
  .log {
    max-height: 150px;
    padding: 8px;
    font-size: 0.8em;
  }

  .log-entry {
    padding: 3px 0;
    font-size: 0.85em;
    line-height: 1.3;
  }
}
</style>
