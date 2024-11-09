import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PokemonEvolutionChainComponent } from '../pokemon-evolution-chain/pokemon-evolution-chain.component';
import { PokemonService } from '../../services/pokemon.service';
import { EvolutionChainPokemon, EvolutionDetail } from '../../models/evolution-chain.model';
import { Pokemon } from '../../models/pokemon.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [CommonModule, RouterModule, PokemonEvolutionChainComponent],
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.scss'],
})
export class PokemonDetailsComponent implements OnInit {
  @Input() pokemonId: number = 0;
  
  pokemon?: Pokemon;
  evolutionChain: EvolutionChainPokemon[] = []; 
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
  
    this.isLoading = true;
  
    const getSpeciesData = async () => {
      try {
        const speciesData = await firstValueFrom(this._pokemonService.getPokemonSpecies(this.pokemonId));
        const evolutionChainUrl = speciesData.evolution_chain.url;
  
        const evolutionData = await firstValueFrom(this._pokemonService.getEvolutionChain(evolutionChainUrl));
        console.log(evolutionData);
        
        this.evolutionChain = this.parseEvolutionChain(evolutionData.chain);
      } catch (error) {
        console.error('Error fetching evolution chain', error);
      } finally {
        this.isLoading = false;
      }
    };
  
    getSpeciesData();
  }

  parseEvolutionChain(chain: EvolutionDetail): EvolutionChainPokemon[] {
    const chainArray: EvolutionChainPokemon[] = [];
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
