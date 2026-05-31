import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { ProduitsComponent } from './produits.component';
import { ProduitService } from '../../services/produit.service';
import { CategorieService } from '../../services/categorie.service';
import { Produit, Categorie } from '../../types/electron';

describe('ProduitsComponent', () => {
  let component: ProduitsComponent;
  let fixture: ComponentFixture<ProduitsComponent>;

  let produitServiceMock: {
    getProduits: ReturnType<typeof vi.fn>;
    getProduitsByCategorie: ReturnType<typeof vi.fn>;
  };

  let categorieServiceMock: {
    getCategorieById: ReturnType<typeof vi.fn>;
  };

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
      image_produit: null,
      date_ajout: null,
      categorie_id: 1,
      variete_id: 1,
      categorie: {
        id_categorie: 1,
        nom_categorie: 'Légumes',
        descriptif: null,
      },
      variete: {
        id_variete: 1,
        nom: 'Marmande',
        descriptif: null,
        bio: 1,
        cycle_jours: null,
        cycle_de_vie: null,
        type_ensoleillement: null,
        type_feuillage: null,
        date_semis_min: null,
        date_semis_max: null,
        duree_avant_recolte: null,
        type_de_sol: null,
        duree_de_germination: null,
        temperature_min_de_germination: null,
        rusticite_plante: null,
        conseil_plantation: null,
        couleur_legume: null,
        taille_fixe_legume: null,
        taille_min_legume: null,
        taille_max_legume: null,
        espacement_entre_les_plants: null,
        espacement_entre_les_lignes: null,
        hauteur_adulte_min: null,
        hauteur_adulte_max: null,
        espece_id: 1,
        espece: {
          id_espece: 1,
          nom_commun: 'Tomate',
          nom_scientifique: 'Solanum lycopersicum',
        },
        aromate: [],
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
      categorie: {
        id_categorie: 2,
        nom_categorie: 'Aromatiques',
        descriptif: null,
      },
      variete: {
        id_variete: 2,
        nom: 'Grand Vert',
        descriptif: null,
        bio: 1,
        cycle_jours: null,
        cycle_de_vie: null,
        type_ensoleillement: null,
        type_feuillage: null,
        date_semis_min: null,
        date_semis_max: null,
        duree_avant_recolte: null,
        type_de_sol: null,
        duree_de_germination: null,
        temperature_min_de_germination: null,
        rusticite_plante: null,
        conseil_plantation: null,
        couleur_legume: null,
        taille_fixe_legume: null,
        taille_min_legume: null,
        taille_max_legume: null,
        espacement_entre_les_plants: null,
        espacement_entre_les_lignes: null,
        hauteur_adulte_min: null,
        hauteur_adulte_max: null,
        espece_id: 2,
        espece: {
          id_espece: 2,
          nom_commun: 'Basilic',
          nom_scientifique: 'Ocimum basilicum',
        },
        aromate: [
          {
            id_aromate: 1,
            partie_utilisee: 'Feuille',
            propriete: 'Parfumé',
            usage_culinaire: 'Cuisine',
            variete_id: 2,
          },
        ],
      },
    } as Produit,
  ];

  beforeEach(async () => {
    produitServiceMock = {
      getProduits: vi.fn().mockResolvedValue(produitsMock),
      getProduitsByCategorie: vi.fn().mockResolvedValue([produitsMock[0]]),
    };

    categorieServiceMock = {
      getCategorieById: vi.fn().mockResolvedValue(categorieMock),
    };

    await TestBed.configureTestingModule({
      imports: [ProduitsComponent],
      providers: [
        provideRouter([]),
        { provide: ProduitService, useValue: produitServiceMock },
        { provide: CategorieService, useValue: categorieServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProduitsComponent);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger tous les produits sans catégorie sélectionnée', async () => {
    await component.chargerProduits();

    expect(produitServiceMock.getProduits).toHaveBeenCalled();
    expect(produitServiceMock.getProduitsByCategorie).not.toHaveBeenCalled();
    expect(component.produits()).toEqual(produitsMock);
    expect(component.categorie()).toBeNull();
    expect(component.message()).toBe('');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait charger les produits d’une catégorie si categorieId est présent', async () => {
    fixture.componentRef.setInput('categorieId', '1');

    await component.chargerProduits();

    expect(categorieServiceMock.getCategorieById).toHaveBeenCalledWith(1);
    expect(produitServiceMock.getProduitsByCategorie).toHaveBeenCalledWith(1);
    expect(component.categorie()).toEqual(categorieMock);
    expect(component.produits()).toEqual([produitsMock[0]]);
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si le chargement échoue', async () => {
    produitServiceMock.getProduits.mockRejectedValue(new Error('Erreur test'));

    await component.chargerProduits();

    expect(component.message()).toBe('Erreur pendant le chargement des produits.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait retourner le titre général de la page', () => {
    component.categorie.set(null);

    expect(component.getTitrePage()).toBe('Produits');
  });

  it('devrait retourner le titre avec la catégorie', () => {
    component.categorie.set(categorieMock);

    expect(component.getTitrePage()).toBe('Produits - Légumes');
  });

  it('devrait afficher En stock si la quantité est supérieure à 0', () => {
    expect(component.getStatutProduit(produitsMock[0])).toBe('En stock');
  });

  it('devrait afficher Rupture de stock si la quantité est égale à 0', () => {
    expect(component.getStatutProduit(produitsMock[1])).toBe('Rupture de stock');
  });

  it('devrait retourner les catégories disponibles triées', () => {
    component.produits.set(produitsMock);

    expect(component.categoriesDisponibles()).toEqual(['Aromatiques', 'Légumes']);
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

  it('devrait filtrer les produits par recherche texte', () => {
    component.produits.set(produitsMock);
    component.recherche.set('basilic');

    expect(component.produitsFiltres()).toEqual([produitsMock[1]]);
  });

  it('devrait filtrer les produits en stock', () => {
    component.produits.set(produitsMock);
    component.stockRecherche.set('en-stock');

    expect(component.produitsFiltres()).toEqual([produitsMock[0]]);
  });

  it('devrait filtrer les produits en rupture', () => {
    component.produits.set(produitsMock);
    component.stockRecherche.set('rupture');

    expect(component.produitsFiltres()).toEqual([produitsMock[1]]);
  });

  it('devrait filtrer les aromates', () => {
    component.produits.set(produitsMock);
    component.aromateRecherche.set('oui');

    expect(component.produitsFiltres()).toEqual([produitsMock[1]]);
  });

  it('devrait filtrer les non-aromates', () => {
    component.produits.set(produitsMock);
    component.aromateRecherche.set('non');

    expect(component.produitsFiltres()).toEqual([produitsMock[0]]);
  });

  it('devrait filtrer par prix minimum', () => {
    component.produits.set(produitsMock);
    component.prixMinRecherche.set('2');

    expect(component.produitsFiltres()).toEqual([produitsMock[0]]);
  });

  it('devrait filtrer par prix maximum', () => {
    component.produits.set(produitsMock);
    component.prixMaxRecherche.set('2');

    expect(component.produitsFiltres()).toEqual([produitsMock[1]]);
  });

  it('devrait filtrer par catégorie', () => {
    component.produits.set(produitsMock);
    component.categorieRecherche.set('Légumes');

    expect(component.produitsFiltres()).toEqual([produitsMock[0]]);
  });

  it('devrait filtrer par variété', () => {
    component.produits.set(produitsMock);
    component.varieteRecherche.set('Grand Vert');

    expect(component.produitsFiltres()).toEqual([produitsMock[1]]);
  });

  it('devrait filtrer par espèce', () => {
    component.produits.set(produitsMock);
    component.especeRecherche.set('Tomate');

    expect(component.produitsFiltres()).toEqual([produitsMock[0]]);
  });
});