import { HttpErrorResponse } from '@angular/common/http';

export function apiErrorMessage(e: unknown): string {
  return e instanceof HttpErrorResponse && e.error?.error
    ? e.error.error
    : 'Не удалось выполнить запрос';
}
