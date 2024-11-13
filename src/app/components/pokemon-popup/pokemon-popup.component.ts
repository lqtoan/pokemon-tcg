import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PokemonDetailsComponent } from '../pokemon-details/pokemon-details.component';
import { Pokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-popup',
  standalone: true,
  imports: [CommonModule, PokemonDetailsComponent],
  templateUrl: './pokemon-popup.component.html',
  styleUrl: './pokemon-popup.component.scss',
})
export class PokemonDetailsPopupComponent {
  @Input() selectedPokemon: Pokemon | null = null;
  @Output() closePopup = new EventEmitter<void>();

  close(): void {
    this.closePopup.emit();
  }
}
