import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EvolutionChain, EvolutionChainPokemon } from '../../models/evolution-chain.model';

@Component({
  selector: 'app-pokemon-evolution-chain',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pokemon-evolution-chain.component.html',
  styleUrl: './pokemon-evolution-chain.component.scss'
})
export class PokemonEvolutionChainComponent {
  @Input() evolutionChain: EvolutionChainPokemon[][] = []; 
  @Input() currentPokemonId: number = 0;

  @Output() pokemonSelected = new EventEmitter<number>();

  onPokemonClick(pokemonId: number) {
    this.pokemonSelected.emit(pokemonId);
  }
}
