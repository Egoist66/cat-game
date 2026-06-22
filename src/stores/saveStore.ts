import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCatStore } from './catStore'
import { usePhraseStore } from './phraseStore'
import { useDietStore } from './dietStore'
import { useGameLogStore } from './gameLogStore'

const SAVE_KEY = 'cat-game-save'

export interface SaveData {
  version: number
  timestamp: number
  cat: {
    name: string
    pashtety: Record<string, number>
    hunger: number
    happy: number
  }
  murki: number
  customReactions: { phrase: string; reaction: string; emoji: string; happyEffect: number; hungerEffect: number; murkiEffect: number }[]
  dietEntries: { id: string; time: string; pastetyKey: string; enabled: boolean; label: string }[]
  autoFeedEnabled: boolean
  log: string[]
}

const OLD_KEY_MAP: Record<string, string> = {
  cheap: 'chicken',
  normal: 'duck',
  fish: 'salmon',
  premium: 'beef',
  whiskas: 'beef',
}

function migratePashtetyKeys(pashtety: Record<string, number>): Record<string, number> {
  const result: Record<string, number> = { mortadella: 0, sausage: 0, chicken: 0, duck: 0, salmon: 0, beef: 0, royal: 0 }
  for (const [key, val] of Object.entries(pashtety)) {
    const newKey = OLD_KEY_MAP[key] ?? key
    result[newKey] = (result[newKey] || 0) + val
  }
  return result
}

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

  function save() {
    const catStore = useCatStore()
    const phraseStore = usePhraseStore()
    const dietStore = useDietStore()
    const logStore = useGameLogStore()

    const data: SaveData = {
      version: 1,
      timestamp: Date.now(),
      cat: {
        name: catStore.cat.name,
        pashtety: { ...catStore.cat.pashtety },
        hunger: catStore.cat.hunger,
        happy: catStore.cat.happy,
      },
      murki: catStore.murki,
      customReactions: phraseStore.customReactions.map(r => ({ ...r })),
      dietEntries: dietStore.entries.map(e => ({ ...e })),
      autoFeedEnabled: dietStore.autoFeedEnabled,
      log: [...logStore.entries],
    }

    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data))
      lastSaved.value = new Date().toLocaleTimeString()
      showStatus('saved')
    } catch (e) {
      console.error('Save failed:', e)
    }
  }

  function load(): boolean {
    try {
      const raw = localStorage.getItem(SAVE_KEY)
      if (!raw) return false

      const data: SaveData = JSON.parse(raw)
      if (!data || !data.cat) return false

      const catStore = useCatStore()
      const phraseStore = usePhraseStore()
      const dietStore = useDietStore()
      const logStore = useGameLogStore()

      catStore.cat.name = data.cat.name
      catStore.cat.pashtety = migratePashtetyKeys(data.cat.pashtety)
      catStore.cat.hunger = data.cat.hunger
      catStore.cat.happy = data.cat.happy
      catStore.murki = data.murki

      if (data.customReactions) {
        phraseStore.customReactions.splice(0, phraseStore.customReactions.length, ...data.customReactions)
      }

      if (data.dietEntries) {
        const migrated = data.dietEntries.map(e => ({
          ...e,
          pastetyKey: OLD_KEY_MAP[e.pastetyKey] ?? e.pastetyKey,
        }))
        dietStore.entries.splice(0, dietStore.entries.length, ...migrated)
      }

      if (typeof data.autoFeedEnabled === 'boolean') {
        dietStore.autoFeedEnabled = data.autoFeedEnabled
      }

      if (data.log) {
        logStore.entries.splice(0, logStore.entries.length, ...data.log)
      }

      lastSaved.value = new Date(data.timestamp).toLocaleTimeString()
      showStatus('loaded')
      return true
    } catch (e) {
      console.error('Load failed:', e)
      return false
    }
  }

  function hasSave(): boolean {
    return localStorage.getItem(SAVE_KEY) !== null
  }

  function deleteSave() {
    localStorage.removeItem(SAVE_KEY)
    lastSaved.value = null
  }

  return { lastSaved, saveStatus, save, load, hasSave, deleteSave }
})
