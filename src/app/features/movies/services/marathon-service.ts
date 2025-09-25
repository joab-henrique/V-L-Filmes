import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Movie } from '../types/movie.type';

// Estrutura para salvar maratonas (por nome):
interface SavedMarathons {
  [listName: string]: Movie[];
}

@Injectable({
  providedIn: 'root'    // Indica serviço global, pode ser usado em qualquer componente
})
export class MarathonService {
  private readonly STORAGE_KEY = 'marathonLists';    // Chave para localStorage

  // Subjects controlam estado interno e expõem Observables:
  private isOpenSubject = new BehaviorSubject<boolean>(false);           // Modal da maratona
  private usernameSubject = new BehaviorSubject<string | null>(null);    // Usuário "logado"
  private moviesSubject = new BehaviorSubject<Movie[]>([]);              // Filmes da maratona atual
  private totalDurationSubject = new BehaviorSubject<number>(0);         // Duração total da maratona
  private savedListsSubject = new BehaviorSubject<SavedMarathons>({});   // Maratonas salvas

  // Observables públicos para os componentes:
  isOpen$ = this.isOpenSubject.asObservable();
  username$ = this.usernameSubject.asObservable();
  movies$ = this.moviesSubject.asObservable();
  totalDuration$ = this.totalDurationSubject.asObservable();
  savedLists$ = this.savedListsSubject.asObservable();

  constructor() {
    this.loadAllMarathonsFromStorage();    // Inicializa com osdados do localStorage
  }

  // Carrega as maratonas salvas do localStorage:
  private loadAllMarathonsFromStorage(): void {
    const savedData = localStorage.getItem(this.STORAGE_KEY);
    if (savedData) {
      this.savedListsSubject.next(JSON.parse(savedData));
    }
  }

  // Salva todas maratonas no localStorage e atualiza observable:
  private saveAllMarathonsToStorage(lists: SavedMarathons): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(lists));
    this.savedListsSubject.next(lists);
  }

  // Salva a maratona atual com o nome fornecido:
  public saveCurrentMarathon(listName: string): void {
    const currentMovies = this.moviesSubject.getValue();
    if (!listName || currentMovies.length === 0) return;

    const allLists = this.savedListsSubject.getValue();
    const updatedMarathon = { ...allLists, [listName]: currentMovies };
    this.saveAllMarathonsToStorage(updatedMarathon);
  }

  // Carrega uma maratona salva pelo nome:
  public loadMarathon(listName: string): void {
    const allLists = this.savedListsSubject.getValue();
    const moviesToLoad = allLists[listName];
    if (moviesToLoad) {
      this.moviesSubject.next(moviesToLoad);
      this.calculateAndEmitDuration(moviesToLoad);    // Atualiza duração total
    }
  }

  // Exclui uma maratona salva pelo nome:
  public deleteMarathon(listName: string): void {
    const allLists = { ...this.savedListsSubject.getValue() };
    delete allLists[listName];
    this.saveAllMarathonsToStorage(allLists);
  }

  // Abre modal da maratona:
  openMarathon() {
    this.isOpenSubject.next(true);
  }

  // Fecha modal da maratona:
  closeMarathon() {
    this.isOpenSubject.next(false);
  }

  // Define nome do usuário:
  setUsername(name: string) {
    this.usernameSubject.next(name);
  }

  // Adiciona filme na maratona atual, possibilitando a sobreposição:
  addMovie(movie: Movie) {
    const currentMovies = this.moviesSubject.getValue();
    if (!currentMovies.some(m => m.id === movie.id)) {
      const updatedMovies = [...currentMovies, movie];
      this.moviesSubject.next(updatedMovies);
      this.calculateAndEmitDuration(updatedMovies);
    }
  }

  // Remove filme da maratona atual:
  removeMovie(movieId: number) {
    const currentMovies = this.moviesSubject.getValue();
    const updatedMovies = currentMovies.filter(movie => movie.id !== movieId);
    this.moviesSubject.next(updatedMovies);
    this.calculateAndEmitDuration(updatedMovies);
  }

  // Calcula duração total da maratona e atualiza observable:
  private calculateAndEmitDuration(movies: Movie[]) {
    const totalDuration = movies.reduce((acc, movie) => acc + (movie.runtime || 0), 0);
    this.totalDurationSubject.next(totalDuration);
  }
}
