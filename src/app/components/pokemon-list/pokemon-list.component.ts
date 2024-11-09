import { SelectedPokemon } from './../../models/pokemon.model';
import { PokemonDetailsComponent } from './../pokemon-details/pokemon-details.component';
import { PokemonDetailsPopupComponent } from '../pokemon-popup/pokemon-popup.component';
import { Component, ElementRef, HostListener, OnInit, signal, ViewChild } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { NamedAPIResource, Pokemon, UpdatedPokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PokemonCardComponent,
    PokemonDetailsPopupComponent,
    PokemonDetailsComponent
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  pokemons = signal<UpdatedPokemon[]>([]);
  limit = 30;
  offset = 0;
  currentPage = 1;
  maxPage = 0;
  isLoading = signal<boolean>(false);
  selectedPokemon: SelectedPokemon | null = null;
  showPopup: boolean = false;

  constructor(private _pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.getPokemons();
  }

  getPokemons(): void {
    if (this.isLoading()) return;
  
    this.isLoading.set(true);
    this.offset = (this.currentPage - 1) * this.limit;
  
    this._pokemonService.getPokemonList(this.limit, this.offset).subscribe((response) => {
      this.maxPage = Math.ceil(response.count / this.limit);
      const pokemonList: NamedAPIResource[] = response.results;

      const pokemonDataObservables = pokemonList.map((pokemon: NamedAPIResource) =>
        this._pokemonService.getPokemonData(pokemon.url)
      );
  
      forkJoin<Pokemon[]>(pokemonDataObservables).subscribe({
        next: (dataList) => {
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
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
    });
  }

  onShowPopup(pokemon: UpdatedPokemon) {
    this.selectedPokemon = {
      id: pokemon.data.id,
      data: pokemon.data
    };
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const element = this.scrollContainer?.nativeElement;
    if (
      element &&
      element.scrollTop + element.clientHeight >= element.scrollHeight - 200 &&
      !this.isLoading() &&
      this.currentPage < this.maxPage
    ) {
      this.currentPage++;
      this.getPokemons();
    }
  }
}
