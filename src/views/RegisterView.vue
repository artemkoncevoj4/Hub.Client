<script setup lang="ts">
import { ref } from 'vue'

const login = ref('')
const password = ref('')

const handleRegister = () => {
  console.log('Регистрация пользователя:', {
    Login: login.value,
    Password: password.value
  })
}
</script>

<template>
  <div class="auth-container">
    <h2>Регистрация</h2>
    <form @submit.prevent="handleRegister" class="auth-form">
      <div class="form-group">
        <label for="login">Логин:</label>
        <input v-model="login" type="text" id="login" required placeholder="Придумайте логин" />
      </div>

      <div class="form-group">
        <label for="password">Пароль:</label>
        <input v-model="password" type="password" id="password" required placeholder="Придумайте пароль" />
      </div>

      <button type="submit" class="btn">Зарегистрироваться</button>
    </form>
  </div>
</template>

<style scoped>
.auth-container { max-width: 400px; margin: 50px auto; padding: 30px; border: 1px solid #ddd; border-radius: 8px; }
.auth-form { display: flex; flex-direction: column; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
.form-group input { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
.btn { padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
.btn:hover { background-color: #0056b3; }
</style>
