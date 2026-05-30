import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateurAdresseLivraisonComponent } from './utilisateur-adresse-livraison.component';

describe('UtilisateurAdresseLivraisonComponent', () => {
  let component: UtilisateurAdresseLivraisonComponent;
  let fixture: ComponentFixture<UtilisateurAdresseLivraisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateurAdresseLivraisonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UtilisateurAdresseLivraisonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
