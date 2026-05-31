import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { CategoriesComponent } from './categories.component';
import { CategorieService } from '../../services/categorie.service';
import { AuthService } from '../../services/auth.service';
import { Categorie } from '../../types/electron';

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;

  let categorieServiceMock: {
    getCategories: ReturnType<typeof vi.fn>;
  };

  let authServiceMock: {
    hasAnyRole: ReturnType<typeof vi.fn>;
  };

  const categoriesMock: Categorie[] = [
    {
      id_categorie: 1,
      nom_categorie: 'Boissons',
      descriptif: 'Catégorie des boissons',
      _count: {
        produit: 3,
      },
    } as Categorie,
    {
      id_categorie: 2,
      nom_categorie: 'Snacks',
      descriptif: '',
      _count: {
        produit: 0,
      },
    } as Categorie,
  ];

  beforeEach(async () => {
    categorieServiceMock = {
      getCategories: vi.fn().mockResolvedValue(categoriesMock),
    };

    authServiceMock = {
      hasAnyRole: vi.fn().mockReturnValue(false),
    };

    await TestBed.configureTestingModule({
      imports: [CategoriesComponent],
      providers: [
        provideRouter([]),
        { provide: CategorieService, useValue: categorieServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;

    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger les catégories', () => {
    expect(categorieServiceMock.getCategories).toHaveBeenCalled();
    expect(component.categories()).toEqual(categoriesMock);
    expect(component.isLoading()).toBe(false);
    expect(component.message()).toBe('');
  });

  it('devrait afficher un message si le chargement échoue', async () => {
    categorieServiceMock.getCategories.mockRejectedValue(new Error('Erreur test'));

    await component.chargerCategories();

    expect(component.message()).toBe('Erreur pendant le chargement des catégories.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait filtrer les catégories par nom', () => {
    component.rechercheNom.set('bois');

    expect(component.categoriesFiltrees()).toEqual([categoriesMock[0]]);
  });

  it('devrait filtrer les catégories par descriptif', () => {
    component.rechercheDescriptif.set('boissons');

    expect(component.categoriesFiltrees()).toEqual([categoriesMock[0]]);
  });

  it('devrait retourner toutes les catégories si les recherches sont vides', () => {
    expect(component.categoriesFiltrees()).toEqual(categoriesMock);
  });

  it('devrait mettre à jour la recherche par nom', () => {
    const event = {
      target: { value: 'snack' },
    } as unknown as Event;

    component.changerRechercheNom(event);

    expect(component.rechercheNom()).toBe('snack');
  });

  it('devrait mettre à jour la recherche par descriptif', () => {
    const event = {
      target: { value: 'boissons' },
    } as unknown as Event;

    component.changerRechercheDescriptif(event);

    expect(component.rechercheDescriptif()).toBe('boissons');
  });

  it('devrait retourner le nombre de produits', () => {
    expect(component.getNombreProduits(categoriesMock[0])).toBe(3);
  });

  it('devrait retourner 0 si la catégorie n’a pas de produits', () => {
    const categorie = {
      id_categorie: 1,
      nom_categorie: 'Boissons',
    } as Categorie;

    expect(component.getNombreProduits(categorie)).toBe(0);
  });
});