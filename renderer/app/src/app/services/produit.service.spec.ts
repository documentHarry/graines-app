import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { ProduitService } from './produit.service';
import { ElectronService } from './electron.service';
import { Produit, ProduitCreateInput, ProduitUpdateInput } from '../types/electron';

describe('ProduitService', () => {
  let service: ProduitService;

  let apiMock: {
    getProduits: ReturnType<typeof vi.fn>;
    getProduitById: ReturnType<typeof vi.fn>;
    getProduitsByCategorie: ReturnType<typeof vi.fn>;
    createProduit: ReturnType<typeof vi.fn>;
    updateProduit: ReturnType<typeof vi.fn>;
    deleteProduit: ReturnType<typeof vi.fn>;
  };

  let electronServiceMock: {
    getApi: ReturnType<typeof vi.fn>;
  };

  const produitMock: Produit = {
    id_produit: 1,
    intitule: 'Graines de basilic',
    prix_unitaire: 3.5,
    quantite: 10,
    image_produit: null,
    date_ajout: null,
    categorie_id: 1,
    variete_id: 1,
    categorie: {
      id_categorie: 1,
      nom_categorie: 'Aromates',
      descriptif: null,
    },
    variete: {
      id_variete: 1,
      nom: 'Basilic Genovese',
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
        nom_commun: 'Basilic',
        nom_scientifique: 'Ocimum basilicum',
      },
    },
  } as Produit;

  beforeEach(() => {
    apiMock = {
      getProduits: vi.fn().mockResolvedValue([produitMock]),
      getProduitById: vi.fn().mockResolvedValue(produitMock),
      getProduitsByCategorie: vi.fn().mockResolvedValue([produitMock]),
      createProduit: vi.fn().mockResolvedValue(produitMock),
      updateProduit: vi.fn().mockResolvedValue(produitMock),
      deleteProduit: vi.fn().mockResolvedValue(produitMock),
    };

    electronServiceMock = {
      getApi: vi.fn().mockReturnValue(apiMock),
    };

    TestBed.configureTestingModule({
      providers: [
        ProduitService,
        { provide: ElectronService, useValue: electronServiceMock },
      ],
    });

    service = TestBed.inject(ProduitService);
  });

  it('devrait créer le service', () => {
    expect(service).toBeTruthy();
  });

  it('devrait récupérer tous les produits', async () => {
    const result = await service.getProduits();

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.getProduits).toHaveBeenCalled();
    expect(result).toEqual([produitMock]);
  });

  it('devrait récupérer un produit par id', async () => {
    const result = await service.getProduitById(1);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.getProduitById).toHaveBeenCalledWith(1);
    expect(result).toEqual(produitMock);
  });

  it('devrait récupérer les produits d’une catégorie', async () => {
    const result = await service.getProduitsByCategorie(1);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.getProduitsByCategorie).toHaveBeenCalledWith(1);
    expect(result).toEqual([produitMock]);
  });

  it('devrait créer un produit', async () => {
    const input: ProduitCreateInput = {
      intitule: 'Graines de basilic',
      prix_unitaire: 3.5,
      quantite: 10,
      categorie_id: 1,
      variete_id: 1,
    };

    const result = await service.createProduit(input);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.createProduit).toHaveBeenCalledWith(input);
    expect(result).toEqual(produitMock);
  });

  it('devrait modifier un produit', async () => {
    const input: ProduitUpdateInput = {
      id_produit: 1,
      intitule: 'Graines de basilic modifiées',
      prix_unitaire: 4,
      quantite: 20,
      categorie_id: 1,
      variete_id: 1,
    };

    const result = await service.updateProduit(input);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.updateProduit).toHaveBeenCalledWith(input);
    expect(result).toEqual(produitMock);
  });

  it('devrait supprimer un produit', async () => {
    const result = await service.deleteProduit(1);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.deleteProduit).toHaveBeenCalledWith(1);
    expect(result).toEqual(produitMock);
  });

    it('devrait filtrer les produits par recherche texte', () => {
    const result = service.filtrerProduits(
      [produitMock],
      'basilic',
      '',
      '',
      '',
      '',
      ''
    );

    expect(result).toEqual([produitMock]);
  });

  it('devrait filtrer les produits en stock', () => {
    const result = service.filtrerProduits(
      [produitMock],
      '',
      'en-stock',
      '',
      '',
      '',
      ''
    );

    expect(result).toEqual([produitMock]);
  });

  it('devrait filtrer les produits en rupture', () => {
    const produitRupture = {
      ...produitMock,
      quantite: 0,
    } as Produit;

    const result = service.filtrerProduits(
      [produitMock, produitRupture],
      '',
      'rupture',
      '',
      '',
      '',
      ''
    );

    expect(result).toEqual([produitRupture]);
  });

  it('devrait filtrer les produits par prix minimum', () => {
    const result = service.filtrerProduits(
      [produitMock],
      '',
      '',
      '3',
      '',
      '',
      ''
    );

    expect(result).toEqual([produitMock]);
  });

  it('devrait filtrer les produits par prix maximum', () => {
    const result = service.filtrerProduits(
      [produitMock],
      '',
      '',
      '',
      '4',
      '',
      ''
    );

    expect(result).toEqual([produitMock]);
  });

  it('devrait filtrer les produits par espèce', () => {
    const result = service.filtrerProduits(
      [produitMock],
      '',
      '',
      '',
      '',
      '',
      'Basilic'
    );

    expect(result).toEqual([produitMock]);
  });

  it('devrait retourner une liste vide si aucun produit ne correspond', () => {
    const result = service.filtrerProduits(
      [produitMock],
      'tomate',
      '',
      '',
      '',
      '',
      ''
    );

    expect(result).toEqual([]);
  });

  it('devrait retourner le statut en stock', () => {
    expect(service.getStatutProduit(produitMock)).toBe('En stock');
  });

  it('devrait retourner le statut rupture de stock', () => {
    expect(service.getStatutProduit({ ...produitMock, quantite: 0 } as Produit)).toBe('Rupture de stock');
  });

  it('devrait retourner le label bio oui', () => {
    expect(service.getLabelBio(produitMock)).toBe('Oui');
  });

  it('devrait retourner le label bio non', () => {
    const produitNonBio = {
      ...produitMock,
      variete: {
        ...produitMock.variete,
        bio: 0,
      },
    } as Produit;

    expect(service.getLabelBio(produitNonBio)).toBe('Non');
  });

  it('devrait retourner l’image du produit', () => {
    const produitAvecImage = {
      ...produitMock,
      image_produit: 'image.png',
    } as Produit;

    expect(service.getImageProduit(produitAvecImage)).toBe('image.png');
  });

  it('devrait retourner null si le produit n’a pas d’image', () => {
    expect(service.getImageProduit(produitMock)).toBeNull();
  });

  it('devrait construire un ProduitCreateInput', () => {
    const result = service.construireProduitCreateInput({
      intitule: ' Graines de basilic ',
      prix_unitaire: 3.5,
      quantite: 10,
      categorie_id: 1,
      variete_id: 1,
    });

    expect(result).toEqual({
      intitule: 'Graines de basilic',
      prix_unitaire: 3.5,
      quantite: 10,
      categorie_id: 1,
      variete_id: 1,
    });
  });

  it('devrait construire un ProduitUpdateInput', () => {
    const result = service.construireProduitUpdateInput(1, {
      intitule: ' Graines de basilic modifiées ',
      prix_unitaire: 4,
      quantite: 20,
      categorie_id: 1,
      variete_id: 1,
    });

    expect(result).toEqual({
      id_produit: 1,
      intitule: 'Graines de basilic modifiées',
      prix_unitaire: 4,
      quantite: 20,
      categorie_id: 1,
      variete_id: 1,
    });
  });

  it('devrait retourner le message d’erreur à la création', () => {
    expect(service.getMessageErreurCreation()).toBe(
      'Une erreur est survenue pendant la création du produit.'
    );
  });

  it('devrait retourner le message d’erreur à la modification', () => {
    expect(service.getMessageErreurModification()).toBe(
      'Une erreur est survenue pendant la modification du produit.'
    );
  });

  it('devrait retourner le message technique à la suppression', () => {
    expect(service.getMessageErreurSuppression()).toBe(
      'Une erreur est survenue pendant la suppression du produit.'
    );
  });
});