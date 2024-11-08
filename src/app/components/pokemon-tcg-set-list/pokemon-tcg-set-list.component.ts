import { Component, signal } from '@angular/core';
import { PokemonTcgService } from '../../services/pokemon-tcg.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pokemon-set-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pokemon-tcg-set-list.component.html',
  styleUrl: './pokemon-tcg-set-list.component.scss'
})
export class PokemonSetListComponent {

  isLoading = signal(false);
  groupedData = signal<Map<string, any[]>>(new Map());
  sortedData: any[] = [];
  selectedSetId: string | null = null;

  constructor(private pokemonTcgService: PokemonTcgService) {
    this.loadSets();
  }

  loadSets() {
    this.isLoading.set(true);
    this.pokemonTcgService.getAllSets().subscribe({
      next: (response) => {
        const sortedSets = response.data.sort((a: any, b: any) => {
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        });

        const grouped = new Map<string, any[]>();

        sortedSets.forEach((set: any) => {
          const series = set.series;
          const currentGroup = grouped.get(series) || [];
          
          grouped.set(series, [...currentGroup, set]);
        });
        
        this.groupedData.set(grouped);
        this.sortedData = Array.from(grouped.entries());
      },
      error: (error) => {
        console.error('Lỗi khi tải bộ sưu tập:', error);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }
}
