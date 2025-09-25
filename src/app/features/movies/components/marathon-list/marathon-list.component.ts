import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarathonService } from '../../services/marathon-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Movie } from '../../types/movie.type';
import { FormatDurationPipe } from 'src/app/pipes/format-duration.pipe';

@Component({
  selector: 'app-marathon-list',
  templateUrl: './marathon-list.component.html',
  styleUrls: ['./marathon-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, FormatDurationPipe]
})
export class MarathonListComponent implements OnInit {
  private marathonService = inject(MarathonService);    // Gerencia o estado da maratona (/services/marathon-service.ts)

  // Observables de marathon-service.ts:
  showModal$!: Observable<boolean>;
  username$!: Observable<string | null>;
  movies$!: Observable<Movie[]>;
  totalDuration$!: Observable<number>;

  savedMarathonNames$!: Observable<string[]>;
  newMarathonName: string = '';    // Valor do input para salvar o nome da nova maratona
  tempName: string = '';           // Valor do input de "login" (nome do usuário)

  ngOnInit() {
    // Vincula os Observables do /services/marathon-service.ts ao componente:
    this.showModal$ = this.marathonService.isOpen$;
    this.username$ = this.marathonService.username$;
    this.movies$ = this.marathonService.movies$;
    this.totalDuration$ = this.marathonService.totalDuration$;

    // Pega os nomes das maratonas salvas (as chaves do savedLists no /services/marathon-service.ts):
    this.savedMarathonNames$ = this.marathonService.savedLists$.pipe(
      map(savedLists => Object.keys(savedLists))
    );
  }

  // Faz "login" enviando o tempName para MarathonService.setUsername():
  login() {
    if (this.tempName) {
      this.marathonService.setUsername(this.tempName);
    } else {
      alert('Por favor, insira um nome de usuário!');
    }
  }

  // Fecha o modal chamando MarathonService.closeMarathon():
  closeModal() {
    this.marathonService.closeMarathon();
  }

  // Remove um filme pelo ID (MarathonService.removeMovie):
  removeMovie(movieId: number) {
    this.marathonService.removeMovie(movieId);
  }

  // Salva (ou não) a maratona atual chamando MarathonService.saveCurrentMarathon():
  saveMarathon() {
    if (this.newMarathonName) {
      this.marathonService.saveCurrentMarathon(this.newMarathonName);
      this.newMarathonName = '';
    } else {
      alert('Por favor, insira um nome para a maratona!');
    }
  }

  // Carrega uma maratona salva chamando MarathonService.loadMarathon():
  loadMarathon(marathonName: string) {
    this.marathonService.loadMarathon(marathonName);
  }

  // Deleta uma maratona salva chamando MarathonService.deleteMarathon():
  deleteMarathon(marathonName: string) {
    if (confirm(`Tem certeza que deseja excluir a maratona ${marathonName}?`)) {
      this.marathonService.deleteMarathon(marathonName);
    }
  }
}
