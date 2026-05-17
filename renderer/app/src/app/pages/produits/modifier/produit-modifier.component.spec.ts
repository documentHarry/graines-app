import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProduitModifierComponent } from './produit-modifier.component';

describe('ProduitModifierComponent', () => {
  let component: ProduitModifierComponent;
  let fixture: ComponentFixture<ProduitModifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitModifierComponent],
      providers: [ provideRouter([]) ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProduitModifierComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait avoir un formulaire invalide quand le prix est égal à 0', () => {
    component.produitForm.patchValue({
      intitule: 'Tomate test',
      prix_unitaire: 0,
      quantite: 10,
      categorie_id: 1,
      variete_id: 1,
    });

    expect(component.produitForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire invalide quand la quantité est négative', () => {
    component.produitForm.patchValue({
      intitule: 'Tomate test',
      prix_unitaire: 3.5,
      quantite: -1,
      categorie_id: 1,
      variete_id: 1,
    });

    expect(component.produitForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire valide quand les données sont correctes', () => {
    component.produitForm.patchValue({
      intitule: 'Tomate test',
      prix_unitaire: 3.5,
      quantite: 10,
      categorie_id: 1,
      variete_id: 1,
    });

    expect(component.produitForm.valid).toBe(true);
  });
});