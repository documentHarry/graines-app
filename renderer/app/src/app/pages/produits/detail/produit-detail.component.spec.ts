import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { ProduitDetailComponent } from './produit-detail.component';
import { ProduitService } from '../../../services/produit.service';
import { Produit } from '../../../types/electron';

describe('ProduitDetailComponent', () => {
  let component: ProduitDetailComponent;
  let fixture: ComponentFixture<ProduitDetailComponent>;
  let produitServiceMock: {
    getProduitById: ReturnType<typeof vi.fn>;
    getProduitsSimilaires: ReturnType<typeof vi.fn>;
    deleteProduit: ReturnType<typeof vi.fn>;
  };
  let router: Router;

  const produitMock: Produit = {
    id_produit: 1,
    intitule: 'Tomate test',
    prix_unitaire: 3.5,
    quantite: 10,
    image_produit: null,
    date_ajout: null,
    categorie_id: 1,
    variete_id: 1,
    categorie: {
      id_categorie: 1,
      nom_categorie: 'Tomate',
      descriptif: null,
    },
    variete: {
      id_variete: 1,
      nom: 'Marmande',
      descriptif: null,
      bio: 1,
      cycle_jours: null,
      couleur_legume: null,
      taille_fixe_legume: null,
      taille_min_legume: null,
      taille_max_legume: null,
      espacement_entre_les_plants: null,
      espacement_entre_les_lignes: null,
      type_ensoleillement: null,
      type_feuillage: null,
      hauteur_adulte_min: null,
      hauteur_adulte_max: null,
      duree_de_germination: null,
      temperature_min_de_germination: null,
      cycle_de_vie: null,
      rusticite_plante: null,
      date_semis_min: null,
      date_semis_max: null,
      duree_avant_recolte: null,
      type_de_sol: null,
      conseil_plantation: null,
      espece_id: 1,
      espece: {
        id_espece: 1,
        nom_scientifique: 'Solanum lycopersicum',
        nom_commun: 'Tomate',
      },
    },
  };

  beforeEach(async () => {
    produitServiceMock = {
      getProduitById: vi.fn().mockResolvedValue(produitMock),
      getProduitsSimilaires: vi.fn().mockResolvedValue([]),
      deleteProduit: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [ProduitDetailComponent],
      providers: [
        provideRouter([]),
        { provide: ProduitService, useValue: produitServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ProduitDetailComponent);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger le produit et les produits similaires', async () => {
    const produitSimilaire: Produit = {
      ...produitMock,
      id_produit: 2,
      intitule: 'Tomate similaire',
    };

    produitServiceMock.getProduitsSimilaires.mockResolvedValue([produitSimilaire]);
    fixture.componentRef.setInput('id', '1');

    await component.chargerProduit();

    expect(produitServiceMock.getProduitById).toHaveBeenCalledWith(1);
    expect(produitServiceMock.getProduitsSimilaires).toHaveBeenCalledWith(1);
    expect(component.produit()).toEqual(produitMock);
    expect(component.produitsSimilaires()).toEqual([produitSimilaire]);
    expect(component.message()).toBe('');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si l’identifiant du produit est invalide', async () => {
    fixture.componentRef.setInput('id', 'abc');

    await component.chargerProduit();

    expect(component.message()).toBe('Identifiant du produit invalide.');
    expect(component.isLoading()).toBe(false);
    expect(produitServiceMock.getProduitById).not.toHaveBeenCalled();
  });

  it('devrait afficher un message si le produit est introuvable', async () => {
    produitServiceMock.getProduitById.mockResolvedValue(null);
    fixture.componentRef.setInput('id', '1');

    await component.chargerProduit();

    expect(component.message()).toBe('Produit introuvable.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si le chargement du produit échoue', async () => {
    produitServiceMock.getProduitById.mockRejectedValue(new Error('Erreur test'));
    fixture.componentRef.setInput('id', '1');

    await component.chargerProduit();

    expect(component.message()).toBe('Erreur pendant le chargement du produit.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher Oui quand la variété est bio', () => {
    component.produit.set(produitMock);

    expect(component.getLabelBio()).toBe('Oui');
  });

  it('devrait afficher Non quand la variété n’est pas bio', () => {
    component.produit.set({
      ...produitMock,
      variete: {
        ...produitMock.variete,
        bio: 0,
      },
    });

    expect(component.getLabelBio()).toBe('Non');
  });

  it('devrait retourner null quand le produit n’a pas d’image', () => {
    component.produit.set(produitMock);

    expect(component.getImageProduit()).toBe(null);
  });

  it('devrait retourner l’image du produit quand elle existe', () => {
    component.produit.set({
      ...produitMock,
      image_produit: 'image-test.jpg',
    });

    expect(component.getImageProduit()).toBe('image-test.jpg');
  });

  it('devrait afficher En stock quand la quantité est supérieure à 0', () => {
    component.produit.set(produitMock);

    expect(component.getStatutProduit()).toBe('En stock');
  });

  it('devrait afficher Rupture de stock quand la quantité est égale à 0', () => {
    component.produit.set({
      ...produitMock,
      quantite: 0,
    });

    expect(component.getStatutProduit()).toBe('Rupture de stock');
  });

  it('devrait découper les conseils de plantation en plusieurs phrases', () => {
    component.produit.set({
      ...produitMock,
      variete: {
        ...produitMock.variete,
        conseil_plantation: 'Semer en godet. Repiquer après les gelées.',
      },
    });

    expect(component.getConseilsPlantation()).toEqual([
      'Semer en godet.',
      'Repiquer après les gelées.',
    ]);
  });

  it('devrait retourner une liste vide si aucun conseil de plantation n’existe', () => {
    component.produit.set(produitMock);

    expect(component.getConseilsPlantation()).toEqual([]);
  });

  it('devrait initialiser la liste des produits similaires vide', () => {
    expect(component.produitsSimilaires()).toEqual([]);
  });

  it('ne devrait pas supprimer si aucun produit n’est chargé', async () => {
    await component.supprimerProduit();

    expect(produitServiceMock.deleteProduit).not.toHaveBeenCalled();
  });

  it('ne devrait pas supprimer si la confirmation est annulée', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.produit.set(produitMock);

    await component.supprimerProduit();

    expect(confirmSpy).toHaveBeenCalledWith('Voulez-vous vraiment supprimer ce produit ?');
    expect(produitServiceMock.deleteProduit).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('devrait supprimer le produit et rediriger vers la liste', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.produit.set(produitMock);

    await component.supprimerProduit();

    expect(produitServiceMock.deleteProduit).toHaveBeenCalledWith(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/produits']);

    confirmSpy.mockRestore();
  });

  it('devrait afficher un message si la suppression échoue', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    produitServiceMock.deleteProduit.mockRejectedValue(new Error('Erreur suppression'));

    component.produit.set(produitMock);

    await component.supprimerProduit();

    expect(component.message()).toBe('Une erreur est survenue pendant la suppression du produit.');
  });
});