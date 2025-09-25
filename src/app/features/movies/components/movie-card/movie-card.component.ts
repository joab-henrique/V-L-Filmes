import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../types/movie.type';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  // Recebe o filme do type:
  @Input() movie!: Movie;

  // Evento disparado ao clicar no card:
  @Output() cardClick = new EventEmitter<Movie>();

  // Controla a exibição de modal de detalhes (ainda não implementado):
  showModal = false;

  // Método chamado ao clicar no card:
  onCardClicked() {
    console.log('Card clicado: ', this.movie);
    this.cardClick.emit(this.movie);
  }

  // Monta a URL do poster a partir do "poster_path" da AP: (Se não tiver, usa imagem local "no-poster.png")
  getPosterUrl(posterPath: string | null): string {
  return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'public/no-poster.png';
}

}
