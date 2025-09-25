import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MovieFacade } from '../../services/movie.facade';
import { Movie } from '../../types/movie.type';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class SearchBarComponent implements OnInit {
  // Controla o input de busca:
  @Input() control!: FormControl;

  // Emite alterações de filtro:
  @Output() filterChange = new EventEmitter<{ genre: string, year: string }>();
  // Emite alteração de ordenação:
  @Output() sortChange = new EventEmitter<string>();

  // Serviço de buscas e estado:
  private movieFacade = inject(MovieFacade);

  // Estado interno padrão da barra de pesquisa:
  selectedGenre: string = '';
  selectedYear: string = '';
  selectedSort: string = 'popularity.desc';

  // Guarda todos os resultados da busca antes de aplicar os filtros:
  private allSearchResults: Movie[] = [];

  // Lista de IDs e seus respectivos gêneros (com base na API):
  genres = [
    { id: 28, name: 'Ação' },
    { id: 12, name: 'Aventura' },
    { id: 16, name: 'Animação' },
    { id: 35, name: 'Comédia' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentário' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Família' },
    { id: 14, name: 'Fantasia' },
    { id: 36, name: 'História' },
    { id: 27, name: 'Terror' },
    { id: 10402, name: 'Música' },
    { id: 9648, name: 'Mistério' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Ficção Científica' },
    { id: 10770, name: 'Cinema TV' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'Guerra' },
    { id: 37, name: 'Faroeste' }
  ];

  // Lista de anos populada dinamicamente:
  years: string[] = [];

  constructor() {
    this.populateYears(); // cria anos de 1950 até o ano atual
  }

  private populateYears() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1950; year--) {
      this.years.push(year.toString());
    }
  }

  ngOnInit() {
    // Monitora mudanças na barra de pesquisa:
    this.control.valueChanges.pipe(
      debounceTime(300),        // Evita requisições seguidas
      distinctUntilChanged()    // Só busca se o valor realmente mudou
    ).subscribe(query => {
      if (query !== '') {
        // Chama API de busca de filmes via MovieFacade:
        this.movieFacade.searchMovies(query).subscribe(movies => {
          this.allSearchResults = movies;    // Guarda os resultados originais
          this.applyFilters();               // Aplica filtros e ordenação
        });
      } else {
        // Se não houver busca específica, limpa os resultados e aplica filtros:
        this.allSearchResults = [];
        this.emitFilterChange();
      }
    });
  }

  // Quando o usuário muda a ordenação:
  onSortChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedSort = target.value;
    this.sortChange.emit(this.selectedSort);
    this.applyFiltersOrDiscover();
  }

  // Quando o usuário muda gênero ou ano:
  onFilterChange() {
    this.applyFiltersOrDiscover();
  }

  // Decide se aplica filtros na busca ou dispara a API:
  private applyFiltersOrDiscover() {
    if (this.allSearchResults.length > 0) {
      this.applyFilters();        // Se já tem resultados de busca, filtra localmente
    } else {
      this.emitFilterChange();    // Caso contrário, chama o discover da API
    }
  }

  // Aplica filtros e ordenação sobre os resultados já buscados:
  private applyFilters() {
    let filtered = this.allSearchResults;

    if (this.selectedGenre) {
      filtered = filtered.filter(m => (m.genre_ids || []).includes(Number(this.selectedGenre)));
    }

    if (this.selectedYear) {
      filtered = filtered.filter(m => m.release_date?.startsWith(this.selectedYear));
    }

    // Aplica ordenação escolhida:
    switch (this.selectedSort) {
      case 'vote_average.desc':
        filtered = [...filtered].sort((a, b) => b.vote_average - a.vote_average);
        break;
      case 'original_title.asc':
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'original_title.desc':
        filtered = [...filtered].sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'release_date.asc':
        filtered = [...filtered].sort((a, b) => (a.release_date || '').localeCompare(b.release_date || ''));
        break;
      case 'release_date.desc':
        filtered = [...filtered].sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));
        break;
      default:
        break; // Popularidade já é padrão da API
    }

    this.movieFacade.state.setMovies(filtered);    // Atualiza o estado dos filmes
  }

  // Quando não há busca, chama API discover e aplica filtros:
  private emitFilterChange() {
    this.movieFacade.discoverMovies(this.selectedGenre, this.selectedYear, this.selectedSort);
    this.filterChange.emit({
      genre: this.selectedGenre,
      year: this.selectedYear
    });
  }
}
