import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../api/api-url.token';
import { Session, RegisterResult } from './models';

const STORAGE_KEY = 'chat.token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly username = signal<string | null>(this.restore()?.username ?? null);
  readonly token = signal<string | null>(this.restore()?.token ?? null);
  readonly isLoggedIn = signal<boolean>(!!this.restore());

  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  /**
   * Зарегестрировать пользователя
   * @param username логин
   * @param password пароль
   */
  register(username: string, password: string): Observable<Session> {
    return this.http.post<Session>(`${this.apiUrl}/register`, { username, password });
  }

  /**
   * Войти
   * @param username логин
   * @param password пароль
   */
  login(username: string, password: string): Observable<Session> {
    return this.http.post<Session>(`${this.apiUrl}/login`, { username, password })
      .pipe(tap(s => this.save(s)));
  }

  /**
   * Выйти
   */
  logout(): void {
    sessionStorage.removeItem(STORAGE_KEY);
    this.username.set(null);
    this.token.set(null);
    this.isLoggedIn.set(false);
  }

  /**
   * Сохранить сессию
   * @param session сессия
   */
  private save(session: Session): void {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    this.username.set(session.username);
    this.token.set(session.token);
    this.isLoggedIn.set(true);
  }

  /**
   * Восстановить сессию
   */
  private restore(): Session | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.token ? parsed : null;
    } catch {
      return null;
    }
  }
}
