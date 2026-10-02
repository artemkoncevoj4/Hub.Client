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

const handleRegister = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ login: login.value, password: password.value })
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(err || 'Ошибка регистрации')
    }

    router.push('/login')
  } catch (err: unknown) {
    errorMessage.value = err instanceof Error ? err.message : 'Ошибка регистрации'
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
          <i class="pi pi-id-card auth-icon"></i>
          <h2 class="m-0">Создать аккаунт</h2>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="handleRegister" class="auth-form">
          <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

          <div class="form-group">
            <label for="login">Придумайте логин</label>
            <InputText id="login" v-model="login" required placeholder="Например, user123" class="w-full" />
          </div>

          <div class="form-group">
            <label for="password">Придумайте пароль</label>
            <Password id="password" v-model="password" required placeholder="Сложный пароль" toggleMask class="w-full" inputClass="w-full" promptLabel="Введите пароль" weakLabel="Слабый" mediumLabel="Средний" strongLabel="Надежный" />
          </div>

          <Button type="submit" label="Зарегистрироваться" icon="pi pi-check" severity="success" :loading="isLoading" class="w-full mt-3" />
        </form>
      </template>

      <template #footer>
        <div class="text-center mt-3">
          <span class="text-gray">Уже есть аккаунт? </span>
          <a href="#" @click.prevent="router.push('/login')" class="auth-link">Войти</a>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.auth-page { display: flex; justify-content: center; align-items: center; min-height: 80vh; padding: 2rem; }
.auth-card { width: 100%; max-width: 420px; background-color: var(--p-surface-800); border: 1px solid var(--p-surface-700); color: white; }
.auth-card :deep(.p-card-title) { color: white !important; }
.auth-icon { font-size: 2.5rem; color: var(--p-green-400); margin-bottom: 1rem; }
.text-center { text-align: center; }
.m-0 { margin: 0; }
.mt-3 { margin-top: 1rem; }
.w-full { width: 100%; }
.auth-form { display: flex; flex-direction: column; gap: 1.2rem; margin-top: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.text-gray { color: #aaa; }
.auth-link { color: var(--p-green-400); text-decoration: none; font-weight: bold; }
.error-msg { color: var(--p-red-400); margin: 0; font-size: 0.9rem; text-align: center; }
:deep(.p-password > input) { width: 100%; }
</style>
