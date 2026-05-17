import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { CategoriesComponent } from './categories.component';
import { CategorieService } from '../../services/categorie.service';
import { Categorie } from '../../types/electron';

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;

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

  const categorieServiceMock = {
    getCategories: vi.fn(),
  };

  beforeEach(async () => {
    categorieServiceMock.getCategories.mockResolvedValue(categoriesMock);

    await TestBed.configureTestingModule({
      imports: [CategoriesComponent],
      providers: [
        provideRouter([]),
        {
          provide: CategorieService,
          useValue: categorieServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger les catégories', () => {
    expect(component.categories()).toEqual(categoriesMock);
    expect(component.isLoading()).toBe(false);
    expect(component.message()).toBe('');
  });

  it('devrait afficher les catégories dans la page', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Boissons');
    expect(element.textContent).toContain('Catégorie des boissons');
    expect(element.textContent).toContain('Snacks');
  });

  it('devrait afficher le nombre de produits', () => {
    const element: HTMLElement = fixture.nativeElement;
    const counts = element.querySelectorAll('.produits-count');

    expect(counts[0].textContent?.trim()).toBe('3');
    expect(counts[1].textContent?.trim()).toBe('0');
  });

  it('devrait retourner 0 si la catégorie na pas de produits', () => {
    const categorie = {
      id_categorie: 1,
      nom_categorie: 'Boissons',
    } as Categorie;

    expect(component.getNombreProduits(categorie)).toBe(0);
  });
});