import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDuration',
  standalone: true
})
export class FormatDurationPipe implements PipeTransform {

  // Transforma duração em minutos para formato de horas e minutos:
  transform(value: number | null): string {
    if (value === null || value <= 0) {
      return '0min'; // cCso não haja duração, ou seja 0
    }

    const hours = Math.floor(value / 60);    // Calcula horas inteiras
    const minutes = value % 60;              // Calcula minutos restantes

    let result = '';
    if (hours > 0) {
      result += `${hours}h `; // Adiciona horas, se houver
    }
    if (minutes > 0) {
      result += `${minutes}min`; // Adiciona minutos, se houver
    }

    return result;    // Retorna string formatada
  }
}
