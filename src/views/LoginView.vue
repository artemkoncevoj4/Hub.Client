<script setup lang="ts">
import { ref } from 'vue'

// Создаем реактивные переменные для полей формы
const login = ref('')
const password = ref('')

const handleLogin = () => {
  console.log('Отправка на бэкенд:', {
    Login: login.value,
    Password: password.value
  })
  // Сюда мы позже добавим реальный запрос к C# через fetch или axios
}
</script>

<template>
  <div class="auth-container">
    <h2>Вход в систему</h2>
    <form @submit.prevent="handleLogin" class="auth-form">
      <div class="form-group">
        <label for="login">Логин:</label>
        <input v-model="login" type="text" id="login" required placeholder="Введите логин" />
      </div>

      <div class="form-group">
        <label for="password">Пароль:</label>
        <input v-model="password" type="password" id="password" required placeholder="Введите пароль" />
      </div>

      <button type="submit" class="btn">Войти</button>
    </form>
  </div>
</template>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.auth-form {
  display: flex;
  flex-direction: column;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
.btn {
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.btn:hover {
  background-color: #3aa876;
}
</style>
