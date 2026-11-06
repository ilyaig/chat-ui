import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, apiErrorMessage } from '@core';

/**
 * Экран входа и регистрации.
 * Переключается между режимами по ссылке «Создать аккаунт / У меня есть аккаунт».
 * После успешной регистрации автоматически выполняет вход.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  /** Текущий режим экрана: вход или регистрация. */
  readonly mode = signal<'login' | 'register'>('login');

  /** Флаг активного запроса — блокирует кнопку отправки. */
  readonly busy = signal(false);

  /** Текст ошибки для показа пользователю. */
  readonly error = signal<string | null>(null);

  /** Введённый логин. */
  username = '';

  /** Введённый пароль. */
  password = '';

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** Переключает режим логин ↔ регистрация и сбрасывает ошибку. */
  toggleMode(): void {
    this.mode.update(m => m === 'login' ? 'register' : 'login');
    this.error.set(null);
  }

  /** Отправляет форму: логин или регистрацию с последующим входом. */
  submit(): void {
    this.error.set(null);

    if (this.mode() === 'login') {
      this.login();
    } else {
      this.register();
    }
  }

  /** Вход: получает токен и переходит в чат. */
  private login(): void {
    this.busy.set(true);
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/chat']),
      error: e => {
        this.busy.set(false);
        this.error.set(apiErrorMessage(e));
      }
    });
  }

  /** Регистрация нового аккаунта с последующим автоматическим входом. */
  private register(): void {
    this.busy.set(true);
    this.auth.register(this.username, this.password).subscribe({
      next: () => this.auth.login(this.username, this.password).subscribe({
        next: () => this.router.navigate(['/chat']),
        error: e => {
          this.busy.set(false);
          this.error.set(apiErrorMessage(e));
        }
      }),
      error: e => {
        this.busy.set(false);
        this.error.set(apiErrorMessage(e));
      }
    });
  }
}