import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MarathonListComponent } from "./features/movies/components/marathon-list/marathon-list.component";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarathonService } from './features/movies/services/marathon-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MarathonListComponent, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'V-L Filmes';
  
  private marathonService = inject(MarathonService);

  openMarathonList(): void {
    this.marathonService.openMarathon();
  }
}