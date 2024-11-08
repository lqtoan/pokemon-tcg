import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PokemonEvolutionChainComponent } from '../pokemon-evolution-chain/pokemon-evolution-chain.component';

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
  evolutionChain: any[] = []; // Lưu chuỗi tiến hóa
  isLoading: boolean = false; // Biến isLoading để theo dõi trạng thái tải
  nextId: string | null = null;
  previousId: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

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
    this.isLoading = true; // Bắt đầu tải dữ liệu
    this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${id}`).subscribe((res) => {
      this.pokemon = res;
      // Lưu ID của Pokémon tiếp theo và trước đó
      this.nextId = res.id < 99999 ? (res.id + 1).toString() : null;  
      this.previousId = res.id > 1 ? (res.id - 1).toString() : null; 

      // Thêm thuộc tính stats vào this.pokemon
      // this.pokemon.stats = {
      //   hp: res.stats[0].base_stat,
      //   attack: res.stats[1].base_stat,
      //   defense: res.stats[2].base_stat,
      //   speAttack: res.stats[3].base_stat,
      //   speDefense: res.stats[4].base_stat,
      //   speed: res.stats[5].base_stat,
      // };

      // Gọi chuỗi tiến hóa sau khi đã có dữ liệu Pokémon
      this.getEvolutionChain();
    }, () => {
      this.isLoading = false; // Nếu có lỗi, dừng isLoading
    });
  }

  getEvolutionChain(): void {
    this.http.get<any>(`https://pokeapi.co/api/v2/pokemon-species/${this.pokemonId}`).subscribe((speciesData) => {
      const evolutionChainUrl = speciesData.evolution_chain.url;

      this.http.get<any>(evolutionChainUrl).subscribe((evolutionData) => {
        this.evolutionChain = this.parseEvolutionChain(evolutionData.chain);
        this.isLoading = false; // Kết thúc quá trình tải
      }, () => {
        this.isLoading = false; // Nếu có lỗi, dừng isLoading
      });
    });
  }

  parseEvolutionChain(chain: any): any[] {
    const chainArray = [];
    let current = chain;

    while (current) {
      // Lấy ID và hình ảnh từ URL của Pokémon
      const pokemonId = this.getIdFromUrl(current.species.url);
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

  // Hàm lấy ID từ URL
  getIdFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2]; // Lấy ID từ URL của Pokémon
  }

  navigatePokemon(direction: string): void {
    if (direction === 'next' && this.nextId) {
      // Điều hướng tới Pokémon tiếp theo và cập nhật URL
      this.router.navigate(['/pokemon', this.nextId]);
      this.getPokemonDetails(this.nextId);  // Lấy thông tin Pokémon tiếp theo
    } else if (direction === 'previous' && this.previousId) {
      // Điều hướng tới Pokémon trước đó và cập nhật URL
      this.router.navigate(['/pokemon', this.previousId]);
      this.getPokemonDetails(this.previousId);  // Lấy thông tin Pokémon trước đó
    }
  }
}
