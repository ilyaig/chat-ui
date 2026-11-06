import { Component, Input } from '@angular/core';
import { MessageStatus } from '../../models';

@Component({
  selector: 'app-status-ticks',
  standalone: true,
  templateUrl: './status-ticks.component.html',
  styleUrl: './status-ticks.component.css'
})
export class StatusTicksComponent {
  @Input({ required: true }) status!: MessageStatus;
}
