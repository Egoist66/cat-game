import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ConfirmOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  icon?: string
  danger?: boolean
}

export const useModalStore = defineStore('modal', () => {
  const showGuide = ref(false)
  const confirmVisible = ref(false)
  const confirmResolve = ref<((v: boolean) => void) | null>(null)
  const confirmOptions = ref<ConfirmOptions>({
    title: '',
    message: '',
    confirmText: 'Да',
    cancelText: 'Нет',
    icon: '🐱',
    danger: false,
  })

  function openGuide() {
    showGuide.value = true
  }

  function closeGuide() {
    showGuide.value = false
  }

  function confirm(options: ConfirmOptions): Promise<boolean> {
    confirmOptions.value = { ...options }
    confirmVisible.value = true
    return new Promise((resolve) => {
      confirmResolve.value = resolve
    })
  }

  function resolveConfirm(value: boolean) {
    confirmVisible.value = false
    if (confirmResolve.value) {
      confirmResolve.value(value)
      confirmResolve.value = null
    }
  }

  return {
    showGuide, confirmVisible, confirmOptions,
    openGuide, closeGuide, confirm, resolveConfirm,
  }
})
