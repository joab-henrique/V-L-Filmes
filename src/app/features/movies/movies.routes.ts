import { Routes } from '@angular/router';
import { MovieListComponent } from './pages/main/movie-list.component';

export const MOVIE_ROUTES: Routes = [
  {
    path: '',
    component: MovieListComponent
  },
  {
    path: 'popular',      // Não funciona. A ideia era pra carregar todos os populares, assim como todos os mais votados, etc
    component: MovieListComponent 
  },
  {
    path: 'top-rated',    // Não funciona. A ideia era pra carregar todos os populares, assim como todos os mais votados, etc
    component: MovieListComponent 
  },
  {
    path: 'up-coming',      // Não funciona. A ideia era pra carregar todos os populares, assim como todos os mais votados, etc
    component: MovieListComponent 
  }
];
