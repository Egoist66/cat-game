import { onMounted, onUnmounted } from 'vue'
import { useCatStore } from '@/stores/catStore'
import { useGameLogStore } from '@/stores/gameLogStore'
import { useDietStore } from '@/stores/dietStore'
import { pastetyTypes } from '@/data/pastetyTypes'

export function useGameLoop() {
  const catStore = useCatStore()
  const logStore = useGameLogStore()
  const dietStore = useDietStore()

  let tickInterval: ReturnType<typeof setInterval> | null = null
  let eatInterval: ReturnType<typeof setInterval> | null = null
  let eventInterval: ReturnType<typeof setInterval> | null = null

  function handleTitleClick() {
    catStore.spawnFloatingEmoji('🐱')
    catStore.applyEffects(2, 0, 1)
    logStore.add(`🐱 ${catStore.cat.name} довольно мурлычет!`)
  }

  function checkDietAutoFeed() {
    if (!dietStore.autoFeedEnabled) return
    if (catStore.isEating) return
    const now = new Date()
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    for (const entry of dietStore.sortedEntries) {
      if (!entry.enabled) continue
      if (dietStore.isAlreadyFed(entry.id)) continue
      if (entry.time === currentTime) {
        if (catStore.cat.pashtety[entry.pastetyKey] > 0) {
          catStore.pozvatSkotinku()
          dietStore.markFed(entry.id)
          logStore.add(`🤖 Автокормушка: время ${entry.label || 'кормить'}! ${pastetyTypes[entry.pastetyKey]?.emoji}`)
        } else {
          logStore.add(`🤖 Автокормушка: нет ${pastetyTypes[entry.pastetyKey]?.name} для кормления в ${entry.time}!`)
        }
        break
      }
    }

    if (currentTime >= '23:59' || currentTime < '00:01') {
      dietStore.resetFedToday()
    }
  }

  onMounted(() => {
    logStore.add(`🐱 ${catStore.cat.name} проснулся и ждёт паштетов!`)

    tickInterval = setInterval(() => {
      catStore.tick()
    }, 1000)

    eatInterval = setInterval(() => {
      if (catStore.isEating) {
        const result = catStore.eatStep()
        if (result.ate && result.key) {
          const type = pastetyTypes[result.key]
          logStore.add(`🥫 Съел "${type.name}"! Осталось: ${catStore.totalPastety}`)
          catStore.spawnFloatingEmoji(type.emoji)
          if (result.key === 'mortadella') {
            catStore.setTemporaryEmoji('😿', 1500)
            catStore.murki += 2
            logStore.add(`😿 ${catStore.cat.name}: фу, мортаделла... на, держи 2 мурчалки, купи нормальной еды!`)
          }
          if (result.key === 'sausage') {
            catStore.setTemporaryEmoji('😼', 1000)
          }
        } else if (!result.ate) {
          logStore.add('😿 Паштеты закончились! Котик грустит...')
        }
      }
      checkDietAutoFeed()
    }, 2000)

    eventInterval = setInterval(() => {
      const msg = catStore.triggerRandomEvent()
      if (msg) {
        logStore.add(msg)
      }
    }, 25000)
  })

  onUnmounted(() => {
    if (tickInterval) clearInterval(tickInterval)
    if (eatInterval) clearInterval(eatInterval)
    if (eventInterval) clearInterval(eventInterval)
  })

  return {
    handleTitleClick,
  }
}
