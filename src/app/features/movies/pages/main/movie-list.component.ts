import { Component, OnInit, inject } from '@angular/core';
import { MovieFacade } from '../../services/movie.facade';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, switchMap, map } from 'rxjs/operators';
import { CarouselItem, CarouselComponent } from '@shared/components/carousel/carousel.component';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Movie } from '../../types/movie.type';
import { SearchResultsComponent } from "../../components/search-results/search-results.component";
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { MarathonService } from '../../services/marathon-service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
  standalone: true,
  imports: [CommonModule, AsyncPipe, ReactiveFormsModule, CarouselComponent, SearchResultsComponent, SearchBarComponent]
})
export class MovieListComponent implements OnInit {
  facade = inject(MovieFacade);                 // Injeta serviço do facade
  marathonService = inject(MarathonService);    // INjeta serviço da maratona
  searchControl = new FormControl('');          // Controla o input da barra de busca

  public isSearching: boolean = false;            // Indica se está buscando algum filme
  public searchResults$!: Observable<Movie[]>;    // resultados filtrados para o SearchResultsComponent

  // Carrosséis:
  popularMovies: CarouselItem[] = [];   // Filmes populares 
  topRatedMovies: CarouselItem[] = [];  // 10 filmes mais bem avaliados
  upcomingMovies: CarouselItem[] = [];  // Próximos lançamentos

  // Controle de exibição dos carrosséis:
  private searchTrigger$ = new BehaviorSubject<string>('');    // Controla quando deve realizar buscas
  private currentGenre: string = '';                           // Filtro de gênero
  private currentYear: string = '';                            // Filtro de ano
  private currentSort: string = 'popularity.desc';             // Ordenação

  ngOnInit() {
    this.loadInitialCarousels();       // Carrega carrosséis iniciais
    this.setupSearchAndFiltering();    // Inicializa lógica de busca e filtros
  }

  // Configura buscas e aplicação de filtros/ordenaçao:
  private setupSearchAndFiltering() {
    // Monitora mudanças no campo de busca:
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),       // Evita buscas repetidas
      distinctUntilChanged()   // Só busca se mudou o valor
    ).subscribe(query => {
      const trimmedQuery = query || '';
      this.isSearching = !!trimmedQuery;
      this.searchTrigger$.next(trimmedQuery); // Realiza a busca
    });

    // Observable com resultados filtrados (ou discover se não tiver busca):
    this.searchResults$ = this.searchTrigger$.pipe(
      switchMap(query => {
        if (!query) {
          // Sem busca, chama discover da API com filtros atuais:
          this.facade.discoverMovies(this.currentGenre, this.currentYear, this.currentSort);
          return this.facade.movies$.pipe(map(state => state.movies));
        } else {
          // Com busca, aplica filtros:
          return this.facade.searchMovies(query).pipe(
            map(movies => this.applyClientSideFilters(movies))
          );
        }
      })
    );
  }

  // Recebe alterações de filtro do SearchBarComponent:
  onFilterChange(filters: { genre: string, year: string }) {
    this.currentGenre = filters.genre;
    this.currentYear = filters.year;
    this.searchTrigger$.next(this.searchControl.value || ''); // Busca
  }

  // Recebe alteração de ordenação do SearchBarComponent:
  onSortChange(sort: string) {
    this.currentSort = sort;
    this.searchTrigger$.next(this.searchControl.value || '');
  }

  // Filtra e ordena filmes:
  private applyClientSideFilters(movies: Movie[]): Movie[] {
    let filteredMovies = [...movies];

    if (this.currentGenre) {
      filteredMovies = filteredMovies.filter(m => 
        (m.genre_ids || []).includes(Number(this.currentGenre))
      );
    }

    if (this.currentYear) {
      filteredMovies = filteredMovies.filter(m => 
        m.release_date?.startsWith(this.currentYear)
      );
    }

    // Ordenação:
    switch (this.currentSort) {
      case 'vote_average.desc':
        filteredMovies.sort((a, b) => b.vote_average - a.vote_average);
        break;
      case 'original_title.asc':
        filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'original_title.desc':
        filteredMovies.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'release_date.desc':
        filteredMovies.sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));
        break;
      case 'release_date.asc':
        filteredMovies.sort((a, b) => (a.release_date || '').localeCompare(b.release_date || ''));
        break;
      case 'popularity.desc':
      default:
        break; 
    }
    
    return filteredMovies;
  }

  // Inicializa carrosséis populares, mais votados e próximos lançamentos:
  private loadInitialCarousels() {
    this.facade.loadPopularMovies();

    // Atualiza carrosséis quando movies$ mudar:
    this.facade.movies$.subscribe(state => {
      if (!this.isSearching && state.movies.length > 0) {
        const movies = state.movies.map(movie => this.mapMovieToCarouselItem(movie));
        this.popularMovies = movies;

        const sortedByRating = [...state.movies].sort((a,b) => b.vote_average - a.vote_average);
        this.topRatedMovies = sortedByRating.slice(0, 10).map(m => this.mapMovieToCarouselItem(m));

        this.upcomingMovies = movies.slice(10, 20);
      }
    });
  }
  
  // Converte Movie em CarouselItem para usar no componente CarouselComponent:
  private mapMovieToCarouselItem(movie: Movie): CarouselItem {
    return {
        id: movie.id,
        title: movie.title,
        imgSrc: movie.poster_path ?? undefined,
        link: ``,
        rating: (movie.vote_average / 10) * 100,
        vote: movie.vote_average
    };
  }

  // Chamado quando um filme do carrossel ou SearchResults é selecionado:
  onMovieSelect(item: { id: number }) {
    if (!item || typeof item.id !== 'number') {
      console.error('Item selecionado é inválido ou não possui um ID.', item);
      return;
    }

    // Busca detalhes completos do filme e adiciona na maratona:
    this.facade.getMovieDetails(item.id).subscribe(movieWithDetails => {
      if (movieWithDetails) {
        this.marathonService.addMovie(movieWithDetails);
        this.marathonService.openMarathon();
      }
    });
  }
}
