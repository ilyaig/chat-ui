# --- Этап 1: сборка Angular-приложения ---
FROM node:20-alpine AS build
WORKDIR /app

# Сначала только манифесты зависимостей: этот слой кэшируется,
# и npm ci не запускается заново при правках исходников
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build:prod

# --- Этап 2: раздача статики через nginx ---
FROM nginx:1.27-alpine

# Конфиг с проксированием /api на сервер (имя "server" — из docker-compose)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Собранный бандл из первого этапа
COPY --from=build /app/dist/chat-ui/browser /usr/share/nginx/html

EXPOSE 80