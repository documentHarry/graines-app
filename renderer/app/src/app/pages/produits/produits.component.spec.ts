import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProduitsComponent } from './produits.component';
import { ProduitService } from '../../services/produit.service';
import { CategorieService } from '../../services/categorie.service';
import { Produit, Categorie } from '../../types/electron';

describe('ProduitsComponent', () => {
  let component: ProduitsComponent;
  let fixture: ComponentFixture<ProduitsComponent>;

  const categorieMock: Categorie = {
    id_categorie: 1,
    nom_categorie: 'Légumes',
    descriptif: 'Catégorie légumes',
  } as Categorie;

  const produitsMock: Produit[] = [
    {
      id_produit: 1,
      intitule: 'Tomate Marmande',
      prix_unitaire: 2.5,
      quantite: 10,
      categorie: {
        id_categorie: 1,
        nom_categorie: 'Légumes',
      },
      variete: {
        id_variete: 1,
        nom: 'Marmande',
        espece: {
          id_espece: 1,
          nom_commun: 'Tomate',
          nom_scientifique: 'Solanum lycopersicum',
        },
      },
    } as Produit,
    {
      id_produit: 2,
      intitule: 'Basilic',
      prix_unitaire: 1.8,
      quantite: 0,
      categorie: {
        id_categorie: 2,
        nom_categorie: 'Aromatiques',
      },
      variete: {
        id_variete: 2,
        nom: 'Grand Vert',
        espece: {
          id_espece: 2,
          nom_commun: 'Basilic',
          nom_scientifique: 'Ocimum basilicum',
        },
      },
    } as Produit,
  ];

  const produitServiceMock = {
    getProduits: () => Promise.resolve(produitsMock),
    getProduitsByCategorie: () => Promise.resolve(produitsMock),
  };

  const categorieServiceMock = {
    getCategorieById: () => Promise.resolve(categorieMock),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitsComponent],
      providers: [
        provideRouter([]),
        {
          provide: ProduitService,
          useValue: produitServiceMock,
        },
        {
          provide: CategorieService,
          useValue: categorieServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProduitsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger les produits', () => {
    expect(component.produits()).toEqual(produitsMock);
    expect(component.isLoading()).toBe(false);
    expect(component.message()).toBe('');
  });

  it('devrait afficher les produits dans la page', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('Tomate Marmande');
    expect(element.textContent).toContain('Basilic');
  });

  it('devrait afficher les informations des produits', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('Légumes');
    expect(element.textContent).toContain('Marmande');
    expect(element.textContent).toContain('Tomate');
    expect(element.textContent).toContain('Solanum lycopersicum');
  });

  it('devrait afficher le prix et la quantité', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('2.5 €');
    expect(element.textContent).toContain('Quantité: 10');
  });

  it('devrait afficher En stock si la quantité est supérieure à 0', () => {
    const statut = component.getStatutProduit(produitsMock[0]);
    expect(statut).toBe('En stock');
  });

  it('devrait afficher Rupture de stock si la quantité est égale à 0', () => {
    const statut = component.getStatutProduit(produitsMock[1]);
    expect(statut).toBe('Rupture de stock');
  });

  it('devrait afficher le lien Ajouter un produit', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('Ajouter un produit');
  });
});