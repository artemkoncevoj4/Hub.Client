<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { api } from '../services/api'

// Интерфейс для типизации файла с бэкенда
interface FileItem {
  id: number
  virtualName: string
  isLocked: boolean
  size: number
}

const selectedFile = ref<File | null>(null)
const isUploading = ref(false)
const uploadStatus = ref<{ type: 'success' | 'error'; text: string } | null>(null)

// Новые состояния для списка файлов
const files = ref<FileItem[]>([])
const isLoadingFiles = ref(false)

// Форматирование размера файла (Байты -> КБ / МБ)
const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const loadFiles = async () => {
  isLoadingFiles.value = true
  try {
    files.value = await api.getFilesList()
  } catch {
    console.error('Не удалось загрузить файлы')
  } finally {
    isLoadingFiles.value = false
  }
}

const onFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    selectedFile.value = file
    uploadStatus.value = null
  } else {
    selectedFile.value = null
  }
}

const handleUpload = async () => {
  if (!selectedFile.value) return
  const fileToUpload = selectedFile.value as File

  isUploading.value = true
  uploadStatus.value = null

  try {
    const result = await api.uploadFile(fileToUpload)
    uploadStatus.value = { type: 'success', text: `Успешно: ${result.message}` }
    selectedFile.value = null
    await loadFiles() // Обновляем список файлов после успешной загрузки
  } catch (error: unknown) {
    if (error instanceof Error) {
      uploadStatus.value = { type: 'error', text: error.message }
    } else {
      uploadStatus.value = { type: 'error', text: 'Произошла неизвестная ошибка' }
    }
  } finally {
    isUploading.value = false
  }
}

const handleDownload = async (id: number, filename: string) => {
  try {
    await api.downloadFile(id, filename)
  } catch {
    alert('Не удалось скачать файл')
  }
}

// Загружаем список файлов сразу при открытии страницы
onMounted(() => {
  loadFiles()
})
</script>

<template>
  <div class="filevault-container">
    <h2>Облачное хранилище FileVault</h2>

    <!-- Блок загрузки файла -->
    <div class="upload-box">
      <input type="file" id="fileInput" class="hidden-input" @change="onFileSelect" />
      <div class="file-selector">
        <label for="fileInput" class="custom-file-button">
          <i class="pi pi-search"></i> Выбрать файл
        </label>
        <span class="file-name" v-if="selectedFile">{{ selectedFile.name }}</span>
        <span class="file-name text-gray" v-else>Файл не выбран</span>
      </div>
      <Button
        label="Загрузить в облако"
        icon="pi pi-cloud-upload"
        severity="success"
        :loading="isUploading"
        :disabled="!selectedFile"
        @click="handleUpload"
        class="w-full"
      />
    </div>

    <Message v-if="uploadStatus" :severity="uploadStatus.type" class="mt-3">
      {{ uploadStatus.text }}
    </Message>

    <!-- Блок со списком файлов -->
    <div class="files-list-box mt-4">
      <h3>Мои файлы</h3>

      <div v-if="isLoadingFiles" class="text-center text-gray mt-3">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      </div>

      <div v-else-if="files.length === 0" class="text-center text-gray mt-3">
        Файлов пока нет. Загрузите свой первый файл!
      </div>

      <div v-else class="file-items mt-3">
        <div v-for="file in files" :key="file.id" class="file-item">
          <div class="file-info">
            <i class="pi pi-file file-icon"></i>
            <div class="file-details">
              <span class="file-title">{{ file.virtualName }}</span>
              <span class="file-size">{{ formatSize(file.size) }}</span>
            </div>
          </div>

          <div class="file-actions">
            <span v-if="file.isLocked" class="locked-badge" title="Файл заблокирован">
              <i class="pi pi-lock"></i>
            </span>
            <Button
              icon="pi pi-download"
              severity="secondary"
              text
              rounded
              aria-label="Скачать"
              @click="handleDownload(file.id, file.virtualName)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filevault-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: var(--p-surface-800);
  border-radius: 12px;
  border: 1px solid var(--p-surface-700);
  color: white;
}

.upload-box {
  background-color: var(--p-surface-900);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px dashed var(--p-surface-600);
}

.hidden-input {
  display: none;
}
.file-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.custom-file-button {
  display: inline-block;
  padding: 0.75rem 1rem;
  background-color: var(--p-primary-color);
  color: var(--p-primary-contrast-color);
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}
.custom-file-button:hover {
  filter: brightness(1.1);
}
.file-name {
  font-size: 0.9rem;
  word-break: break-all;
}
.text-gray {
  color: #aaa;
}
.text-center {
  text-align: center;
}
.mt-3 {
  margin-top: 1rem;
}
.mt-4 {
  margin-top: 2rem;
}
.w-full {
  width: 100%;
}

/* Стили для списка файлов */
.files-list-box {
  background-color: var(--p-surface-900);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--p-surface-700);
}

.files-list-box h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--p-surface-700);
  padding-bottom: 0.5rem;
}

.file-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--p-surface-800);
  border: 1px solid var(--p-surface-700);
  border-radius: 6px;
  transition: background-color 0.2s;
}

.file-item:hover {
  background-color: var(--p-surface-700);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-icon {
  font-size: 1.5rem;
  color: var(--p-primary-color);
}

.file-details {
  display: flex;
  flex-direction: column;
}

.file-title {
  font-weight: 600;
  word-break: break-all;
}

.file-size {
  font-size: 0.8rem;
  color: var(--p-surface-400);
}

.file-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.locked-badge {
  color: var(--p-orange-400);
  font-size: 1.2rem;
}
</style>
