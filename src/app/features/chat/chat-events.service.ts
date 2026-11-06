import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface MessageEventDto {
  from: string;
  to: string;
  text: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
}

export interface StatusEventDto {
  count: number;
}

@Injectable({ providedIn: 'root' })
export class ChatEventsService implements OnDestroy {
  private eventSource: EventSource | null = null;
  private message$ = new Subject<MessageEventDto>();
  private delivered$ = new Subject<StatusEventDto>();
  private read$ = new Subject<StatusEventDto>();

  readonly message = this.message$.asObservable();
  readonly delivered = this.delivered$.asObservable();
  readonly read = this.read$.asObservable();

  connect(token: string): void {
    this.disconnect();
    this.eventSource = new EventSource(`/api/events?token=${encodeURIComponent(token)}`);
    this.eventSource.addEventListener('message', e => {
      this.message$.next(JSON.parse((e as MessageEvent).data));
    });
    this.eventSource.addEventListener('delivered', e => {
      this.delivered$.next(JSON.parse((e as MessageEvent).data));
    });
    this.eventSource.addEventListener('read', e => {
      this.read$.next(JSON.parse((e as MessageEvent).data));
    });
  }

  disconnect(): void {
    this.eventSource?.close();
    this.eventSource = null;
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
