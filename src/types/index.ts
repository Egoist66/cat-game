export interface PastetyType {
  name: string
  emoji: string
  price: number
  hunger: number
  happy: number
}

export interface PastetyInventory {
  [key: string]: number
}

export interface Cat {
  name: string
  pashtety: PastetyInventory
  hunger: number
  happy: number
}

export type Mood = 'ecstatic' | 'happy' | 'ok' | 'sad'

export type CatAction = 'idle' | 'eating' | 'sleeping' | 'playing' | 'walking'

export interface PhraseReaction {
  phrase: string
  reaction: string
  emoji: string
  happyEffect: number
  hungerEffect: number
  murkiEffect: number
}

export interface DietEntry {
  id: string
  time: string
  pastetyKey: string
  enabled: boolean
  label: string
}

export interface LogEntry {
  time: string
  text: string
}
