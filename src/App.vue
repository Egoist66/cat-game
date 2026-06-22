<template>
  <div class="app-container">
    <div class="header-row">
      <div class="header-left">
        <h1 class="main-title" @click="handleTitleClick">
          🐱 Котик-Скотинка 🐱
        </h1>
        <p class="subtitle">Накорми котика и сделай его счастливым! 🍖😸</p>
      </div>
      <button class="guide-btn" @click="modalStore.openGuide" title="Гайд по игре">
        <span class="guide-icon">❓</span>
        <span class="guide-label">Гайд</span>
      </button>
    </div>

    <CatZone />

    <div class="grid">
      <PhraseInteraction />
      <DietPlanner />
    </div>

    <div class="grid">
      <PastetyInventory />
      <PastetyShop />
    </div>

    <div class="grid">
      <AutoFeeder />
    </div>

    <GameLog />

    <GuideModal />
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { useModalStore } from '@/stores/modalStore'
import CatZone from '@/components/CatZone.vue'
import PhraseInteraction from '@/components/PhraseInteraction.vue'
import DietPlanner from '@/components/DietPlanner.vue'
import PastetyInventory from '@/components/PastetyInventory.vue'
import PastetyShop from '@/components/PastetyShop.vue'
import AutoFeeder from '@/components/AutoFeeder.vue'
import GameLog from '@/components/GameLog.vue'
import GuideModal from '@/components/GuideModal.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { useGameLoop } from '@/composables/useGameLoop'

const modalStore = useModalStore()
const { handleTitleClick } = useGameLoop()
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Comic Sans MS', 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  min-height: 100vh;
  color: #fff;
  overflow-x: hidden;
}

.app-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
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
  margin-top: 4px;
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

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .grid { grid-template-columns: 1fr; }
}

.card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 20px;
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

  .grid {
    gap: 12px;
    margin-bottom: 12px;
  }

  .card {
    padding: 14px;
    border-radius: 16px;
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
