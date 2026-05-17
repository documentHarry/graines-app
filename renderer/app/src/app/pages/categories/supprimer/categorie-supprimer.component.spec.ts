import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CategorieSupprimerComponent } from './categorie-supprimer.component';
import { CategorieService } from '../../../services/categorie.service';
import { Categorie } from '../../../types/electron';

describe('CategorieSupprimerComponent', () => {
  let component: CategorieSupprimerComponent;
  let fixture: ComponentFixture<CategorieSupprimerComponent>;

  const categorieMock: Categorie = {
    id_categorie: 1,
    nom_categorie: 'Boissons',
    descriptif: 'Catégorie des boissons',
    _count: {
      produit: 0,
    },
  } as Categorie;

  const categoriesMock: Categorie[] = [
    categorieMock,
    {
      id_categorie: 2,
      nom_categorie: 'Snacks',
      descriptif: 'Catégorie snacks',
      _count: {
        produit: 3,
      },
    } as Categorie,
  ];

  const categorieServiceMock = {
    getCategorieById: () => Promise.resolve(categorieMock),
    getCategories: () => Promise.resolve(categoriesMock),
    deleteCategorie: () => Promise.resolve(),
    deleteCategorieWithReaffectation: () => Promise.resolve(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorieSupprimerComponent],
      providers: [
        provideRouter([]),
        {
          provide: CategorieService,
          useValue: categorieServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategorieSupprimerComponent);
    fixture.componentRef.setInput('id', '1');

    component = fixture.componentInstance;

    await component.chargerDonnees();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger la catégorie', () => {
    expect(component.categorie()).toEqual(categorieMock);
    expect(component.isLoading()).toBe(false);
    expect(component.message()).toBe('');
  });

  it('devrait afficher le titre de la page', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Supprimer une catégorie');
  });

  it('devrait afficher le lien retour aux catégories', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('← Retour aux catégories');
  });

  it('devrait afficher les informations de la catégorie', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Boissons');
    expect(element.textContent).toContain('Catégorie des boissons');
  });

  it('devrait afficher le nombre de produits associés', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(component.getNombreProduits()).toBe(0);
    expect(element.textContent).toContain('Produits associés:');
    expect(element.textContent).toContain('0');
  });

  it('devrait afficher le bouton Supprimer si la catégorie ne contient aucun produit', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Cette catégorie ne contient aucun produit');
    expect(element.textContent).toContain('Supprimer');
    expect(element.textContent).toContain('Annuler');
  });

  it('devrait retirer la catégorie actuelle de la liste des catégories', () => {
    expect(component.categories().length).toBe(1);
    expect(component.categories()[0].nom_categorie).toBe('Snacks');
  });

  it('devrait rendre le formulaire de réaffectation invalide si aucune catégorie nest sélectionnée', () => {
    component.reaffectationForm.patchValue({
      categorie_destination_id: 0,
    });

    expect(component.reaffectationForm.invalid).toBe(true);
  });

  it('devrait rendre le formulaire de réaffectation valide si une catégorie est sélectionnée', () => {
    component.reaffectationForm.patchValue({
      categorie_destination_id: 2,
    });

    expect(component.reaffectationForm.valid).toBe(true);
  });
});