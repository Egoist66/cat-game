import { defineStore } from 'pinia'
import { ref } from 'vue'

const SAVE_KEY = 'cat-game-save'

export const useSaveStore = defineStore('save', () => {
  const lastSaved = ref<string | null>(null)
  const saveStatus = ref<'idle' | 'saving' | 'saved' | 'loaded'>('idle')
  let statusTimer: ReturnType<typeof setTimeout> | null = null

  function showStatus(status: 'saved' | 'loaded') {
    saveStatus.value = status
    if (statusTimer) clearTimeout(statusTimer)
    statusTimer = setTimeout(() => {
      saveStatus.value = 'idle'
    }, 2000)
  }

  function deleteSave() {
    localStorage.removeItem(SAVE_KEY)
    lastSaved.value = null
  }

  function hasSave(): boolean {
    return localStorage.getItem(SAVE_KEY) !== null
  }

  return { lastSaved, saveStatus, showStatus, deleteSave, hasSave }
})
