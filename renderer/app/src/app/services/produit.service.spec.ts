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
    getProduitsSimilaires: ReturnType<typeof vi.fn>;
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
      getProduitsSimilaires: vi.fn().mockResolvedValue([produitMock]),
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

  it('devrait récupérer les produits similaires', async () => {
    const result = await service.getProduitsSimilaires(1);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.getProduitsSimilaires).toHaveBeenCalledWith(1);
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
});