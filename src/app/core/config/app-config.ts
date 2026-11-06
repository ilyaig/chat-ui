import { environment } from '@env/environment';

export const APP_CONFIG = {
  pollIntervalMs: environment.pollIntervalMs,
  usersRefreshMs: environment.usersRefreshMs
} as const;
