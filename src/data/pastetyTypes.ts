import type { PastetyType } from '@/types'

export const pastetyTypes: Record<string, PastetyType> = {
  mortadella: { name: 'Мортаделла',       emoji: '🍖', price: 0,   hunger: 2,  happy: -2 },
  sausage:    { name: 'Сосисочная',       emoji: '🌭', price: 1,   hunger: 5,  happy: 0 },
  chicken:    { name: 'Вискас (Курица)',  emoji: '🍗', price: 8,   hunger: 10, happy: 3 },
  duck:       { name: 'Вискас (Утка)',    emoji: '🦆', price: 20,  hunger: 20, happy: 6 },
  salmon:     { name: 'Вискас (Лосось)',  emoji: '🐟', price: 40,  hunger: 28, happy: 12 },
  beef:       { name: 'Вискас (Говядина)', emoji: '🥩', price: 80,  hunger: 38, happy: 22 },
  royal:      { name: 'Роял Канин',       emoji: '👑', price: 200, hunger: 60, happy: 50 },
}

export const defaultPhraseReactions = [
  {
    phrase: 'посол от сюда',
    reaction: 'Ахаха, хороша жизнь да? 😾 Пойду я от сюда!',
    emoji: '😾',
    happyEffect: -10,
    hungerEffect: 0,
    murkiEffect: 0,
  },
  {
    phrase: 'кушать',
    reaction: 'Мяу! Давай паштет! Скорее! 🍽️',
    emoji: '😼',
    happyEffect: 5,
    hungerEffect: -5,
    murkiEffect: 0,
  },
  {
    phrase: 'люблю',
    reaction: 'Мур-мур-мур! Я тебя тоже люблю! 💖',
    emoji: '😻',
    happyEffect: 15,
    hungerEffect: 0,
    murkiEffect: 3,
  },
  {
    phrase: 'играть',
    reaction: 'Давай поиграем! Лови бантик! 🎀',
    emoji: '😸',
    happyEffect: 10,
    hungerEffect: -3,
    murkiEffect: 2,
  },
  {
    phrase: 'спать',
    reaction: 'Зевает... Спокойной ночи... 😽',
    emoji: '😽',
    happyEffect: 5,
    hungerEffect: -2,
    murkiEffect: 1,
  },
  {
    phrase: 'красивый',
    reaction: 'Ну да, я знаю что я красивый! 🐱✨',
    emoji: '😸',
    happyEffect: 10,
    hungerEffect: 0,
    murkiEffect: 2,
  },
  {
    phrase: 'глупый',
    reaction: 'Мяу?! Сам такой! 😤',
    emoji: '😾',
    happyEffect: -15,
    hungerEffect: 0,
    murkiEffect: -2,
  },
  {
    phrase: 'не буду',
    reaction: 'Ну и пожалуйста! Подумаешь! 🙄',
    emoji: '🙄',
    happyEffect: -5,
    hungerEffect: 0,
    murkiEffect: 0,
  },
]
