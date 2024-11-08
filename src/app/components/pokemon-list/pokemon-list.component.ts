import { PokemonDetailsComponent } from './../pokemon-details/pokemon-details.component';
import { PokemonDetailsPopupComponent } from '../pokemon-popup/pokemon-popup.component';
import { Component, ElementRef, HostListener, OnInit, signal, ViewChild } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

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

  pokemons = signal<any[]>([]);
  limit = 30;
  offset = 0;
  currentPage = 1;
  maxPage = 0;
  isLoading = signal<boolean>(false);
  selectedPokemon: any = null;
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
      const pokemonList = response.results;
  
      // Sử dụng forkJoin để thay thế toPromise() cho các yêu cầu HTTP đồng thời
      const pokemonDataObservables = pokemonList.map((pokemon: any) =>
        this._pokemonService.getPokemonData(pokemon.url)
      );
  
      forkJoin<any[]>(pokemonDataObservables).subscribe({
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

  onSearch(e: any) {
    const searchQuery = e.target.value.toLowerCase();
    if (searchQuery) {
      this._pokemonService.searchPokemon(searchQuery).subscribe((res) => {
        this.pokemons.set([res]);
      });
    } else {
      this.getPokemons();
    }
  }

  onShowPopup(pokemon: any) {
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
