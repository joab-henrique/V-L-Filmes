import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Movie } from '../../types/movie.type';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  standalone: true,
  imports: [CommonModule, AsyncPipe, MovieCardComponent]
})
export class SearchResultsComponent {
  @Input() movies$!: Observable<Movie[]>;   // Recebe lista de filmes como Observable
  @Output() movieClick = new EventEmitter<Movie>(); // Emite evento quando algum card é clicado

  // Método chamado quando algum MovieCard é clicado:
  onMovieCardClicked(movie: Movie): void {
    this.movieClick.emit(movie);
  }
}
