import { Component, signal } from '@angular/core';
import { PokemonTcgService } from '../../services/pokemon-tcg.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Card } from '../../models/pokemon-tcg-card.model';

@Component({
  selector: 'app-pokemon-card-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-card-list.component.html',
  styleUrl: './pokemon-card-list.component.scss',
})
export class PokemonCardListComponent {
  isLoading = signal(false);
  data = signal<Card[]>([]);
  setId: string | null = '';
  title: string = '';

  constructor(
    private route: ActivatedRoute,
    private pokemonTcgService: PokemonTcgService
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {      
      this.setId = params.get('id');
      
      if (this.setId) {
        this.loadSetDetails(this.setId);
        this.loadCardsBySet(this.setId);
      }
    });
  }

  loadSetDetails(setId: string) {
    this.pokemonTcgService.getSetById(setId).subscribe({
      next: (response) => {
        console.log(response);
        
        this.title = response.data.name;
      },
      error: (error) => {
        console.error('Lỗi khi lấy thông tin set:', error);
      }
    });
  }

  loadCardsBySet(setId: string) {
    this.isLoading.set(true);
    this.pokemonTcgService.getCardsBySet(setId).subscribe({
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
