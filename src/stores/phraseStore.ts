import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PhraseReaction } from '@/types'
import { defaultPhraseReactions } from '@/data/pastetyTypes'

export const usePhraseStore = defineStore('phrase', () => {
  const customReactions = ref<PhraseReaction[]>([])

  const allReactions = computed<PhraseReaction[]>(() => [
    ...defaultPhraseReactions,
    ...customReactions.value,
  ])

  function findReaction(input: string): PhraseReaction | null {
    const lower = input.toLowerCase()
    for (const r of allReactions.value) {
      if (lower.includes(r.phrase.toLowerCase())) {
        return r
      }
    }
    return null
  }

  function addCustomReaction(reaction: PhraseReaction): boolean {
    if (!reaction.phrase.trim()) return false
    const exists = allReactions.value.some(
      r => r.phrase.toLowerCase() === reaction.phrase.toLowerCase()
    )
    if (exists) return false
    customReactions.value.push({ ...reaction })
    return true
  }

  function removeCustomReaction(index: number) {
    customReactions.value.splice(index, 1)
  }

  const defaultReactions = computed(() => defaultPhraseReactions)
  const customOnly = computed(() => customReactions.value)

  return {
    customReactions, allReactions,
    findReaction, addCustomReaction,
    removeCustomReaction, defaultReactions, customOnly,
  }
})
