import type { PiniaPluginContext } from 'pinia'

const SAVE_KEY = 'cat-game-save'
const PERSISTED_STORES = ['cat', 'phrase', 'diet', 'gameLog']

const OLD_KEY_MAP: Record<string, string> = {
  cheap: 'chicken',
  normal: 'duck',
  fish: 'salmon',
  premium: 'beef',
  whiskas: 'beef',
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null
const hydrated = new Set<string>()

function pashtety(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object') return {}
  const r: Record<string, number> = { mortadella: 0, sausage: 0, chicken: 0, duck: 0, salmon: 0, beef: 0, royal: 0 }
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    r[OLD_KEY_MAP[k] ?? k] = (r[OLD_KEY_MAP[k] ?? k] || 0) + Number(v || 0)
  }
  return r
}

function load(id: string, saved: any) {
  if (id === 'cat') {
    if (saved.pashtety) saved.pashtety = pashtety(saved.pashtety)
  }
  if (id === 'diet' && saved.fedToday) {
    saved.fedToday = new Set(saved.fedToday)
  }
  return saved
}

export function persistSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    const data = raw ? JSON.parse(raw) : {}
    for (const id of PERSISTED_STORES) {
      const state = (window as any).__pinia?.state?.value?.[id]
      if (state) {
        const clone: any = {}
        for (const k of Object.keys(state)) {
          const v = state[k]
          clone[k] = v instanceof Set ? [...v] : v
        }
        data[id] = clone
      }
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(data))
  } catch {}
}

function save() {
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    persistSave()
  }, 300)
}

export function piniaPersist({ store }: PiniaPluginContext) {
  const id = store.$id
  if (!PERSISTED_STORES.includes(id)) return

  if (!hydrated.has(id)) {
    hydrated.add(id)
    try {
      const raw = localStorage.getItem(SAVE_KEY)
      if (raw) {
        const all = JSON.parse(raw)
        if (all[id]) {
          store.$patch(load(id, all[id]))
        }
      }
    } catch {}
  }

  store.$subscribe(() => save())
}
