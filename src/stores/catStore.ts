import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Cat, Mood, CatAction } from '@/types'
import { pastetyTypes } from '@/data/pastetyTypes'

export const useCatStore = defineStore('cat', () => {
  const cat = ref<Cat>({
    name: 'Пумиус',
      pashtety: { mortadella: 0, sausage: 0, chicken: 3, duck: 2, salmon: 1, beef: 0, royal: 0 },
    hunger: 50,
    happy: 50,
  })

  const murki = ref(20)
  const isEating = ref(false)
  const action = ref<CatAction>('idle')
  const floatingEmojis = ref<{ id: number; emoji: string; x: number; y: number }[]>([])
  const temporaryEmoji = ref<string | null>(null)
  let nextEmojiId = 0
  let tempEmojiTimer: ReturnType<typeof setTimeout> | null = null

  const totalPastety = computed(() =>
    Object.values(cat.value.pashtety).reduce((a, b) => a + b, 0)
  )

  const mood = computed<Mood>(() => {
    if (cat.value.happy >= 80 && cat.value.hunger >= 60) return 'ecstatic'
    if (cat.value.happy >= 50 && cat.value.hunger >= 40) return 'happy'
    if (cat.value.happy < 20 || cat.value.hunger < 20) return 'sad'
    return 'ok'
  })

  const catEmoji = computed(() => {
    if (temporaryEmoji.value) return temporaryEmoji.value
    if (action.value === 'eating') return '😼'
    if (action.value === 'sleeping') return '😽'
    if (action.value === 'playing') {
      if (mood.value === 'ecstatic') return '😹'
      if (mood.value === 'happy') return '😸'
      return '😺'
    }
    if (cat.value.hunger < 20 && cat.value.happy >= 50) return '😿'
    if (cat.value.hunger < 20) return '😿'
    return { ecstatic: '😻', happy: '😸', ok: '🐱', sad: '😿' }[mood.value]
  })

  function setTemporaryEmoji(emoji: string, durationMs: number = 2500) {
    temporaryEmoji.value = emoji
    if (tempEmojiTimer) clearTimeout(tempEmojiTimer)
    tempEmojiTimer = setTimeout(() => {
      temporaryEmoji.value = null
    }, durationMs)
  }

  const moodText = computed(() => {
    const name = cat.value.name
    if (action.value === 'eating') return `${name} кушает! Ням-ням-ням! Вкуснятина! 😼`
    if (action.value === 'sleeping') return `Тсс... ${name} спит... 😽💤`
    if (action.value === 'playing') return `${name} играет и веселится! 🎾`
    return {
      ecstatic: `Муррр... ${name} — самый счастливый котик! 💖`,
      happy: `Мур-мур, ${name} доволен жизнью~ 😺`,
      ok: `Мяу. ${name} живёт нормально.`,
      sad: totalPastety.value === 0
        ? `А ну посол от сюда - хороша жизнь да? 😾`
        : `${name} хочет кушать... 😿`,
    }[mood.value]
  })

  const murkiPerSec = computed(() => {
    if (mood.value === 'sad') return 0
    if (mood.value === 'ecstatic') return (cat.value.happy + cat.value.hunger) / 100
    if (mood.value === 'happy') return (cat.value.happy + cat.value.hunger) / 200
    return (cat.value.happy + cat.value.hunger) / 400
  })

  function addLog(msg: string): string {
    const time = new Date().toLocaleTimeString()
    const entry = `[${time}] ${msg}`
    return entry
  }

  function pozvatSkotinku() {
    if (isEating.value || totalPastety.value === 0) return false
    action.value = 'eating'
    isEating.value = true
    setTemporaryEmoji('😻', 1200)
    return true
  }

  function eatStep(): { ate: boolean; key?: string } {
    const order = ['royal', 'beef', 'salmon', 'duck', 'chicken', 'sausage', 'mortadella']
    let eaten: string | null = null
    for (const key of order) {
      if (cat.value.pashtety[key] > 0) {
        cat.value.pashtety[key]--
        eaten = key
        break
      }
    }
    if (!eaten) {
      isEating.value = false
      action.value = 'idle'
      return { ate: false }
    }
    const type = pastetyTypes[eaten]
    cat.value.hunger = Math.min(100, cat.value.hunger + type.hunger)
    cat.value.happy = Math.min(100, cat.value.happy + type.happy)
    return { ate: true, key: eaten }
  }

  function stopEating() {
    isEating.value = false
    action.value = 'idle'
  }

  function buyPasta(key: string): boolean {
    const type = pastetyTypes[key]
    if (!type || murki.value < type.price) return false
    murki.value -= type.price
    cat.value.pashtety[key]++
    return true
  }

  function petCat() {
    cat.value.happy = Math.min(100, cat.value.happy + 3)
    murki.value += 1
    spawnFloatingEmoji('💖')
    setTemporaryEmoji('😻', 1500)
    return '🤚 Погладили котика! +1 мурчалка'
  }

  function tick() {
    cat.value.hunger = Math.max(0, cat.value.hunger - 0.5)
    cat.value.happy = Math.max(0, cat.value.happy - 0.3)
    murki.value += murkiPerSec.value
  }

  function spawnFloatingEmoji(emoji: string) {
    const id = nextEmojiId++
    floatingEmojis.value.push({ id, emoji, x: Math.random() * 80 + 10, y: 40 })
    setTimeout(() => {
      floatingEmojis.value = floatingEmojis.value.filter(e => e.id !== id)
    }, 1500)
  }

  function setAction(a: CatAction) {
    action.value = a
  }

  function resetGame() {
    cat.value = {
      name: 'Пумиус',
    pashtety: { mortadella: 0, sausage: 0, chicken: 3, duck: 2, salmon: 1, beef: 0, royal: 0 },
      hunger: 50,
      happy: 50,
    }
    murki.value = 20
    isEating.value = false
    action.value = 'idle'
    temporaryEmoji.value = null
  }

  function applyEffects(happyDelta: number, hungerDelta: number, murkiDelta: number) {
    cat.value.happy = Math.max(0, Math.min(100, cat.value.happy + happyDelta))
    cat.value.hunger = Math.max(0, Math.min(100, cat.value.hunger + hungerDelta))
    murki.value = Math.max(0, murki.value + murkiDelta)
  }

  return {
    cat, murki, isEating, action, floatingEmojis, temporaryEmoji,
    totalPastety, mood, catEmoji, moodText, murkiPerSec,
    addLog, pozvatSkotinku, eatStep, stopEating,
    buyPasta, petCat, tick, spawnFloatingEmoji, setAction,
    resetGame, applyEffects, setTemporaryEmoji,
  }
})
