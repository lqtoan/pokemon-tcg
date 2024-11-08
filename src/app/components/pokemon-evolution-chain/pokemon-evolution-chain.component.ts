import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pokemon-evolution-chain',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pokemon-evolution-chain.component.html',
  styleUrl: './pokemon-evolution-chain.component.scss'
})
export class PokemonEvolutionChainComponent {
  @Input() evolutionChain: any[] = []; 
  @Input() currentPokemonId: string = '';

  @Output() pokemonSelected = new EventEmitter<string>();

  onPokemonClick(pokemonId: string) {
    this.pokemonSelected.emit(pokemonId);
  }
}
