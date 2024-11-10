import { Component, ElementRef, HostListener, OnInit, signal, viewChild } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { NamedAPIResource, Pokemon, UpdatedPokemon, SelectedPokemon } from '../../models/pokemon.model';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { PokemonDetailsPopupComponent } from '../pokemon-popup/pokemon-popup.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PokemonCardComponent,
    PokemonDetailsPopupComponent
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit {
  readonly scrollContainer = viewChild.required<ElementRef>('scrollContainer');
  
  pokemons = signal<UpdatedPokemon[]>([]);
  isLoading = signal<boolean>(false);
  selectedPokemon: SelectedPokemon | null = null;
  showPopup = false;

  private currentPage = 1;
  private maxPage = 0;
  private limit = 30;
  private offset = 0;

  constructor(private _pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemons();
  }

  loadPokemons(): void {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.offset = (this.currentPage - 1) * this.limit;

    this._pokemonService.getPokemonList(this.limit, this.offset).subscribe({
      next: (response) => this.fetchPokemonData(response.results, response.count),
      error: () => this.isLoading.set(false)
    });
  }

  fetchPokemonData(pokemonList: NamedAPIResource[], total: number): void {
    this.maxPage = Math.ceil(total / this.limit);

    const pokemonDataObservables = pokemonList.map(pokemon =>
      this._pokemonService.getPokemonData(pokemon.url)
    );

    forkJoin<Pokemon[]>(pokemonDataObservables).subscribe({
      next: (dataList) => this.updatePokemons(dataList, pokemonList),
      error: () => this.isLoading.set(false)
    });
  }

  updatePokemons(dataList: Pokemon[], pokemonList: NamedAPIResource[]): void {
    const updatedPokemons = dataList.map((data, index) => ({
      ...pokemonList[index],
      data,
      stats: {
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        speAttack: data.stats[3].base_stat,
        speDefense: data.stats[4].base_stat,
        speed: data.stats[5].base_stat,
      },
    }));

    this.pokemons.set([...this.pokemons(), ...updatedPokemons]);
    this.isLoading.set(false);
  }

  togglePopup(pokemon?: UpdatedPokemon): void {
    if (pokemon) {
      this.selectedPokemon = {
        id: pokemon.data.id,
        data: pokemon.data
      };
    }
    this.showPopup = !this.showPopup;
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (this.shouldLoadMore()) {
      this.currentPage++;
      this.loadPokemons();
    }
  }

  private shouldLoadMore(): boolean {
    const element = this.scrollContainer()?.nativeElement;
    return (
      element &&
      element.scrollTop + element.clientHeight >= element.scrollHeight - 200 &&
      !this.isLoading() &&
      this.currentPage < this.maxPage
    );
  }
}
