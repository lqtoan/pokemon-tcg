import { Routes } from '@angular/router';
import { PokemonSetListComponent } from './components/pokemon-set-list/pokemon-set-list.component';

export const routes: Routes = [
  { path: 'tcg', component: PokemonSetListComponent },
  // { path: '', component: PokemonListComponent },
  { path: '', redirectTo: '/tcg', pathMatch: 'full' },
  { path: '**', redirectTo: '/tcg' },
];
