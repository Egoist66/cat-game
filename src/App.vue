<template>
  <div class="app-container">
    <div class="header-row">
      <div class="header-left">
        <h1 class="main-title" @click="handleTitleClick">
          🐱 Котик-Скотинка 🐱
        </h1>
        <p class="subtitle">Накорми котика и сделай его счастливым! 🍖😸</p>
      </div>
      <div class="header-buttons">
        <button class="guide-btn" @click="logVisible = true" title="Дневник котика">
          <span class="guide-icon">📜</span>
          <span class="guide-label">Дневник</span>
        </button>
        <button class="guide-btn" @click="modalStore.openGuide" title="Гайд по игре">
          <span class="guide-icon">❓</span>
          <span class="guide-label">Гайд</span>
        </button>
      </div>
    </div>

    <CatZone />

    <div class="section-divider">
      <span class="divider-icon">🥫</span>
    </div>

    <div class="grid">
      <PastetyInventory />
      <PastetyShop />
    </div>

    <div class="section-divider">
      <span class="divider-icon">💬</span>
    </div>

    <div class="grid">
      <PhraseInteraction />
      <DietPlanner />
    </div>

    <div class="section-divider">
      <span class="divider-icon">🤖</span>
    </div>

    <div class="grid">
      <AutoFeeder />
    </div>

    <GameLogModal :visible="logVisible" @close="logVisible = false" />

    <GuideModal />
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useModalStore } from '@/stores/modalStore'
import { useCatStore } from '@/stores/catStore'
import { useSaveStore } from '@/stores/saveStore'
import CatZone from '@/components/CatZone.vue'
import PhraseInteraction from '@/components/PhraseInteraction.vue'
import DietPlanner from '@/components/DietPlanner.vue'
import PastetyInventory from '@/components/PastetyInventory.vue'
import PastetyShop from '@/components/PastetyShop.vue'
import AutoFeeder from '@/components/AutoFeeder.vue'
import GameLogModal from '@/components/GameLogModal.vue'
import GuideModal from '@/components/GuideModal.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { useGameLoop } from '@/composables/useGameLoop'

const modalStore = useModalStore()
const catStore = useCatStore()
const saveStore = useSaveStore()
const logVisible = ref(false)
const { handleTitleClick } = useGameLoop()

onMounted(() => {
  if (saveStore.hasSave()) {
    saveStore.showStatus('loaded')
    saveStore.showToast('📂 Игра загружена!', 'info')
  }
})

const bgStyle = computed(() => {
  if (catStore.mood === 'sad') {
    return { background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #4a69bd 100%)' }
  }
  if (catStore.mood === 'ok') {
    return { background: 'linear-gradient(135deg, #636e72 0%, #667eea 50%, #a29bfe 100%)' }
  }
  return { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }
})

watch(bgStyle, (val) => {
  document.body.style.background = val.background
}, { immediate: true })
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Comic Sans MS', 'Segoe UI', sans-serif;
  min-height: 100vh;
  color: #fff;
  overflow-x: hidden;
  margin: 0;
  transition: background 1.2s ease;
}

.app-container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 24px 28px 48px;
  min-height: 100vh;
}

.header-row {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 12px;
  position: relative;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.header-left {
  text-align: center;
  flex: 1;
  min-width: 200px;
}

.main-title {
  font-size: 2.2em;
  text-shadow: 3px 3px 0 #00000044;
  margin-bottom: 5px;
  animation: bounce 2s infinite;
  cursor: pointer;
  user-select: none;
  line-height: 1.2;
}

.subtitle {
  text-align: center;
  opacity: 0.8;
  font-size: 1em;
}

.header-buttons {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  margin-top: 4px;
}

.guide-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 10px 18px;
  cursor: pointer;
  color: white;
  font-family: inherit;
  font-size: 1em;
  font-weight: bold;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
  min-height: 44px;
}

.guide-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.guide-icon {
  font-size: 1.3em;
}

.guide-label {
  font-size: 0.9em;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.section-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px 0 20px;
  position: relative;
}

.section-divider::before,
.section-divider::after {
  content: '';
  flex: 1;
  height: 2px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
}

.section-divider::before {
  margin-right: 16px;
}

.section-divider::after {
  margin-left: 16px;
}

.divider-icon {
  font-size: 1.4em;
  opacity: 0.7;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .grid { grid-template-columns: 1fr; }
}

.card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

h2 {
  font-size: 1.4em;
}

input, select {
  padding: 8px 12px;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-family: inherit;
  font-size: 1em;
  outline: none;
  transition: border-color 0.2s;
}

input:focus, select:focus {
  border-color: #6dd5ed;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

select option {
  background: #333;
  color: white;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

@media (max-width: 480px) {
  .app-container {
    padding: 10px;
  }

  .main-title {
    font-size: 1.6em;
  }

  .subtitle {
    font-size: 0.85em;
  }

  .header-buttons {
    gap: 6px;
  }

  .guide-btn {
    padding: 8px 12px;
    font-size: 0.85em;
    min-height: 38px;
  }

  .guide-icon {
    font-size: 1.1em;
  }

  .guide-label {
    font-size: 0.8em;
  }

  .section-divider {
    margin: 18px 0 14px;
  }

  .grid {
    gap: 14px;
  }

  .card {
    padding: 16px;
    border-radius: 18px;
  }

  h2 {
    font-size: 1.15em;
  }

  input, select {
    padding: 6px 10px;
    font-size: 0.9em;
  }
}
</style>
