import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitFiltresComponent } from './produit-filtres.component';

describe('ProduitFiltresComponent', () => {
  let component: ProduitFiltresComponent;
  let fixture: ComponentFixture<ProduitFiltresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitFiltresComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProduitFiltresComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
