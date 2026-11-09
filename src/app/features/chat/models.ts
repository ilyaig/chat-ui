export interface ChatUser {
  username: string;
  registeredAt: string;
}

export interface ChatMessage {
  id: number;
  from: string;
  to: string;
  text: string;
  status: MessageStatus;
  createdAt: string;
}

export interface Conversation {
  with: string;
  messages: ChatMessage[];
}

export type { MessageStatus } from '../../shared/models';
import type { MessageStatus } from '@shared';
