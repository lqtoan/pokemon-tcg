import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonDetailsPopupComponent } from './pokemon-details-popup.component';

describe('PokemonDetailsPopupComponent', () => {
  let component: PokemonDetailsPopupComponent;
  let fixture: ComponentFixture<PokemonDetailsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonDetailsPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PokemonDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
