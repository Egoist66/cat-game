<template>
  <Teleport to="body">
    <div v-if="modalStore.confirmVisible" class="confirm-overlay" @click.self="cancel">
      <div class="confirm-dialog" :class="{ danger: modalStore.confirmOptions.danger }">
        <div class="confirm-icon">{{ modalStore.confirmOptions.icon }}</div>
        <h3 class="confirm-title">{{ modalStore.confirmOptions.title }}</h3>
        <p class="confirm-message">{{ modalStore.confirmOptions.message }}</p>
        <div class="confirm-actions">
          <button class="btn btn-cancel" @click="cancel">
            {{ modalStore.confirmOptions.cancelText || 'Нет' }}
          </button>
          <button
            class="btn"
            :class="modalStore.confirmOptions.danger ? 'btn-danger' : 'btn-confirm'"
            @click="ok"
          >
            {{ modalStore.confirmOptions.confirmText || 'Да' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useModalStore } from '@/stores/modalStore'

const modalStore = useModalStore()

function ok() {
  modalStore.resolveConfirm(true)
}

function cancel() {
  modalStore.resolveConfirm(false)
}
</script>

<style scoped>
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeOverlay 0.2s;
}

@keyframes fadeOverlay {
  from { opacity: 0; }
  to { opacity: 1; }
}

.confirm-dialog {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  padding: 30px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  animation: popIn 0.3s ease-out;
}

@keyframes popIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.confirm-dialog.danger {
  border-color: #ff6b6b;
  box-shadow: 0 20px 60px rgba(255, 107, 107, 0.3);
}

.confirm-icon {
  font-size: 4em;
  margin-bottom: 10px;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.confirm-title {
  font-size: 1.5em;
  margin-bottom: 10px;
  color: white;
}

.confirm-message {
  font-size: 1.05em;
  opacity: 0.9;
  margin-bottom: 20px;
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn {
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 30px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  font-family: inherit;
  min-width: 100px;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.2);
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.3);
}

.btn-confirm {
  background: linear-gradient(135deg, #56ab2f, #a8e063);
}

.btn-danger {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
}

@media (max-width: 480px) {
  .confirm-dialog {
    padding: 20px 16px;
    width: 92%;
    border-radius: 20px;
  }

  .confirm-icon {
    font-size: 3em;
  }

  .confirm-title {
    font-size: 1.25em;
  }

  .confirm-message {
    font-size: 0.9em;
    margin-bottom: 16px;
  }

  .confirm-actions {
    flex-direction: column-reverse;
    gap: 8px;
  }

  .btn {
    padding: 12px 20px;
    font-size: 0.95em;
    min-height: 44px;
    width: 100%;
  }
}
</style>
