<template>
  <Teleport to="body">
    <div v-if="modalStore.showGuide" class="guide-overlay" @click.self="modalStore.closeGuide">
      <div class="guide-modal">
        <button class="close-btn" @click="modalStore.closeGuide">✕</button>
        <h2 class="guide-title">📖 Полный гайд по игре</h2>

        <div class="guide-content">
          <section>
            <h3>🐱 О котике</h3>
            <p>У твоего котика есть два показателя: <b>🍖 Сытость</b> и <b>😸 Счастье</b>.</p>
            <p>Они постепенно уменьшаются со временем. Твоя задача — поддерживать их на высоком уровне!</p>
            <ul>
              <li><b>🍖 Сытость</b> — падает на 0.5/сек. Если ниже 20% — котик грустит.</li>
              <li><b>😸 Счастье</b> — падает на 0.3/сек. Если ниже 20% — котик в унынии.</li>
              <li>Если оба показателя выше 80/60 — котик в экстазе и приносит больше мурчалок!</li>
            </ul>
          </section>

          <section>
            <h3>💰 Мурчалки</h3>
            <p>Это валюта в игре. Мурчалки начисляются автоматически в зависимости от настроения котика:</p>
            <ul>
              <li>😿 Грустный — 0 мурчалок/сек</li>
              <li>🐱 Нормально — (сытость+счастье)/400 в сек</li>
              <li>😸 Счастливый — (сытость+счастье)/200 в сек</li>
              <li>😻 В экстазе — (сытость+счастье)/100 в сек</li>
            </ul>
            <p>Также мурчалки можно получить за:</p>
            <ul>
              <li>🤚 Погладить котика → +1 мурчалка</li>
              <li>🎾 Поиграть с котиком → +2 мурчалки</li>
              <li>🗣️ Сказать правильную фразу → бонус мурчалок</li>
            </ul>
          </section>

          <section>
            <h3>🥫 Паштеты</h3>
            <p>В магазине можно купить паштеты разных видов. Каждый даёт +к сытости и +к счастью:</p>
            <div class="pasta-table">
              <div class="pasta-row header">
                <span>Тип</span>
                <span>Цена</span>
                <span>🍖 Сытость</span>
                <span>😸 Счастье</span>
              </div>
              <div class="pasta-row" v-for="(t, k) in pastetyTypes" :key="k">
                <span>{{ t.emoji }} {{ t.name }}</span>
                <span>{{ t.price }}💰</span>
                <span>+{{ t.hunger }}</span>
                <span>+{{ t.happy }}</span>
              </div>
            </div>
            <p>Котик всегда ест от лучшего к худшему — сначала Роял Конин, потом Вискас и т.д.</p>
          </section>

          <section>
            <h3>🗣️ Фразы</h3>
            <p>Котик понимает некоторые слова и реагирует на них!</p>
            <p>Попробуй сказать: <b>"кушать"</b>, <b>"люблю"</b>, <b>"играть"</b>, <b>"спать"</b>, <b>"красивый"</b>, <b>"глупый"</b> или <b>"посол от сюда"</b>.</p>
            <p>Каждая фраза меняет настроение и статы котика. Ты также можешь <b>добавить свои фразы</b> с уникальными реакциями!</p>
            <p>Просто открой раздел "Управление фразами" в карточке "Скажи котику" и добавь новую фразу с реакцией.</p>
          </section>

          <section>
            <h3>🎮 Действия</h3>
            <ul>
              <li><b>🤚 Погладить</b> — +3 счастья, +1 мурчалка, котик 😻</li>
              <li><b>🎾 Играть</b> — +8 счастья, -2 сытости, +2 мурчалки (длится 3 сек)</li>
              <li><b>😾 Отказ от игры</b> — если сытость ниже 25%, котик отказывается играть и просит еду</li>
              <li><b>😽 Спать</b> — котик отдыхает 😽, +5 счастья при пробуждении</li>
              <li><b>🍽️ Позвать кушать</b> — котик бежит к миске 😻 и ест паштет раз в 2 секунды</li>
            </ul>
          </section>

          <section>
            <h3>🤖 Автокормушка</h3>
            <p>После настройки рациона включи автокормушку — она будет сама кормить котика по расписанию!</p>
            <ul>
              <li>Каждый приём пищи срабатывает <b>один раз в день</b></li>
              <li>Если паштета нет в наличии — автокормушка напишет предупреждение в лог</li>
              <li>Можно отключить в любой момент кнопкой «Выключить»</li>
              <li>В полночь отметки о кормлениях сбрасываются</li>
            </ul>
          </section>

          <section>
            <h3>💾 Сохранение</h3>
            <p>Игра сохраняется автоматически каждые 30 секунд в <b>localStorage</b> браузера.</p>
            <ul>
              <li>Можно сохранить вручную кнопкой 💾 в панели котика</li>
              <li>При заходе в игру сохранение загружается автоматически</li>
              <li>Сохраняется: имя кота, паштеты, статы, мурчалки, кастомные фразы, рацион, лог</li>
              <li>Кнопка «Начать заново» сбрасывает всё сохранение</li>
            </ul>
          </section>

          <section>
            <h3>📋 Рацион</h3>
            <p>Ты можешь составить расписание кормления для котика. Добавь время и выбери паштет.</p>
            <ul>
              <li>Приёмы пищи можно включать/выключать (✅/⏸️)</li>
              <li>Автокормушка должна быть включена для автоматического кормления</li>
              <li>У каждого приёма можно указать метку (напр. «Завтрак», «Ужин»)</li>
            </ul>
          </section>

          <section>
            <h3>🎯 Советы</h3>
            <ul>
              <li>Следи за эмодзи котика — он подсказывает, что ему нужно</li>
              <li>Не дай сытости упасть ниже 25% — котик откажется играть</li>
              <li>Вискас — хороший выбор на каждый день, Роял Канин — для экстаза 😼</li>
              <li>Имя котика используется во всех сообщениях — назови как хочешь!</li>
            </ul>
          </section>

          <section>
            <h3>📋 Рацион</h3>
            <p>Ты можешь составить расписание кормления для котика. Добавь время и выбери паштет — автокормушка сама покормит котика в нужное время!</p>
            <p>Чтобы рацион работал, приёмы пищи должны быть активны (✅).</p>
          </section>
        </div>

        <div class="guide-footer">
          <button class="btn btn-gold" @click="modalStore.closeGuide">Понятно! 😸</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useModalStore } from '@/stores/modalStore'
import { pastetyTypes } from '@/data/pastetyTypes'

const modalStore = useModalStore()
</script>

<style scoped>
.guide-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  animation: fadeOverlay 0.25s;
  padding: 20px;
}

@keyframes fadeOverlay {
  from { opacity: 0; }
  to { opacity: 1; }
}

.guide-modal {
  background: linear-gradient(160deg, #5b4e9e, #3d3480);
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-radius: 24px;
  padding: 30px;
  max-width: 600px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: modalIn 0.3s ease-out;
}

@keyframes modalIn {
  from { transform: translateY(30px) scale(0.95); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.5em;
  cursor: pointer;
  transition: all 0.2s;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.guide-title {
  font-size: 1.6em;
  text-align: center;
  margin-bottom: 20px;
  color: #ffd200;
}

.guide-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

section {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 16px;
}

section h3 {
  font-size: 1.2em;
  margin-bottom: 10px;
  color: #6dd5ed;
}

section p {
  font-size: 0.95em;
  line-height: 1.6;
  margin-bottom: 8px;
  opacity: 0.9;
}

section ul {
  padding-left: 20px;
  margin: 6px 0;
}

section li {
  font-size: 0.92em;
  line-height: 1.7;
  opacity: 0.9;
}

.pasta-table {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 10px 0;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 8px;
}

.pasta-row {
  display: grid;
  grid-template-columns: 1fr 60px 70px 70px;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.9em;
}

.pasta-row.header {
  font-weight: bold;
  color: #ffd200;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  padding-bottom: 8px;
  margin-bottom: 4px;
}

.pasta-row:not(.header):hover {
  background: rgba(255, 255, 255, 0.05);
}

.guide-footer {
  text-align: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn {
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 30px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  font-family: inherit;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.btn-gold {
  background: linear-gradient(135deg, #f7971e, #ffd200);
  color: #333;
}

@media (max-width: 480px) {
  .guide-overlay {
    padding: 10px;
    align-items: flex-end;
  }

  .guide-modal {
    padding: 20px 16px;
    max-height: 90vh;
    border-radius: 20px 20px 0 0;
  }

  .guide-title {
    font-size: 1.3em;
    margin-bottom: 14px;
  }

  .guide-content {
    gap: 12px;
  }

  section {
    padding: 12px;
  }

  section h3 {
    font-size: 1.05em;
  }

  section p {
    font-size: 0.85em;
  }

  section li {
    font-size: 0.82em;
  }

  .pasta-row {
    grid-template-columns: 1fr 40px 50px 50px;
    font-size: 0.8em;
    gap: 4px;
    padding: 4px 6px;
  }

  .close-btn {
    top: 8px;
    right: 10px;
    font-size: 1.3em;
    width: 32px;
    height: 32px;
  }

  .btn {
    padding: 10px 24px;
    font-size: 0.95em;
    min-height: 44px;
  }
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 3px;
}
</style>
