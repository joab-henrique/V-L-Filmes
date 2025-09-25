import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieResponse, PersonMovieCreditsResponse, PersonResponse } from '../types/movie.type';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root' // serviço global, acessível em toda a aplicação
})
export class MovieApiService {
  private http = inject(HttpClient);
  apiKey = environment.apiKey;
  apiUrl = 'https://api.themoviedb.org/3';
  
  // Busca filmes populares e retorna um MovieResponse (/types/movie.type):
  getPopularMovies(page = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(
      `${this.apiUrl}/movie/popular?api_key=${this.apiKey}&page=${page}&language=pt-BR`
    );
  }

  // Busca filmes por título ou palavra-chave e retorna MovieResponse (/types/movie.type):
  searchMovies(query: string, page = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/search/movie`, {
      params: {
        api_key: this.apiKey,
        query: query,
        page: page.toString(),
        language: 'pt-BR'
      }
    });
  }

  // Busca pessoas (créditos) pelo nome e retorna PersonResponse (/types/movie.type):
  searchPerson(query: string, page = 1): Observable<PersonResponse> {
    return this.http.get<PersonResponse>(`${this.apiUrl}/search/person`, {
      params: {
        api_key: this.apiKey,
        query: query,
        page: page.toString(),
        language: 'pt-BR'
      }
    });
  }

  // Busca a filmografia de uma pessoa pelo ID e retorna PersonMovieCreditsResponse (/types/movie.type):
  getPersonMovieCredits(personId: number): Observable<PersonMovieCreditsResponse> {
    return this.http.get<PersonMovieCreditsResponse>(
      `${this.apiUrl}/person/${personId}/movie_credits`,
      {
        params: {
          api_key: this.apiKey,
          language: 'pt-BR'
        }
      }
    );
  }

  // Busca de filmes com filtros e retorna MovieResponse (/types/movie.type):
  getFilteredMovies(genre: string, year: string, sort: string, page: number): Observable<MovieResponse> {
    let params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('page', page.toString())
      .set('sort_by', sort || 'popularity.desc')
      .set('language', 'pt-BR');

    if (genre) {
      params = params.set('with_genres', genre);
    }
    if (year) {
      params = params.set('primary_release_year', year);
    }

    return this.http.get<MovieResponse>(`${this.apiUrl}/discover/movie`, { params });
  }
}
