import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CategorieAjouterComponent } from './categorie-ajouter.component';

describe('CategorieAjouterComponent', () => {
  let component: CategorieAjouterComponent;
  let fixture: ComponentFixture<CategorieAjouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorieAjouterComponent],
      providers: [
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategorieAjouterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait avoir un formulaire invalide quand le nom de catégorie est vide', () => {
    component.categorieForm.patchValue({
      nom_categorie: '',
      descriptif: 'Description de test',
    });

    expect(component.categorieForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire valide quand le nom de catégorie est renseigné', () => {
    component.categorieForm.patchValue({
      nom_categorie: 'Camomille',
      descriptif: 'Plantes aromatiques et médicinales',
    });

    expect(component.categorieForm.valid).toBe(true);
  });

  it('devrait accepter un descriptif vide si le nom de catégorie est renseigné', () => {
    component.categorieForm.patchValue({
      nom_categorie: 'Basilic',
      descriptif: '',
    });

    expect(component.categorieForm.valid).toBe(true);
  });
});