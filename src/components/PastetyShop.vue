<template>
  <div class="card">
    <div class="title-row">
      <h2>🛒 Магазин паштетов</h2>
      <span class="balance">💰 {{ Math.floor(catStore.murki) }}</span>
    </div>
    <div v-for="(type, key) in pastetyTypes" :key="key" class="shop-item">
      <div class="shop-info">
        <span class="shop-emoji">{{ type.emoji }}</span>
        <div>
          <div class="shop-name">{{ type.name }}</div>
          <div class="shop-stats">
            +{{ type.hunger }} 🍖 | +{{ type.happy }} 😸
          </div>
        </div>
      </div>
      <button
        class="btn btn-green"
        @click="buy(key)"
        :disabled="catStore.murki < type.price"
      >
        💰 {{ type.price }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCatStore } from '@/stores/catStore'
import { useGameLogStore } from '@/stores/gameLogStore'
import { pastetyTypes } from '@/data/pastetyTypes'

const catStore = useCatStore()
const logStore = useGameLogStore()

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

function buy(key: string) {
  const success = catStore.buyPasta(key)
  if (success) {
    const type = pastetyTypes[key]
    logStore.add(`Куплен "${type.name}" ${type.emoji} за ${type.price} мурчалок`)
    catStore.spawnFloatingEmoji('💰')
    if (key === 'royal') {
      const msg = randomRoyalReaction()
      catStore.spawnFloatingEmoji('👑')
      logStore.add(`😼 ${catStore.cat.name}: ${msg}`)
    }
  }
}
</script>

<style scoped>
.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

h2 {
  font-size: 1.4em;
}

.balance {
  font-size: 1.2em;
  font-weight: bold;
  background: rgba(255, 215, 0, 0.2);
  padding: 5px 12px;
  border-radius: 10px;
  border: 1px solid gold;
}

.shop-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px 15px;
  border-radius: 12px;
  margin-bottom: 8px;
  transition: background 0.2s;
}

.shop-item:hover {
  background: rgba(255, 255, 255, 0.16);
}

.shop-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.shop-emoji {
  font-size: 2em;
}

.shop-name {
  font-weight: bold;
  font-size: 1.05em;
}

.shop-stats {
  font-size: 0.85em;
  opacity: 0.8;
}

.btn {
  background: linear-gradient(135deg, #56ab2f, #a8e063);
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
  .shop-item {
    padding: 8px 10px;
    flex-wrap: wrap;
    gap: 6px;
  }

  .shop-emoji {
    font-size: 1.6em;
  }

  .shop-name {
    font-size: 0.9em;
  }

  .shop-stats {
    font-size: 0.8em;
  }

  .btn {
    padding: 6px 14px;
    font-size: 0.85em;
    min-height: 36px;
  }
}
</style>
