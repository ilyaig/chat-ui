import { Component, Input } from '@angular/core';
import { StatusTicksComponent, TimePipe } from '@shared';
import { ChatMessage } from '../models';

/**
 * Элемент списка сообщений
 */
@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [StatusTicksComponent, TimePipe],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {
  @Input({ required: true }) messages: ChatMessage[] = [];
  @Input({ required: true }) currentUsername!: string;
}
