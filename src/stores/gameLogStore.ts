import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGameLogStore = defineStore('gameLog', () => {
  const entries = ref<string[]>([])

  function add(msg: string) {
    const time = new Date().toLocaleTimeString()
    entries.value.unshift(`[${time}] ${msg}`)
    if (entries.value.length > 100) entries.value.pop()
  }

  function clear() {
    entries.value = []
  }

  return { entries, add, clear }
})
