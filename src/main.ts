import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false, // Обязательно для Vue 3 (Composition API)
  locale: 'ru',
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


app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.my-app-dark',
        }
    }
})


app.mount('#app')
