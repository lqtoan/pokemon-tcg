import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PokemonEvolutionChainComponent } from '../pokemon-evolution-chain/pokemon-evolution-chain.component';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, PokemonEvolutionChainComponent],
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.scss'],
})
export class PokemonDetailsComponent implements OnInit {
  pokemonId: string | null = null;
  pokemon: any;
  evolutionChain: any[] = []; 
  isLoading: boolean = false;
  nextId: string | null = null;
  previousId: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private _pokemonService: PokemonService) {}

  ngOnInit(): void {
    // Lấy ID từ URL
    this.route.paramMap.subscribe((params) => {
      this.pokemonId = params.get('id');
      if (this.pokemonId) {
        this.getPokemonDetails(this.pokemonId);
      }
    });
  }

  getPokemonDetails(id: string): void {
    this.isLoading = true;
    this._pokemonService.getPokemonDetails(id).subscribe((res) => {
      this.pokemon = res;
      this.nextId = res.id < 99999 ? (res.id + 1).toString() : null;
      this.previousId = res.id > 1 ? (res.id - 1).toString() : null;
      this.getEvolutionChain();
    }, () => {
      this.isLoading = false;
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
        isCurrent: pokemonId === this.pokemonId,
      });
      current = current.evolves_to[0];
    }
    return chainArray;
  }

  navigatePokemon(direction: string): void {
    if (direction === 'next' && this.nextId) {
      // Điều hướng tới Pokémon tiếp theo và cập nhật URL
      this.router.navigate(['/pokedex', this.nextId]);
      this.getPokemonDetails(this.nextId);  // Lấy thông tin Pokémon tiếp theo
    } else if (direction === 'previous' && this.previousId) {
      // Điều hướng tới Pokémon trước đó và cập nhật URL
      this.router.navigate(['/pokedex', this.previousId]);
      this.getPokemonDetails(this.previousId);  // Lấy thông tin Pokémon trước đó
    }
  }
}
