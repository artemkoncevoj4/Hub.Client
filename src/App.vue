<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav class="main-nav">
      <RouterLink to="/login">Вход</RouterLink> |
      <RouterLink to="/register">Регистрация</RouterLink>
    </nav>
  </header>

  <main class="content">
    <RouterView />
  </main>
</template>

<style scoped>
.main-nav {
  padding: 20px;
  background-color: #f5f5f5;
  text-align: center;
}
.main-nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 10px;
}
.main-nav a.router-link-exact-active {
  color: #42b983;
}
.content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
