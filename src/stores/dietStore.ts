import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DietEntry } from '@/types'

export const useDietStore = defineStore('diet', () => {
  const entries = ref<DietEntry[]>([])
  const autoFeedEnabled = ref(false)
  const fedToday = ref<Set<string>>(new Set())

  const sortedEntries = computed(() =>
    [...entries.value].sort((a, b) => a.time.localeCompare(b.time))
  )

  function addEntry(entry: DietEntry) {
    entries.value.push(entry)
  }

  function updateEntry(id: string, updates: Partial<DietEntry>) {
    const idx = entries.value.findIndex(e => e.id === id)
    if (idx !== -1) {
      entries.value[idx] = { ...entries.value[idx], ...updates }
    }
  }

  function removeEntry(id: string) {
    entries.value = entries.value.filter(e => e.id !== id)
    fedToday.value.delete(id)
  }

  function toggleEntry(id: string) {
    const entry = entries.value.find(e => e.id === id)
    if (entry) {
      entry.enabled = !entry.enabled
      if (!entry.enabled) fedToday.value.delete(id)
    }
  }

  function toggleAutoFeed() {
    autoFeedEnabled.value = !autoFeedEnabled.value
    if (!autoFeedEnabled.value) {
      fedToday.value.clear()
    }
  }

  function markFed(id: string) {
    fedToday.value.add(id)
  }

  function isAlreadyFed(id: string): boolean {
    return fedToday.value.has(id)
  }

  function getNextFeedingTime(): DietEntry | null {
    const now = new Date()
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const enabled = sortedEntries.value.filter(e => e.enabled && !fedToday.value.has(e.id))
    for (const e of enabled) {
      if (e.time >= currentTime) return e
    }
    return enabled.length > 0 ? enabled[0] : null
  }

  function resetFedToday() {
    fedToday.value.clear()
  }

  return {
    entries, sortedEntries, autoFeedEnabled,
    addEntry, updateEntry, removeEntry, toggleEntry,
    toggleAutoFeed, getNextFeedingTime, markFed,
    isAlreadyFed, resetFedToday, fedToday,
  }
})
