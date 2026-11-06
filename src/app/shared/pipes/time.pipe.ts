import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appTime', standalone: true })
export class TimePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    const date = new Date(value);
    return isNaN(date.getTime()) ? '' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
