import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { piniaPersist } from '@/plugins/piniaPersist'

const pinia = createPinia()
pinia.use(piniaPersist)

const app = createApp(App)
app.use(pinia)
app.mount('#app')
