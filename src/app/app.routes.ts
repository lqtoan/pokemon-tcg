import { Routes } from '@angular/router';
import { PokemonSetListComponent } from './components/pokemon-set-list/pokemon-set-list.component';
import { PokemonCardListComponent } from './components/pokemon-card-list/pokemon-card-list.component';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { PokemonDetailsComponent } from './components/pokemon-details/pokemon-details.component';

export const routes: Routes = [
  { path: 'tcg', component: PokemonSetListComponent },
  { path: 'pokedex', component: PokemonListComponent },
  { path: 'pokemon/:id', component: PokemonDetailsComponent },
  { path: '', redirectTo: '/pokedex', pathMatch: 'full' },
  // { path: '**', redirectTo: '/tcg' },
];
