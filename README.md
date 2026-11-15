# chat-ui — фронтенд чата (Angular 17)

Тёмный интерфейс чата в духе ICQ: список пользователей, переписка,
статусы доставки (✓ / ✓✓ / зелёные ✓✓) в реальном времени через SSE.

## Архитектура
- `src/app/core` — инфраструктура: AuthService, интерсептор, guard, API_URL, конфиг
- `src/app/shared` — переиспользуемые кирпичики: StatusTicksComponent, TimePipe, типы
- `src/app/features` — экраны: auth (логин/регистрация), chat (чат-страница)
- Алиасы импортов: `@core`, `@shared`, `@features`, `@env`

## Запуск №1
1. Поднимите бэкенд (chat-server): `docker compose up -f docker-compose-alone --build` — порт 8080.
2. Поднимите фронт: `docker compose up -f docker-compose-alone --build`

## Запуск №2
1. Поднимите всё: `docker compose up -f docker-compose-all --build`. Папка сервера(chat-server) должна лежать рядом с папкой фронта(chat-ui)

## Реактивность
Переписка и статусы приходят через Server-Sent Events (`/api/events?token=...`).
EventSource сам переподключается при обрыве. Список пользователей
обновляется раз в 5 секунд (интервалы — в environment).