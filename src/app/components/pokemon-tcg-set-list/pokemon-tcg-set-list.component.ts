import { Component, inject, signal } from '@angular/core';
import { PokemonTcgService } from '../../services/pokemon-tcg.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-set-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-tcg-set-list.component.html',
  styleUrl: './pokemon-tcg-set-list.component.scss'
})
export class PokemonSetListComponent {

  isLoading = signal(false);
  groupedData = signal<Map<string, any[]>>(new Map());
  sortedData: any[] = [];

  constructor(private pokemonTcgService: PokemonTcgService) {
    this.loadSets();
  }

  loadSets() {
    this.isLoading.set(true);
    this.pokemonTcgService.getAllSets().subscribe({
      next: (response) => {
        // Sắp xếp tất cả bộ sưu tập theo ngày phát hành từ mới nhất đến cũ nhất
        const sortedSets = response.data.sort((a: any, b: any) => {
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        });

        // Nhóm bộ sưu tập theo series mà không sử dụng `push`
        const grouped = new Map<string, any[]>();

        sortedSets.forEach((set: any) => {
          const series = set.series;
          const currentGroup = grouped.get(series) || []; // Lấy nhóm hiện tại, nếu không có thì tạo mảng rỗng
          
          
          grouped.set(series, [...currentGroup, set]);
        });
        
        // Cập nhật dữ liệu đã nhóm và sắp xếp
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
