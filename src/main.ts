import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 1. Импортируем PrimeVue и тему
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

// 2. Импортируем i18n
import { createI18n } from 'vue-i18n'

// 3. Создаем базовый словарь локализации
const i18n = createI18n({
  legacy: false, // Обязательно для Vue 3 (Composition API)
  locale: 'ru',  // Язык по умолчанию
  fallbackLocale: 'en',
  messages: {
    ru: {
      auth: {
        login: 'Войти в систему',
        username: 'Имя пользователя',
        password: 'Пароль'
      }
    },
    en: {
      auth: {
        login: 'Sign In',
        username: 'Username',
        password: 'Password'
      }
    }
  }
})

const app = createApp(App)

// Регистрируем все наши "сервисы"
app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(PrimeVue, {
    theme: {
        preset: Aura, // Современная минималистичная тема
        options: {
            darkModeSelector: '.my-app-dark',
        }
    }
})

// Запускаем приложение
app.mount('#app')
