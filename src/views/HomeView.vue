<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Card from 'primevue/card'

const router = useRouter()
const isAuthenticated = ref(false)
const currentUser = ref<string | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' })
    if (res.ok) {
      const data = await res.json()
      currentUser.value = data.login
      isAuthenticated.value = true
    } else {
      isAuthenticated.value = false
    }
  } catch {
    isAuthenticated.value = false
  }
})

const handleLogout = async () => {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
  isAuthenticated.value = false
  currentUser.value = null
}

const microservices = ref([
  {
    id: 'filevault',
    name: 'FileVault',
    description: 'Надежное облачное хранилище. Управляйте своими файлами безопасно и быстро.',
    icon: 'pi pi-cloud',
    status: 'Доступно',
    route: '/filevault',
    requiresAuth: true
  },
  {
    id: 'chat',
    name: 'AI Chat',
    description: 'AI. Начните общение с ИИ.',
    icon: 'pi pi-comments',
    status: 'В разработке',
    route: '',
    requiresAuth: false
  }
])
</script>

<template>
  <div class="hub-container">
    <header class="hub-header">
      <div class="logo">
        <i class="pi pi-server" style="font-size: 2rem; color: var(--p-primary-color)"></i>
        <h1>Hub Ecosystem</h1>
      </div>
      <div class="auth-actions">
        <template v-if="!isAuthenticated">
          <Button label="Войти" icon="pi pi-user" severity="primary" @click="router.push('/login')" />
          <Button label="Регистрация" severity="secondary" outlined @click="router.push('/register')" />
        </template>
        <template v-else>
          <span class="user-welcome">Привет, <b>{{ currentUser }}</b></span>
          <Button label="Выйти" icon="pi pi-sign-out" severity="danger" outlined @click="handleLogout" />
        </template>
      </div>
    </header>

    <main class="services-grid">
      <Card v-for="service in microservices" :key="service.id" class="service-card">
        <template #header>
          <div class="card-icon-wrapper">
            <i :class="service.icon" class="card-icon"></i>
          </div>
        </template>
        <template #title>{{ service.name }}</template>
        <template #subtitle>
          <span :class="service.status === 'Доступно' ? 'status-active' : 'status-dev'">
            {{ service.status }}
          </span>
        </template>
        <template #content>
          <p class="m-0">{{ service.description }}</p>
        </template>
        <template #footer>
          <div class="card-footer">
            <Button
              v-if="service.requiresAuth && !isAuthenticated"
              label="Требуется вход"
              icon="pi pi-lock"
              severity="secondary"
              disabled
              class="w-full"
            />
            <Button
              v-else
              label="Открыть"
              icon="pi pi-arrow-right"
              :disabled="!service.route"
              @click="router.push(service.route)"
              class="w-full"
            />
          </div>
        </template>
      </Card>
    </main>
  </div>
</template>

<style scoped>
.hub-container { max-width: 1200px; margin: 0 auto; padding: 2rem; width: 100%; }
.service-card :deep(.p-card-title), .service-card :deep(.p-card-content), .service-card :deep(.p-card-subtitle) { color: white !important; }
.hub-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4rem; padding-bottom: 1rem; border-bottom: 1px solid var(--p-surface-700); }
.logo { display: flex; align-items: center; gap: 1rem; }
.logo h1 { margin: 0; font-weight: 600; letter-spacing: -0.5px; }
.auth-actions { display: flex; align-items: center; gap: 1rem; }
.user-welcome { color: var(--p-surface-200); font-size: 0.95rem; }
.services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
.service-card { background-color: var(--p-surface-800); border: 1px solid var(--p-surface-700); transition: transform 0.2s, box-shadow 0.2s; }
.service-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
.card-icon-wrapper { background-color: var(--p-surface-900); padding: 2rem; text-align: center; border-bottom: 1px solid var(--p-surface-700); }
.card-icon { font-size: 3rem; color: var(--p-primary-color); }
.status-active { color: var(--p-green-400); font-size: 0.875rem; font-weight: bold; }
.status-dev { color: var(--p-orange-400); font-size: 0.875rem; font-weight: bold; }
.card-footer { margin-top: 1rem; }
.w-full { width: 100%; }
.m-0 { margin: 0; }
</style>
