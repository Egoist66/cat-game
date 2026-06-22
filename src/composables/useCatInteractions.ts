import { ref } from 'vue'
import { useCatStore } from '@/stores/catStore'
import { useGameLogStore } from '@/stores/gameLogStore'
import { useModalStore } from '@/stores/modalStore'
import { useSaveStore } from '@/stores/saveStore'
import { persistSave } from '@/plugins/piniaPersist'

export function useCatInteractions() {
  const catStore = useCatStore()
  const logStore = useGameLogStore()
  const modalStore = useModalStore()
  const saveStore = useSaveStore()

  const showTooltip = ref(false)
  const isTyping = ref(false)

  function handlePet() {
    const msg = catStore.petCat()
    catStore.triggerActionFlash('Погладили котика! 💖', '🤚')
    logStore.add(msg)
  }

  async function handleFeed() {
    const started = catStore.pozvatSkotinku()

    if (started === 'overfeed') {
      const ok = await modalStore.confirm({
        title: 'Котик уже сыт! 🍖',
        message: `${catStore.cat.name} наелся до отвала! Если продолжишь кормить — переест, накакает ♲ и настроение упадёт!`,
        confirmText: 'Всё равно накормить 💩',
        cancelText: 'Хватит, спасибо',
        icon: '😿',
        danger: true,
      })
      if (!ok) return
      const msg = catStore.overeat()
      logStore.add(msg)
    } else if (started === 'ok') {
      catStore.triggerActionFlash('Котик кушает! 🍽️', '😼')
      logStore.add(`${catStore.cat.name}, идити кушать, скриииипт! :))`)
    }
  }

  function handlePlay() {
    if (catStore.isEating || catStore.action === 'sleeping') return
    if (catStore.cat.hunger < 25) {
      catStore.setTemporaryEmoji('😾', 2000)
      catStore.spawnFloatingEmoji('🍖')
      logStore.add(`😾 ${catStore.cat.name} слишком голоден для игр! Сначала покорми!`)
      return
    }
    catStore.setAction('playing')
    catStore.applyEffects(8, -2, 2)
    catStore.spawnFloatingEmoji('🎾')
    catStore.setTemporaryEmoji('😸', 800)
    catStore.triggerActionFlash(`${catStore.cat.name} играет! 🎾`, '🎾')
    logStore.add(`🎾 Поиграли с ${catStore.cat.name}! +8 счастья, +2 мурчалки`)
    setTimeout(() => {
      if (catStore.action === 'playing') {
        catStore.setAction('idle')
        catStore.setTemporaryEmoji('😹', 1200)
      }
    }, 3000)
  }

  function toggleSleep() {
    if (catStore.action === 'sleeping') {
      catStore.setAction('idle')
      catStore.setTemporaryEmoji('😺', 2000)
      catStore.spawnFloatingEmoji('🌅')
      catStore.triggerActionFlash(`${catStore.cat.name} проснулся! 🌅`, '🌅')
      logStore.add(`🌅 ${catStore.cat.name} проснулся!`)
      catStore.applyEffects(5, -3, 1)
    } else {
      if (catStore.isEating) return
      catStore.setAction('sleeping')
      catStore.setTemporaryEmoji('😽', 1500)
      catStore.spawnFloatingEmoji('💤')
      catStore.triggerActionFlash(`${catStore.cat.name} уснул... 💤`, '😽')
      logStore.add(`😽 ${catStore.cat.name} уснул... тихо, не шумите!`)
    }
  }

  function onHover() {
    showTooltip.value = true
  }

  function onLeave() {
    showTooltip.value = false
  }

  async function handleReset() {
    const ok = await modalStore.confirm({
      title: 'Начать заново?',
      message: 'Котик будет очень обижен! Все паштеты пропадут, мурчалки сгорят...',
      confirmText: 'Да, начать',
      cancelText: 'Нет, остаться',
      icon: '😿',
      danger: true,
    })
    if (!ok) return
    catStore.resetGame()
    logStore.clear()
    saveStore.deleteSave()
    logStore.add('🔄 Новая жизнь началась!')
  }

  function handleSave() {
    saveStore.showStatus('saved')
    persistSave()
    saveStore.setLastSaved()
    saveStore.showToast('💾 Игра сохранена!', 'success')
  }

  return {
    showTooltip,
    isTyping,
    handlePet,
    handleFeed,
    handlePlay,
    toggleSleep,
    onHover,
    onLeave,
    handleReset,
    handleSave,
    saveStatus: saveStore.saveStatus,
  }
}
