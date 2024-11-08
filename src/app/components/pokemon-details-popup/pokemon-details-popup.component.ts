import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PokemonDetailsComponent } from '../pokemon-details/pokemon-details.component';

@Component({
  selector: 'app-pokemon-details-popup',
  standalone: true,
  imports: [CommonModule, PokemonDetailsComponent],
  templateUrl: './pokemon-details-popup.component.html',
  styleUrl: './pokemon-details-popup.component.scss',
})
export class PokemonDetailsPopupComponent {
  @Input() pokemon: any;
  @Output() closePopup = new EventEmitter<void>(); // Đóng pop-up

  close(): void {
    this.closePopup.emit();
  }
}
