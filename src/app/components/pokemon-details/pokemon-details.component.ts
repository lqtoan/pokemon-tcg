import { Component, Input, OnInit, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PokemonEvolutionChainComponent } from '../pokemon-evolution-chain/pokemon-evolution-chain.component';
import { PokemonService } from '../../services/pokemon.service';
import {
  EvolutionChainPokemon,
  EvolutionDetail,
} from '../../models/evolution-chain.model';
import { Pokemon } from '../../models/pokemon.model';

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
    name: '',
    url: 'https://pokeapi.co/api/v2/pokemon-species/1/',
  },
  abilities: [],
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
export class PokemonDetailsComponent implements OnInit, OnDestroy {
  @Input() pokemonId: number = 0;

  pokemon = signal<Pokemon>(mockPokemon);
  evolutionChain = signal<EvolutionChainPokemon[][]>([]);
  isLoading = signal<boolean>(false);

  private subscriptions: Subscription[] = [];

  constructor(private _pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemonDetails(this.pokemonId);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onPokemonSelected(pokemonId: number): void {
    this.isLoading.set(true);
    const pokemonDetailsSubscription = this._pokemonService.getPokemonDetails(pokemonId).subscribe({
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
    this.subscriptions.push(pokemonDetailsSubscription);
  }

  getTotalBaseStat(): number {
    return this.pokemon().stats.reduce((total, stat) => total + stat.base_stat, 0);
  }

  private loadPokemonDetails(id: number): void {
    this.isLoading.set(true);
    const pokemonDetailsSubscription = this._pokemonService.getPokemonDetails(id).subscribe({
      next: (res) => {
        this.pokemon.set(res);
        this.loadEvolutionChain();
      },
      error: (error) => {
        console.error('Error fetching Pokémon details:', error);
        this.isLoading.set(false);
      }
    });
    this.subscriptions.push(pokemonDetailsSubscription);
  }

  private loadEvolutionChain(): void {
    if (!this.pokemonId) return;

    const speciesDataSubscription = this._pokemonService.getPokemonSpecies(this.pokemonId).subscribe({
      next: (speciesData) => {
        const evolutionChainUrl = speciesData.evolution_chain.url;
        const evolutionChainSubscription = this._pokemonService.getEvolutionChain(evolutionChainUrl).subscribe({
          next: (evolutionData) => {
            this.evolutionChain.set(this.parseEvolutionChain(evolutionData.chain));
            this.isLoading.set(false);
          },
          error: (error) => {
            console.error('Error fetching evolution chain:', error);
            this.isLoading.set(false);
          }
        });
        this.subscriptions.push(evolutionChainSubscription);
      },
      error: (error) => {
        console.error('Error fetching species data:', error);
        this.isLoading.set(false);
      }
    });
    this.subscriptions.push(speciesDataSubscription);
  }

  private parseEvolutionChain(chain: EvolutionDetail): EvolutionChainPokemon[][] {
    const chainArray: EvolutionChainPokemon[][] = [];
  
    const addEvolutionLevelToChain = (evolutions: EvolutionDetail[]) => {
      if (!evolutions.length) return;
  
      const currentLevel: EvolutionChainPokemon[] = evolutions.map(evolution => {
        const pokemonId = this._pokemonService.getIdFromUrl(evolution.species.url);
        const pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
  
        return {
          id: pokemonId,
          name: evolution.species.name,
          image: pokemonImage,
          url: evolution.species.url,
        };
      });
  
      // Thêm cấp độ tiến hóa hiện tại vào chainArray
      chainArray.push(currentLevel);
  
      // Tiếp tục duyệt cấp độ tiếp theo của mỗi Pokémon ở cấp hiện tại
      const nextLevelEvolutions = evolutions.flatMap(evolution => evolution.evolves_to);
      addEvolutionLevelToChain(nextLevelEvolutions);
    };
  
    // Bắt đầu thêm chuỗi tiến hóa từ Pokémon gốc
    addEvolutionLevelToChain([chain]);
    return chainArray;
  }
}
