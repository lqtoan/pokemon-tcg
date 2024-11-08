import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonSetListComponent } from './pokemon-tcg-set-list.component';

describe('PokemonSetListComponent', () => {
  let component: PokemonSetListComponent;
  let fixture: ComponentFixture<PokemonSetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonSetListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PokemonSetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
