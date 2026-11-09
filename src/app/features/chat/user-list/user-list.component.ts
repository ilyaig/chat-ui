import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ChatUser } from '../models';

/** Элемент списка собеседников */
@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  @Input({ required: true }) users: ChatUser[] = [];
  @Input() selected: string | null = null;
  @Input({ required: true }) currentUsername!: string;
  @Output() userSelected = new EventEmitter<string>();
  @Output() logout = new EventEmitter<void>();
}
