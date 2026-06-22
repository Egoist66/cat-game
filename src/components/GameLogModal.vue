<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-content card">
      <div class="modal-header">
        <h2>📜 Дневник котика</h2>
        <button class="close-btn" @click="close">✕</button>
      </div>
      <div class="log-entries" ref="logRef">
        <div v-if="logStore.entries.length === 0" class="empty-log">
          Пока ничего не произошло...
        </div>
        <div v-for="(entry, i) in logStore.entries" :key="i" class="log-entry">
          {{ entry }}
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-small" @click="clearLog">🗑️ Очистить</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useGameLogStore } from '@/stores/gameLogStore'

const logStore = useGameLogStore()
const logRef = ref<HTMLElement | null>(null)

defineProps<{ visible: boolean }>()
const emit = defineEmits<{ close: [] }>()

function close() {
  emit('close')
}

function clearLog() {
  logStore.clear()
}

watch(() => logStore.entries.length, () => {
  if (logRef.value) {
    logRef.value.scrollTop = logRef.value.scrollHeight
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s;
}

.modal-content {
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  font-size: 1.4em;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.log-entries {
  flex: 1;
  overflow-y: auto;
  max-height: 50vh;
  padding: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  scroll-behavior: smooth;
}

.empty-log {
  text-align: center;
  opacity: 0.6;
  padding: 30px;
}

.log-entry {
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.95em;
  line-height: 1.4;
}

.log-entry:last-child {
  border-bottom: none;
}

.modal-footer {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
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

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.btn-small {
  padding: 6px 14px;
  font-size: 0.85em;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

h2 {
  font-size: 1.3em;
}

@media (max-width: 480px) {
  .modal-content {
    width: 95%;
    max-height: 90vh;
  }

  .log-entries {
    max-height: 60vh;
  }
}
</style>
