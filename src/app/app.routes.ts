import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieListComponent } from './features/movies/pages/main/movie-list.component';
import { MarathonListComponent } from './features/movies/components/marathon-list/marathon-list.component';

export const routes: Routes = [
  {
    path: 'movies',
    component: MovieListComponent
  },
  {
    path: 'marathon-list',
    component: MarathonListComponent,
    outlet: 'marathon'
  },
  {
    path: '',
    redirectTo: 'movies',
    pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
