import { Routes } from '@angular/router';
import { PokemonSetListComponent } from './components/pokemon-set-list/pokemon-set-list.component';
import { PokemonCardListComponent } from './components/pokemon-card-list/pokemon-card-list.component';

export const routes: Routes = [
  { path: 'tcg', component: PokemonSetListComponent },
  { path: 'pokedex', component: PokemonCardListComponent },
  // { path: '', redirectTo: '/tcg', pathMatch: 'full' },
  // { path: '**', redirectTo: '/tcg' },
];
