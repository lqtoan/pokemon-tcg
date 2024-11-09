import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PokemonEvolutionChainComponent } from '../pokemon-evolution-chain/pokemon-evolution-chain.component';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [CommonModule, RouterModule, PokemonEvolutionChainComponent],
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.scss'],
})
export class PokemonDetailsComponent implements OnInit {
  @Input() pokemonId: number = 0;
  
  pokemon: any;
  evolutionChain: any[] = []; 
  isLoading: boolean = false;

  constructor(private _pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.getPokemonDetails(this.pokemonId);
  }

  getPokemonDetails(id: number): void {
    this.isLoading = true;
    this._pokemonService.getPokemonDetails(id).subscribe({
      next: (res) => {
        this.pokemon = res;
        this.getEvolutionChain();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getEvolutionChain(): void {
    if (!this.pokemonId) return;
    
    this._pokemonService.getPokemonSpecies(this.pokemonId).subscribe((speciesData) => {
      const evolutionChainUrl = speciesData.evolution_chain.url;

      this._pokemonService.getEvolutionChain(evolutionChainUrl).subscribe((evolutionData) => {
        this.evolutionChain = this.parseEvolutionChain(evolutionData.chain);
        this.isLoading = false;
      }, () => {
        this.isLoading = false;
      });
    });
  }

  parseEvolutionChain(chain: any): any[] {
    const chainArray = [];
    let current = chain;

    while (current) {
      const pokemonId = this._pokemonService.getIdFromUrl(current.species.url);
      const pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
      
      chainArray.push({
        id: pokemonId,
        name: current.species.name,
        image: pokemonImage,
        url: current.species.url,
      });
      current = current.evolves_to[0];
    }
    return chainArray;
  }

  onPokemonSelected(pokemonId: number): void { 
    this.isLoading = true;
    this._pokemonService.getPokemonDetails(pokemonId).subscribe((res) => {      
      this.pokemon = res;
      this.pokemonId = res.id;
      this.isLoading = false;
    });
  }
}
