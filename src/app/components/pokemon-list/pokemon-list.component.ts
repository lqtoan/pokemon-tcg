// src/app/pokemon-list/pokemon-list.component.ts
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    PokemonCardComponent,
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  pokemons = signal<any[]>([]);
  limit = 30; // Số Pokémon mỗi trang
  offset = 0; // Vị trí bắt đầu của trang hiện tại
  // inputPage = 1; // Biến lưu số trang người dùng nhập
  currentPage = 1;
  maxPage = 0;
  isLoading = signal<boolean>(false); // Trạng thái tải dữ liệu

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getPokemons();
  }
  ngAfterViewInit(): void {
    if (!this.scrollContainer) {
      console.error('Scroll container is not initialized.');
    }
  }
  getPokemons(): void {
    if (this.isLoading()) return; // Không tải nếu đang có yêu cầu tải

    this.isLoading.set(true);
    this.offset = (this.currentPage - 1) * this.limit;

    this.http
      .get<any>(
        `https://pokeapi.co/api/v2/pokemon?limit=${this.limit}&offset=${this.offset}`
      )
      .subscribe((response) => {
        this.maxPage = Math.ceil(response.count / this.limit);
        const pokemonList = response.results;

        const pokemonDataPromises = pokemonList.map((pokemon: any) =>
          this.http.get<any>(pokemon.url).toPromise()
        );

        Promise.all(pokemonDataPromises)
          .then((dataList) => {
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

            this.pokemons.set([...this.pokemons(), ...updatedPokemons]); // infinity scroll

            this.isLoading.set(false);
          })
          .catch(() => {
            this.isLoading.set(false);
          });
      });
  }

  // goToPage(page: number): void {
  //   if (page < 1) return;
  //   if (page > this.maxPage) page = this.maxPage;

  //   this.currentPage = page;
  //   this.inputPage = page; // Cập nhật lại inputPage để khớp với trang hiện tại
  //   this.offset = (page - 1) * this.limit;
  //   this.getPokemons();
  // }

  // toggleInfiniteScroll(): void {
  //   this.infiniteScrollEnabled.set(!this.infiniteScrollEnabled());
  //   this.currentPage = 1; // Reset về trang đầu tiên
  //   this.pokemons.set([]);
  //   this.getPokemons();
  // }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const element = this.scrollContainer?.nativeElement;
    if (
      element &&
      element.scrollTop + element.clientHeight >= element.scrollHeight - 200 &&
      !this.isLoading() &&
      this.currentPage < this.maxPage
    ) {
      this.currentPage = this.currentPage + 1;
      this.getPokemons();
    }
  }

  onSearch(e: any) {
    const searchQuery = e.target.value.toLowerCase();
    if (searchQuery) {
      this.http
        .get<any>(`https://pokeapi.co/api/v2/pokemon/${searchQuery}`)
        .subscribe((res) => {
          this.pokemons.set([res]); // Update with the search result
        });
    } else {
      this.getPokemons();
    }
  }
}
