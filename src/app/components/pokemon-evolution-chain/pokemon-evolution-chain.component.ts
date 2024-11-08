import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
}
