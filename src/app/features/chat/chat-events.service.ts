import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {ChatMessage, ChatUser} from "@features/chat/models";

export interface MessageEventDto {
  from: string;
  to: string;
  text: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
}

export interface StatusEventDto {
  count: number;
}

/**
 * Сервис событий чата
 */
@Injectable({ providedIn: 'root' })
export class ChatEventsService implements OnDestroy {
  private eventSource: EventSource | null = null;
  private message$ = new Subject<ChatMessage>();
  private delivered$ = new Subject<StatusEventDto>();
  private read$ = new Subject<StatusEventDto>();
  private user$ = new Subject<ChatUser>();

  readonly message = this.message$.asObservable();
  readonly delivered = this.delivered$.asObservable();
  readonly read = this.read$.asObservable();
  readonly user = this.user$.asObservable();

  /**
   * Соединиться с сервером на получение событий
   * @param token токен
   */
  connect(token: string): void {
    this.disconnect();
    this.eventSource = new EventSource(`/api/events?token=${encodeURIComponent(token)}`);
    this.eventSource.addEventListener('message', e => {
      console.log('message', e);
      this.message$.next(JSON.parse((e as MessageEvent).data));
    });
    this.eventSource.addEventListener('delivered', e => {
      console.log('delivered', e);
      this.delivered$.next(JSON.parse((e as MessageEvent).data));
    });
    this.eventSource.addEventListener('read', e => {
      console.log('read', e);
      this.read$.next(JSON.parse((e as MessageEvent).data));
    });
    this.eventSource.addEventListener('user', e => {
      console.log('user', e);
      this.user$.next(JSON.parse((e as MessageEvent).data));
    });
  }

  /** отсоединиться */
  disconnect(): void {
    this.eventSource?.close();
    this.eventSource = null;
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
