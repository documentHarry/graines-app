import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { ProduitsComponent } from './produits.component';
import { ProduitService } from '../../services/produit.service';
import { AuthService } from '../../services/auth.service';
import { Produit } from '../../types/electron';

describe('ProduitsComponent', () => {
  let component: ProduitsComponent;
  let fixture: ComponentFixture<ProduitsComponent>;

  let produitServiceMock: {
    getProduits: ReturnType<typeof vi.fn>;
    getProduitsByCategorie: ReturnType<typeof vi.fn>;
    filtrerProduits: ReturnType<typeof vi.fn>;
    getStatutProduit: ReturnType<typeof vi.fn>;
  };

  let authServiceMock: {
    hasAnyRole: ReturnType<typeof vi.fn>;
  };

  const produitsMock: Produit[] = [
    {
      id_produit: 1,
      intitule: 'Tomate Marmande',
      prix_unitaire: 2.5,
      quantite: 10,
      image_produit: null,
      date_ajout: null,
      categorie_id: 1,
      variete_id: 1,
      variete: {
        id_variete: 1,
        nom: 'Marmande',
        bio: 1,
        espece_id: 1,
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
      image_produit: null,
      date_ajout: null,
      categorie_id: 2,
      variete_id: 2,
      variete: {
        id_variete: 2,
        nom: 'Grand Vert',
        bio: 1,
        espece_id: 2,
        espece: {
          id_espece: 2,
          nom_commun: 'Basilic',
          nom_scientifique: 'Ocimum basilicum',
        },
      },
    } as Produit,
  ];

  beforeEach(async () => {
    produitServiceMock = {
      getProduits: vi.fn().mockResolvedValue(produitsMock),
      getProduitsByCategorie: vi.fn().mockResolvedValue([produitsMock[0]]),

      filtrerProduits: vi.fn().mockImplementation((
        produits: Produit[],
        rechercheTexte: string,
        stockRecherche: string,
        prixMinRecherche: string,
        prixMaxRecherche: string,
        varieteRecherche: string,
        especeRecherche: string
      ) => {
        const recherche = rechercheTexte.toLowerCase().trim();

        return produits.filter(produit => {
          const correspondRecherche =
            recherche === '' ||
            produit.intitule.toLowerCase().includes(recherche) ||
            produit.variete.nom.toLowerCase().includes(recherche) ||
            produit.variete.espece.nom_commun.toLowerCase().includes(recherche) ||
            produit.variete.espece.nom_scientifique.toLowerCase().includes(recherche);

          const correspondStock =
            stockRecherche === '' ||
            stockRecherche === 'en-stock' && produit.quantite > 0 ||
            stockRecherche === 'rupture' && produit.quantite === 0;

          const prixMin = prixMinRecherche === '' ? null : Number(prixMinRecherche);
          const prixMax = prixMaxRecherche === '' ? null : Number(prixMaxRecherche);

          const correspondPrixMin = prixMin === null || produit.prix_unitaire >= prixMin;
          const correspondPrixMax = prixMax === null || produit.prix_unitaire <= prixMax;

          const correspondVariete =
            varieteRecherche === '' || produit.variete.nom === varieteRecherche;

          const correspondEspece =
            especeRecherche === '' || produit.variete.espece.nom_commun === especeRecherche;

          return correspondRecherche
            && correspondStock
            && correspondPrixMin
            && correspondPrixMax
            && correspondVariete
            && correspondEspece;
        });
      }),

      getStatutProduit: vi.fn().mockImplementation((produit: Produit | null) => {
        if (produit?.quantite && produit.quantite > 0) {
          return 'En stock';
        }

        return 'Rupture de stock';
      }),
    };

    authServiceMock = {
      hasAnyRole: vi.fn().mockReturnValue(false),
    };

    await TestBed.configureTestingModule({
      imports: [ProduitsComponent],
      providers: [
        provideRouter([]),
        { provide: ProduitService, useValue: produitServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProduitsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger tous les produits sans catégorie sélectionnée', async () => {
    await component.chargerProduits();

    expect(produitServiceMock.getProduits).toHaveBeenCalled();
    expect(produitServiceMock.getProduitsByCategorie).not.toHaveBeenCalled();
    expect(component.produits()).toEqual(produitsMock);
    expect(component.message()).toBe('');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait charger les produits d’une catégorie si categorieId est présent', async () => {
    fixture.componentRef.setInput('categorieId', '1');

    await component.chargerProduits();

    expect(produitServiceMock.getProduitsByCategorie).toHaveBeenCalledWith(1);
    expect(component.produits()).toEqual([produitsMock[0]]);
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si le chargement échoue', async () => {
    produitServiceMock.getProduits.mockRejectedValue(new Error('Erreur test'));

    await component.chargerProduits();

    expect(component.message()).toBe('Erreur pendant le chargement des produits.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher En stock si la quantité est supérieure à 0 via le service', () => {
    expect(component.getStatutProduit(produitsMock[0])).toBe('En stock');
    expect(produitServiceMock.getStatutProduit).toHaveBeenCalledWith(produitsMock[0]);
  });

  it('devrait afficher Rupture de stock si la quantité est égale à 0 via le service', () => {
    expect(component.getStatutProduit(produitsMock[1])).toBe('Rupture de stock');
    expect(produitServiceMock.getStatutProduit).toHaveBeenCalledWith(produitsMock[1]);
  });

  it('devrait retourner les variétés disponibles triées', () => {
    component.produits.set(produitsMock);

    expect(component.varietesDisponibles()).toEqual(['Grand Vert', 'Marmande']);
  });

  it('devrait retourner les espèces disponibles triées', () => {
    component.produits.set(produitsMock);

    expect(component.especesDisponibles()).toEqual(['Basilic', 'Tomate']);
  });

  it('devrait retourner le prix minimum disponible', () => {
    component.produits.set(produitsMock);

    expect(component.prixMinimumDisponible()).toBe(1.8);
  });

  it('devrait retourner 0 comme prix minimum si aucun produit', () => {
    component.produits.set([]);

    expect(component.prixMinimumDisponible()).toBe(0);
  });

  it('devrait retourner le prix maximum disponible', () => {
    component.produits.set(produitsMock);

    expect(component.prixMaximumDisponible()).toBe(2.5);
  });

  it('devrait retourner 0 comme prix maximum si aucun produit', () => {
    component.produits.set([]);

    expect(component.prixMaximumDisponible()).toBe(0);
  });

  it('devrait filtrer les produits par recherche texte via le service', () => {
    component.produits.set(produitsMock);
    component.recherche.set('basilic');

    expect(component.produitsFiltres()).toEqual([produitsMock[1]]);
    expect(produitServiceMock.filtrerProduits).toHaveBeenCalledWith(
      produitsMock,
      'basilic',
      '',
      '',
      '',
      '',
      ''
    );
  });

  it('devrait filtrer les produits en stock via le service', () => {
    component.produits.set(produitsMock);
    component.stockRecherche.set('en-stock');

    expect(component.produitsFiltres()).toEqual([produitsMock[0]]);
  });

  it('devrait filtrer les produits en rupture via le service', () => {
    component.produits.set(produitsMock);
    component.stockRecherche.set('rupture');

    expect(component.produitsFiltres()).toEqual([produitsMock[1]]);
  });

  it('devrait filtrer par prix minimum via le service', () => {
    component.produits.set(produitsMock);
    component.prixMinRecherche.set('2');

    expect(component.produitsFiltres()).toEqual([produitsMock[0]]);
  });

  it('devrait filtrer par prix maximum via le service', () => {
    component.produits.set(produitsMock);
    component.prixMaxRecherche.set('2');

    expect(component.produitsFiltres()).toEqual([produitsMock[1]]);
  });

  it('devrait filtrer par variété via le service', () => {
    component.produits.set(produitsMock);
    component.varieteRecherche.set('Grand Vert');

    expect(component.produitsFiltres()).toEqual([produitsMock[1]]);
  });

  it('devrait filtrer par espèce via le service', () => {
    component.produits.set(produitsMock);
    component.especeRecherche.set('Tomate');

    expect(component.produitsFiltres()).toEqual([produitsMock[0]]);
  });
});