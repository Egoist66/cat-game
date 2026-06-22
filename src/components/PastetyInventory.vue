<template>
  <div class="card">
    <div class="title-row">
      <h2>🥫 Склад паштетов</h2>
      <span class="total-badge">Всего: {{ catStore.totalPastety }}</span>
    </div>
    <div v-if="catStore.totalPastety === 0" class="empty-state">
      Пусто! Котик грустит... 😿
    </div>
    <div v-else>
      <template v-for="(items, cat) in grouped" :key="cat">
        <div class="category-header">{{ cat }}</div>
        <div class="inventory-grid">
          <div
            v-for="(count, keyRaw) in items"
            :key="String(keyRaw)"
            class="inventory-item"
            @click="showInfo(String(keyRaw))"
            :class="{ empty: count === 0 }"
          >
            <span class="item-emoji">{{ pastetyTypes[String(keyRaw)].emoji }}</span>
            <div class="item-name">{{ pastetyTypes[String(keyRaw)].name }}</div>
            <div class="item-count">×{{ count }}</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCatStore } from '@/stores/catStore'
import { useGameLogStore } from '@/stores/gameLogStore'
import { pastetyTypes, categoryLabels } from '@/data/pastetyTypes'

const catStore = useCatStore()
const logStore = useGameLogStore()

const grouped = computed(() => {
  const groups: Record<string, Record<string, number>> = {}
  for (const [keyRaw, count] of Object.entries(catStore.cat.pashtety)) {
    const type = pastetyTypes[keyRaw]
    if (!type) continue
    const label = categoryLabels[type.category] || type.category
    if (!groups[label]) groups[label] = {}
    groups[label][keyRaw] = count
  }
  return groups
})

function showInfo(key: string) {
  const t = pastetyTypes[key]
  logStore.add(`${t.emoji} "${t.name}" — даёт +${t.hunger} сытости, +${t.happy} счастья`)
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

.total-badge {
  background: rgba(255, 255, 255, 0.15);
  padding: 5px 12px;
  border-radius: 10px;
  font-size: 0.95em;
  font-weight: bold;
}

.empty-state {
  text-align: center;
  opacity: 0.7;
  padding: 20px;
  font-size: 1.1em;
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}

.category-header {
  font-size: 1.1em;
  font-weight: bold;
  margin: 12px 0 6px;
  padding: 4px 0 4px 6px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.category-header:first-of-type {
  margin-top: 0;
}

.inventory-item {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  padding: 12px 8px;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
  border: 2px solid transparent;
}

.inventory-item:hover {
  transform: scale(1.1) rotate(5deg);
  border-color: gold;
  background: rgba(255, 215, 0, 0.25);
}

.inventory-item.empty {
  opacity: 0.3;
  cursor: default;
  pointer-events: none;
}

.item-emoji {
  font-size: 2.5em;
  display: block;
}

.item-name {
  font-size: 0.85em;
  margin-top: 4px;
}

.item-count {
  font-weight: bold;
  margin-top: 4px;
  font-size: 1.1em;
  color: #ffd200;
}

@media (max-width: 480px) {
  .inventory-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
  }

  .inventory-item {
    padding: 8px 4px;
  }

  .item-emoji {
    font-size: 2em;
  }

  .item-name {
    font-size: 0.75em;
  }

  .item-count {
    font-size: 0.95em;
  }
}
</style>
