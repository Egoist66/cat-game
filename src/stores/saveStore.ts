import { defineStore } from 'pinia'
import { ref } from 'vue'

const SAVE_KEY = 'cat-game-save'

export interface Toast {
  message: string
  type: 'success' | 'error' | 'info'
  visible: boolean
}

export const useSaveStore = defineStore('save', () => {
  const lastSaved = ref<string | null>(null)
  const saveStatus = ref<'idle' | 'saving' | 'saved' | 'loaded'>('idle')
  let statusTimer: ReturnType<typeof setTimeout> | null = null

  const toast = ref<Toast>({ message: '', type: 'success', visible: false })
  let toastTimer: ReturnType<typeof setTimeout> | null = null

  function showStatus(status: 'saved' | 'loaded') {
    saveStatus.value = status
    if (statusTimer) clearTimeout(statusTimer)
    statusTimer = setTimeout(() => {
      saveStatus.value = 'idle'
    }, 2000)
  }

  function showToast(message: string, type: Toast['type'] = 'success') {
    toast.value = { message, type, visible: true }
    if (toastTimer) clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
      toast.value.visible = false
    }, 2500)
  }

  function hideToast() {
    toast.value.visible = false
  }

  function setLastSaved() {
    lastSaved.value = new Date().toLocaleTimeString()
  }

  function deleteSave() {
    localStorage.removeItem(SAVE_KEY)
    lastSaved.value = null
  }

  function hasSave(): boolean {
    return localStorage.getItem(SAVE_KEY) !== null
  }

  return { lastSaved, saveStatus, toast, showStatus, showToast, hideToast, setLastSaved, deleteSave, hasSave }
})
