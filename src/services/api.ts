const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/files/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Ошибка загрузки файла');
    }

    return await response.json();
  },

  async getFilesList() {
    const response = await fetch(`${API_URL}/files/list`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Ошибка получения списка файлов');
    }

    return await response.json();
  },

  async downloadFile(id: number, filename: string) {
    const response = await fetch(`${API_URL}/files/download/${id}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Ошибка скачивания файла');
    }

    // Преобразуем ответ в бинарный объект (Blob) и вызываем скачивание браузером
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }
};
