import { Routes } from '@angular/router';
import { PokemonSetListComponent } from './components/pokemon-tcg-set-list/pokemon-tcg-set-list.component';
import { PokemonCardListComponent } from './components/pokemon-tcg-card-list/pokemon-card-list.component';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';

export const routes: Routes = [
  { path: 'tcg', component: PokemonSetListComponent },
  { path: 'tcg/:id', component: PokemonCardListComponent },
  { path: 'pokedex', component: PokemonListComponent },
  { path: '', redirectTo: '/pokedex', pathMatch: 'full' },
  // { path: '**', redirectTo: '/tcg' },
];
