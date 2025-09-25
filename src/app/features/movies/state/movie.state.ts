import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Movie } from '../types/movie.type';

// Interface que define o estado da aplicação de filmes:
export interface MovieState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
}

// Estado inicial:
const initialState: MovieState = {
  movies: [],
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
};

@Injectable({
  providedIn: 'root' // Serviço global
})
export class MovieStateService {
  private readonly state = new BehaviorSubject<MovieState>(initialState);    // BehaviorSubject mantém o estado atual e passa atualizações para observadores

  readonly movies$ = this.state.asObservable();    // Observable que componentes podem usar para reagir a mudanças de estado

  // Retorna o estado atual:
  getState() {
    return this.state.getValue();
  }

  // Atualiza o estado:
  setState(newState: Partial<MovieState>) {
    this.state.next({ ...this.getState(), ...newState });
  }

  // Atualiza a lista de filmes:
  setMovies(movies: Movie[]) {
    this.setState({ movies });
  }

  // Define loading:
  setLoading(loading: boolean) {
    this.setState({ loading });
  }

  // Define mensagem de erro:
  setError(error: string | null) {
    this.setState({ error });
  }

  // Atualiza paginação:
  setPagination(page: number, totalPages: number) {
    this.setState({ page, totalPages });
  }
}
