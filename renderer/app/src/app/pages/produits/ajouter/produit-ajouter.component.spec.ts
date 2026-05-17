import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProduitAjouterComponent } from './produit-ajouter.component';
import { provideRouter } from '@angular/router';

describe('ProduitAjouterComponent', () => {
  let component: ProduitAjouterComponent;
  let fixture: ComponentFixture<ProduitAjouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitAjouterComponent],
      providers: [ provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ProduitAjouterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait avoir un formulaire invalide quand les champs obligatoires sont vides', () => {
    component.produitForm.patchValue({
      intitule: '',
      prix_unitaire: 0,
      quantite: 0,
      categorie_id: 0,
      variete_id: 0,
    });

    expect(component.produitForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire valide quand les champs obligatoires sont remplis', () => {
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
