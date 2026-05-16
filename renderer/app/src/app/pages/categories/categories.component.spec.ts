import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesComponent } from './categories.component';
import { CategorieService } from '../../services/categorie.service';
import { Categorie } from '../../types/electron';

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;

  const categoriesTest: Categorie[] = [
    {
      id_categorie: 1,
      nom_categorie: 'Tomate rouge',
      descriptif: 'Variétés de tomates rouges pour potager',
    },
    {
      id_categorie: 2,
      nom_categorie: 'Basilic',
      descriptif: 'Basilic variétés anciennes bio aromatiques',
    },
  ];

  const categorieServiceMock = {
    getCategories: () => Promise.resolve(categoriesTest),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesComponent],
      providers: [
        {
          provide: CategorieService,
          useValue: categorieServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger les catégories depuis le service', async () => {
    await component.chargerCategories();

    expect(component.categories().length).toBe(2);
    expect(component.categories()[0].nom_categorie).toBe('Tomate rouge');
    expect(component.isLoading()).toBe(false);
    expect(component.message()).toBe('');
  });

  it('devrait afficher un message d’erreur si le chargement échoue', async () => {
    const service = TestBed.inject(CategorieService);

    service.getCategories = () => Promise.reject();

    await component.chargerCategories();

    expect(component.message()).toBe('Erreur pendant le chargement des catégories.');
    expect(component.isLoading()).toBe(false);
  });
});