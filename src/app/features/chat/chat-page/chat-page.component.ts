import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {AuthService} from '@core';
import {UserListComponent} from '../user-list/user-list.component';
import {MessageListComponent} from '../message-list/message-list.component';
import {MessageInputComponent} from '../message-input/message-input.component';
import {ChatService} from '../chat.service';
import {ChatEventsService} from '../chat-events.service';
import {ChatMessage, ChatUser} from '../models';

/**
 * Страница чата
 */
@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [UserListComponent, MessageListComponent, MessageInputComponent],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css'
})
export class ChatPageComponent implements OnInit, OnDestroy {
  readonly users = signal<ChatUser[]>([]);
  readonly selected = signal<string | null>(null);
  readonly messages = signal<ChatMessage[]>([]);

  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly chat = inject(ChatService);
  private readonly events = inject(ChatEventsService);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    const token = this.auth.token();
    if (token) this.events.connect(token);

    this.events.message.subscribe(msg => this.onIncoming(msg));
    this.events.delivered.subscribe(() => this.refreshSelected());
    this.events.read.subscribe(() => this.refreshSelected());
    this.events.user.subscribe(user => this.addUser(user));

    this.chat.users()
        .subscribe(list => this.users.set(list));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.events.disconnect();
  }

  /**
   * Открыть чат с пользователем
   */
  openChat(username: string): void {
    this.selected.set(username);
    this.chat.markRead(username).subscribe();
    this.refreshSelected();
  }

  /**
   * Отправить сообщение
   * @param text сообщение
   */
  onSend(text: string): void {
    const to = this.selected();
    if (!to) return;
    this.chat.send(to, text).subscribe(() => this.refreshSelected());
  }

  /** Выйти */
  logout(): void {
    this.events.disconnect();
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  /**
   * Добавить сообщение в беседу
   * @param msg сообщение
   */
  private onIncoming(msg: ChatMessage): void {
    const partner = this.selected();
    const me = this.auth.username();
    if (!partner || !me) return;
    const relevant =
      (msg.to === me && msg.from === partner) ||
      (msg.from === me && msg.to === partner);
    if (relevant) this.messages.update(values => {
      return [...values, msg];
    });
  }

  /**
   * Обновить беседу
   */
  private refreshSelected(): void {
    const partner = this.selected();
    if (!partner) return;
    this.chat.conversation(partner)
      .subscribe(conv => this.messages.set(conv.messages));
  }

  /**
   * Обновить пользователей
   */
  private refreshUsers() {
    this.chat.users()
        .subscribe(list => this.users.set(list));
  }

  /**
   * Добавить пользователя
   */
  private addUser(user: ChatUser) {
  this.users.update(values => {
      return [...values, user];
    });
  }
}
