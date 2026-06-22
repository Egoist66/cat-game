import { ref } from 'vue'
import { usePhraseStore } from '@/stores/phraseStore'
import { useCatStore } from '@/stores/catStore'
import { useGameLogStore } from '@/stores/gameLogStore'

export function usePhraseInteractions() {
  const phraseStore = usePhraseStore()
  const catStore = useCatStore()
  const logStore = useGameLogStore()

  const userPhrase = ref('')
  const lastReaction = ref<{ emoji: string; text: string } | null>(null)
  const lastEffects = ref<{ happy: number; hunger: number; murki: number } | null>(null)

  const newPhrase = ref('')
  const newReaction = ref('')
  const newHappy = ref(5)
  const newHunger = ref(0)
  const newMurki = ref(1)

  function sayPhrase() {
    const text = userPhrase.value.trim()
    if (!text) return

    const reaction = phraseStore.findReaction(text)
    if (reaction) {
      lastReaction.value = {
        emoji: reaction.emoji,
        text: reaction.reaction,
      }
      lastEffects.value = {
        happy: reaction.happyEffect,
        hunger: reaction.hungerEffect,
        murki: reaction.murkiEffect,
      }
      catStore.applyEffects(reaction.happyEffect, reaction.hungerEffect, reaction.murkiEffect)
      catStore.spawnFloatingEmoji(reaction.emoji)
      catStore.setTemporaryEmoji(reaction.emoji, 3000)
      logStore.add(`🗣️ Сказано "${text}" → ${reaction.reaction}`)
    } else {
      lastReaction.value = {
        emoji: '🐱',
        text: 'Мяу? Не понимаю, что ты говоришь... 🤔',
      }
      lastEffects.value = { happy: -1, hunger: 0, murki: 0 }
      catStore.applyEffects(-1, 0, 0)
      catStore.setTemporaryEmoji('😼', 2500)
      logStore.add(`🗣️ Сказано "${text}" → котик не понял 😕`)
    }

    userPhrase.value = ''

    setTimeout(() => {
      lastReaction.value = null
      lastEffects.value = null
    }, 4000)
  }

  function addPhrase() {
    const success = phraseStore.addCustomReaction({
      phrase: newPhrase.value.trim(),
      reaction: newReaction.value.trim(),
      emoji: '📝',
      happyEffect: newHappy.value,
      hungerEffect: newHunger.value,
      murkiEffect: newMurki.value,
    })
    if (success) {
      logStore.add(`✅ Добавлена фраза "${newPhrase.value}"`)
      newPhrase.value = ''
      newReaction.value = ''
      newHappy.value = 5
      newHunger.value = 0
      newMurki.value = 1
    } else {
      logStore.add(`❌ Фраза "${newPhrase.value}" уже существует`)
    }
  }

  function removePhrase(index: number) {
    phraseStore.removeCustomReaction(index)
    logStore.add('🗑️ Фраза удалена')
  }

  return {
    userPhrase,
    lastReaction,
    lastEffects,
    newPhrase,
    newReaction,
    newHappy,
    newHunger,
    newMurki,
    sayPhrase,
    addPhrase,
    removePhrase,
  }
}
