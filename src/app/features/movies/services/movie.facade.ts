import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { MovieApiService } from '../api/movie.api';
import { MovieStateService } from '../state/movie.state';
import { Movie, MovieResponse, PersonResponse } from '../types/movie.type'; 
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root' // Serviço global
})
export class MovieFacade {
  private api = inject(MovieApiService);
  public state = inject(MovieStateService);
  private http = inject(HttpClient);

  private API_URL = 'https://api.themoviedb.org/3';
  private API_KEY = environment.apiKey;

  movies$ = this.state.movies$; // Observable público de filmes para os componentes

  // Carrega filmes populares e atualiza estado:
  loadPopularMovies(page = 1) {
    this.state.setLoading(true);
    this.api.getPopularMovies(page).pipe(
      tap(response => {
        this.state.setMovies(response.results);
        this.state.setPagination(response.page, response.total_pages);
        this.state.setLoading(false);
      }),
      catchError(err => {
        this.state.setError('Failed to load popular movies.');
        this.state.setLoading(false);
        return of(null);
      })
    ).subscribe();
  }

  // Busca filmes por título ou ator/diretor
  searchMovies(query: string, page = 1): Observable<Movie[]> {
    this.state.setLoading(true);

    const defaultMovieResponse: MovieResponse = {
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0
    };
    const defaultPersonResponse: PersonResponse = {
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0
    };

    // Busca (paralela) de filmes por título e nome de pessoas
    return forkJoin({
      movies: this.api.searchMovies(query, page).pipe(catchError(() => of(defaultMovieResponse))),
      people: this.api.searchPerson(query, page).pipe(catchError(() => of(defaultPersonResponse)))
    }).pipe(
      switchMap(({ movies, people }) => {
        this.state.setPagination(movies.page, movies.total_pages);

        const moviesFromTitle = movies.results;
        const firstPerson = people.results.length > 0 ? people.results[0] : null;

        if (firstPerson) {
          // Se encontrou pessoa, busca filmes relacionados:
          return this.api.getPersonMovieCredits(firstPerson.id).pipe(
            map(credits => {
              const moviesFromPerson = [...credits.cast, ...credits.crew];
              const allMovies = new Map<number, Movie>();

              // Remove filmes duplicados:
              moviesFromPerson.forEach(movie => movie.id && allMovies.set(movie.id, movie));
              moviesFromTitle.forEach(movie => movie.id && allMovies.set(movie.id, movie));

              return Array.from(allMovies.values());
            })
          );
        } else {
          return of(moviesFromTitle); // Se não, só filmes por titulo
        }
      }),
      tap(() => this.state.setLoading(false)),
      catchError(err => {
        this.state.setError('Falha ao executar a busca.');
        this.state.setLoading(false);
        return of([]);
      })
    );
  }

  // Descobre filmes com filtros de gênero, ano e ordenação
  discoverMovies(genre: string, year: string, sort: string, page = 1) {
    this.state.setLoading(true);
    this.api.getFilteredMovies(genre, year, sort, page).pipe(
      tap(response => {
        this.state.setMovies(response.results);
        this.state.setPagination(response.page, response.total_pages);
        this.state.setLoading(false);
      }),
      catchError(err => {
        this.state.setError('Failed to load filtered movies.');
        this.state.setLoading(false);
        return of(null);
      })
    ).subscribe();
  }

  // Busca detalhes completos de um filme pelo ID
  getMovieDetails(id: number): Observable<Movie> {
    const url = `${this.API_URL}/movie/${id}?api_key=${this.API_KEY}&language=pt-BR`;
    return this.http.get<Movie>(url);
  }
}
