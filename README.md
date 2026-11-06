# chat-ui — фронтенд чата (Angular 17)

Тёмный интерфейс чата в духе ICQ: список пользователей, переписка,
статусы доставки (✓ / ✓✓ / зелёные ✓✓) в реальном времени через SSE.

## Архитектура
- `src/app/core` — инфраструктура: AuthService, интерсептор, guard, API_URL, конфиг
- `src/app/shared` — переиспользуемые кирпичики: StatusTicksComponent, TimePipe, типы
- `src/app/features` — экраны: auth (логин/регистрация), chat (чат-страница)
- Алиасы импортов: `@core`, `@shared`, `@features`, `@env`

## Запуск
1. Поднимите бэкенд (chat-server-spring.zip): `docker compose up --build` — порт 8080.
2. Здесь: `npm install`, затем `npm start` — http://localhost:4200
   (dev-прокси перенаправляет /api на бэкенд, см. proxy.conf.json).

## Production-сборка
`npm run build` → статика в `dist/chat-ui/browser`.
Раздавайте любым статическим сервером; если API на другом домене —
укажите его URL в `src/environments/environment.production.ts`.

## Реактивность
Переписка и статусы приходят через Server-Sent Events (`/api/events?token=...`).
EventSource сам переподключается при обрыве. Список пользователей
обновляется раз в 5 секунд (интервалы — в environment).
