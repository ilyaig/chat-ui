/**
 * Production-конфигурация. Подставляется вместо environment.ts
 * в production-сборке (fileReplacements в angular.json).
 * Имя экспорта совпадает с базовым — импорты не меняются.
 */
export const environment = {
  apiUrl: '/api',
  pollIntervalMs: 2000,
  usersRefreshMs: 5000
};
