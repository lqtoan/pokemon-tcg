import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PokemonEvolutionChainComponent } from '../pokemon-evolution-chain/pokemon-evolution-chain.component';
import { PokemonService } from '../../services/pokemon.service';
import {
  EvolutionChainPokemon,
  EvolutionDetail,
} from '../../models/evolution-chain.model';
import { Pokemon } from '../../models/pokemon.model';
import { firstValueFrom } from 'rxjs';

const mockPokemon = {
  id: 0,
  name: '',
  height: 0,
  weight: 0,
  sprites: {
    back_default: null,
    back_female: null,
    front_default: null,
    front_female: null,
    back_shiny: null,
    back_shiny_female: null,
    front_shiny: null,
    front_shiny_female: null,
  },
  stats: [
    {
      base_stat: 0,
      effort: 0,
      stat: {
        name: 'hp',
        url: 'https://pokeapi.co/api/v2/stat/1/',
      },
    },
    {
      base_stat: 0,
      effort: 0,
      stat: {
        name: 'attack',
        url: 'https://pokeapi.co/api/v2/stat/2/',
      },
    },
    {
      base_stat: 0,
      effort: 0,
      stat: {
        name: 'defense',
        url: 'https://pokeapi.co/api/v2/stat/3/',
      },
    },
    {
      base_stat: 0,
      effort: 1,
      stat: {
        name: 'special-attack',
        url: 'https://pokeapi.co/api/v2/stat/4/',
      },
    },
    {
      base_stat: 0,
      effort: 0,
      stat: {
        name: 'special-defense',
        url: 'https://pokeapi.co/api/v2/stat/5/',
      },
    },
    {
      base_stat: 0,
      effort: 0,
      stat: {
        name: 'speed',
        url: 'https://pokeapi.co/api/v2/stat/6/',
      },
    },
  ],
  species: {
    name: 'bulbasaur',
    url: 'https://pokeapi.co/api/v2/pokemon-species/1/',
  },
  abilities: [
    {
      ability: {
        name: 'overgrow',
        url: 'https://pokeapi.co/api/v2/ability/65/',
      },
      is_hidden: false,
      slot: 1,
    },
    {
      ability: {
        name: 'chlorophyll',
        url: 'https://pokeapi.co/api/v2/ability/34/',
      },
      is_hidden: true,
      slot: 3,
    },
  ],
  types: [
    {
      slot: 1,
      type: {
        name: 'normal',
        url: 'https://pokeapi.co/api/v2/type/1/',
      },
    },
  ],
};

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [CommonModule, RouterModule, PokemonEvolutionChainComponent],
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.scss'],
})
export class PokemonDetailsComponent implements OnInit {
  @Input() pokemonId: number = 0;

  // Sử dụng signals để quản lý trạng thái
  pokemon = signal<Pokemon>(mockPokemon);
  evolutionChain = signal<EvolutionChainPokemon[]>([]);
  isLoading = signal<boolean>(false);

  constructor(private _pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemonDetails(this.pokemonId);
  }

  private loadPokemonDetails(id: number): void {
    this.isLoading.set(true);
    this._pokemonService.getPokemonDetails(id).subscribe({
      next: (res) => {
        this.pokemon.set(res);
        this.loadEvolutionChain();
      },
      error: (error) => {
        console.error('Error fetching Pokémon details:', error);
        this.isLoading.set(false);
      }
    });
  }

  private loadEvolutionChain(): void {
    if (!this.pokemonId) return;

    this._pokemonService.getPokemonSpecies(this.pokemonId).subscribe({
      next: (speciesData) => {
        const evolutionChainUrl = speciesData.evolution_chain.url;
        this._pokemonService.getEvolutionChain(evolutionChainUrl).subscribe({
          next: (evolutionData) => {
            this.evolutionChain.set(this.parseEvolutionChain(evolutionData.chain));
            this.isLoading.set(false);
          },
          error: (error) => {
            console.error('Error fetching evolution chain:', error);
            this.isLoading.set(false);
          }
        });
      },
      error: (error) => {
        console.error('Error fetching species data:', error);
        this.isLoading.set(false);
      }
    });
  }

  private parseEvolutionChain(chain: EvolutionDetail): EvolutionChainPokemon[] {
    const chainArray: EvolutionChainPokemon[] = [];

    const addEvolutionToChain = (evolution: EvolutionDetail | null) => {
      if (!evolution) return;
      const pokemonId = this._pokemonService.getIdFromUrl(evolution.species.url);
      const pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
      
      chainArray.push({
        id: pokemonId,
        name: evolution.species.name,
        image: pokemonImage,
        url: evolution.species.url,
      });
      addEvolutionToChain(evolution.evolves_to[0] || null);
    };

    addEvolutionToChain(chain);
    return chainArray;
  }

  onPokemonSelected(pokemonId: number): void {
    this.isLoading.set(true);
    this._pokemonService.getPokemonDetails(pokemonId).subscribe({
      next: (res) => {
        this.pokemon.set(res);
        this.pokemonId = res.id;
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching selected Pokémon details:', error);
        this.isLoading.set(false);
      }
    });
  }
}
