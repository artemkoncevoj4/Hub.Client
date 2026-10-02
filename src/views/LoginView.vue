<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

const router = useRouter()
const login = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // ОБЯЗАТЕЛЬНО: браузер сохранит HttpOnly Cookie
      body: JSON.stringify({ login: login.value, password: password.value })
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(err || 'Неверный логин или пароль')
    }

    router.push('/')
  } catch (err: unknown) {
    errorMessage.value = err instanceof Error ? err.message : 'Ошибка входа'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <Card class="auth-card">
      <template #title>
        <div class="text-center">
          <i class="pi pi-user-plus auth-icon"></i>
          <h2 class="m-0">Вход в систему</h2>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="handleLogin" class="auth-form">
          <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

          <div class="form-group">
            <label for="login">Логин</label>
            <InputText id="login" v-model="login" required placeholder="Введите логин" class="w-full" />
          </div>

          <div class="form-group">
            <label for="password">Пароль</label>
            <Password id="password" v-model="password" required placeholder="Введите пароль" :feedback="false" toggleMask class="w-full" inputClass="w-full" />
          </div>

          <Button type="submit" label="Войти" icon="pi pi-sign-in" :loading="isLoading" class="w-full mt-3" />
        </form>
      </template>

      <template #footer>
        <div class="text-center mt-3">
          <span class="text-gray">Нет аккаунта? </span>
          <a href="#" @click.prevent="router.push('/register')" class="auth-link">Зарегистрироваться</a>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.auth-page { display: flex; justify-content: center; align-items: center; min-height: 80vh; padding: 2rem; }
.auth-card { width: 100%; max-width: 420px; background-color: var(--p-surface-800); border: 1px solid var(--p-surface-700); color: white; }
.auth-card :deep(.p-card-title) { color: white !important; }
.auth-icon { font-size: 2.5rem; color: var(--p-primary-color); margin-bottom: 1rem; }
.text-center { text-align: center; }
.m-0 { margin: 0; }
.mt-3 { margin-top: 1rem; }
.w-full { width: 100%; }
.auth-form { display: flex; flex-direction: column; gap: 1.2rem; margin-top: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.text-gray { color: #aaa; }
.auth-link { color: var(--p-primary-color); text-decoration: none; font-weight: bold; }
.error-msg { color: var(--p-red-400); margin: 0; font-size: 0.9rem; text-align: center; }
:deep(.p-password > input) { width: 100%; }
</style>
