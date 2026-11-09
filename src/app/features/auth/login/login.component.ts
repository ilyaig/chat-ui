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

    this.busy.set(true);
    // login() и register() возвращают одинаковый Session,
    // поэтому обработка результата общая
    const call =
        this.mode() === 'login'
            ? this.auth.login(this.username, this.password)
            : this.auth.register(this.username, this.password);

    call.subscribe({
      next: () => this.router.navigate(['/chat']),
      error: e => {
        this.busy.set(false);
        this.error.set(apiErrorMessage(e));
      }
    });
  }
}