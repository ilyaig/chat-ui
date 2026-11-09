import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * Элемент ввода сообщения
 */
@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.css'
})
export class MessageInputComponent {
  draft = '';
  @Output() send = new EventEmitter<string>();

  /**
   * Отправить
   */
  submit(): void {
    const text = this.draft.trim();
    if (!text) return;
    this.send.emit(text);
    this.draft = '';
  }
}
