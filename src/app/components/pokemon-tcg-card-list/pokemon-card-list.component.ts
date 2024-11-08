import { Component, inject, signal } from '@angular/core';
import { PokemonTcgService } from '../../services/pokemon-tcg.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-card-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-card-list.component.html',
  styleUrl: './pokemon-card-list.component.scss',
})
export class PokemonCardListComponent {
  private pokemonTcgService = inject(PokemonTcgService);

  isLoading = signal(false);
  data = signal<any[]>([]);

  constructor() {
    this.loadPokemonCards();
  }

  loadPokemonCards() {
    this.isLoading.set(true);
    this.pokemonTcgService.getPokemonCards().subscribe({
      next: (response) => {
        this.data.set(response.data);
      },
      error: (error) => {
        console.error('Lỗi khi tải dữ liệu:', error);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }
}
