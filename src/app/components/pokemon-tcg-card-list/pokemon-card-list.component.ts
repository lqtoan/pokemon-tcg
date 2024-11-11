import { Component, HostListener, signal } from '@angular/core';
import { PokemonTcgService } from '../../services/pokemon-tcg.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '../../models/pokemon-tcg-card.model';

@Component({
  selector: 'app-pokemon-card-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-card-list.component.html',
  styleUrls: ['./pokemon-card-list.component.scss'],
})
export class PokemonCardListComponent {
  isLoading = signal(false);
  data = signal<Card[]>([]);
  setId: string | null = '';
  title: string = '';

  private page = 1;
  private pageSize = 15;
  private maxPage = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private pokemonTcgService: PokemonTcgService
  ) {}

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
        this.maxPage = Math.ceil(response.data.total / this.pageSize);
        this.title = response.data.name;
      },
      error: (error) => {
        console.error('Lỗi khi lấy thông tin set:', error);
      }
    });
  }

  loadCardsBySet(setId: string) {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.pokemonTcgService.getCardsBySet(setId, this.page, this.pageSize).subscribe({
      next: (response) => {
        const newData = response.data || [];
        this.data.set([...this.data(), ...newData]);
      },
      error: (error) => {
        console.error('Lỗi khi tải dữ liệu:', error);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const threshold = 300;
    const position = window.innerHeight + window.scrollY;
    const height = document.documentElement.scrollHeight;

    if (position >= height - threshold && !this.isLoading() && this.shouldLoadMore()) {
      this.page++;
      this.loadCardsBySet(this.setId as string);
    }
  }

  goBack() {
    this.router.navigate(['/tcg']);
  }

  private shouldLoadMore(): boolean {
    return (
      !this.isLoading() &&
      this.page < this.maxPage
    );
  }
}
