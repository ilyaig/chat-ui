import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@core';
import { ChatMessage, ChatUser, Conversation, MessageStatus } from './models';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  users(): Observable<ChatUser[]> {
    return this.http.get<ChatUser[]>(`${this.apiUrl}/users`);
  }

  conversation(with_: string): Observable<Conversation> {
    return this.http.get<Conversation>(`${this.apiUrl}/conversation`, { params: { with: with_ } });
  }

  send(to: string, text: string): Observable<{ id: number; status: MessageStatus }> {
    return this.http.post<{ id: number; status: MessageStatus }>(
      `${this.apiUrl}/messages`, { to, text });
  }

  markRead(with_: string): Observable<{ markedRead: number }> {
    return this.http.post<{ markedRead: number }>(
      `${this.apiUrl}/messages/read`, { with: with_ });
  }
}
