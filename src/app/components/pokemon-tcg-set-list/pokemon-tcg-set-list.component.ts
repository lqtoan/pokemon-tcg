import { Component, signal } from '@angular/core';
import { PokemonTcgService } from '../../services/pokemon-tcg.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Set } from '../../models/pokemon-tcg-set.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pokemon-set-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pokemon-tcg-set-list.component.html',
  styleUrl: './pokemon-tcg-set-list.component.scss'
})
export class PokemonSetListComponent {
  isLoading = signal(false);
  groupedData = signal<Map<string, Set[]>>(new Map());
  sortedData: [string, Set[]][] = [];
  selectedSetId: string | null = null;

  private subscriptions: Subscription[] = [];

  constructor(private pokemonTcgService: PokemonTcgService) {
    this.loadSets();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadSets() {
    this.isLoading.set(true);
    const pokemonTcgSubscription = this.pokemonTcgService.getAllSets().subscribe({
      next: (response) => {
        const sortedSets = response.data.sort((a: Set, b: Set) => {
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        });

        const grouped = new Map<string, Set[]>();

        sortedSets.forEach((set: Set) => {
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

    this.subscriptions.push(pokemonTcgSubscription);
  }
}
