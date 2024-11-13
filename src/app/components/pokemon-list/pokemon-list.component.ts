import { Component, ElementRef, HostListener, OnInit, OnDestroy, signal, viewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { NamedAPIResource, Pokemon } from '../../models/pokemon.model';
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
export class PokemonListComponent implements OnInit, OnDestroy {
  readonly scrollContainer = viewChild.required<ElementRef>('scrollContainer');
  
  readonly pokemons = signal<Pokemon[]>([]);
  readonly isLoading = signal<boolean>(false);
  selectedPokemon: Pokemon | null = null;
  showPopup = false;

  private currentPage = 1;
  private maxPage = 0;
  private limit = 30;
  private offset = 0;

  private subscriptions: Subscription[] = [];

  constructor(private _pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemons();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  togglePopup(pokemon?: Pokemon): void {
    if (pokemon) {
      this.selectedPokemon = pokemon;
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

  private loadPokemons(): void {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.offset = (this.currentPage - 1) * this.limit;

    const pokemonListSubscription = this._pokemonService.getPokemonList(this.limit, this.offset).subscribe({
      next: (response) => this.fetchPokemonData(response.results, response.count),
      error: () => this.isLoading.set(false)
    });

    this.subscriptions.push(pokemonListSubscription);
  }

  private fetchPokemonData(pokemonList: NamedAPIResource[], total: number): void {
    this.maxPage = Math.ceil(total / this.limit);

    const pokemonDataObservables = pokemonList.map(pokemon =>
      this._pokemonService.getPokemonData(pokemon.url)
    );

    const dataSubscription = forkJoin<Pokemon[]>(pokemonDataObservables).subscribe({
      next: (dataList) => this.pokemons.set([...this.pokemons(), ...dataList]),
      error: () => this.isLoading.set(false)
    });

    this.subscriptions.push(dataSubscription);
  }

  // private updatePokemons(dataList: Pokemon[], pokemonList: NamedAPIResource[]): void {
  //   const updatedPokemons = dataList.map((data, index) => ({
  //     ...pokemonList[index],
  //     data,
  //   }));

  //   this.pokemons.set([...this.pokemons(), ...updatedPokemons]);
  //   this.isLoading.set(false);
  // }

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
