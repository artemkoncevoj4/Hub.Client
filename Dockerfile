# Этап 1: Сборка приложения
FROM node:20-alpine AS build
WORKDIR /app

# Копируем файлы зависимостей и устанавливаем их
COPY package*.json ./
RUN npm install

# Копируем исходный код и запускаем сборку
COPY . .
RUN npm run build

# Этап 2: Раздача статики через Nginx
FROM nginx:alpine AS runtime

# Удаляем стандартный конфиг Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Копируем наш конфиг для SPA
COPY nginx.conf /etc/nginx/conf.d/

# Копируем собранные файлы Vue из первого этапа в папку Nginx
# В Vite папка сборки по умолчанию называется dist
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]