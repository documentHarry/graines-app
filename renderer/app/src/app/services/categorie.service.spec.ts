import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { CategorieService } from './categorie.service';
import { ElectronService } from './electron.service';
import { Categorie, CategorieCreateInput, CategorieUpdateInput } from '../types/electron';

describe('CategorieService', () => {
  let service: CategorieService;

  let apiMock: {
    getCategories: ReturnType<typeof vi.fn>;
    getCategorieById: ReturnType<typeof vi.fn>;
    createCategorie: ReturnType<typeof vi.fn>;
    updateCategorie: ReturnType<typeof vi.fn>;
    deleteCategorie: ReturnType<typeof vi.fn>;
    deleteCategorieWithReaffectation: ReturnType<typeof vi.fn>;
  };

  let electronServiceMock: {
    getApi: ReturnType<typeof vi.fn>;
  };

  const categorieMock: Categorie = {
    id_categorie: 1,
    nom_categorie: 'Aromates',
    descriptif: 'Plantes aromatiques',
    _count: {
      produit: 2,
    },
  } as Categorie;

  const categoriesMock: Categorie[] = [
    {
      id_categorie: 1,
      nom_categorie: 'Aromates',
      descriptif: 'Plantes aromatiques',
      _count: {
        produit: 2,
      },
    } as Categorie,
    {
      id_categorie: 2,
      nom_categorie: 'Légumes',
      descriptif: 'Graines potagères',
      _count: {
        produit: 0,
      },
    } as Categorie,
    {
      id_categorie: 3,
      nom_categorie: 'Fleurs',
      descriptif: null,
      _count: {
        produit: 4,
      },
    } as Categorie,
  ];

  beforeEach(() => {
    apiMock = {
      getCategories: vi.fn().mockResolvedValue([categorieMock]),
      getCategorieById: vi.fn().mockResolvedValue(categorieMock),
      createCategorie: vi.fn().mockResolvedValue(categorieMock),
      updateCategorie: vi.fn().mockResolvedValue(categorieMock),
      deleteCategorie: vi.fn().mockResolvedValue(categorieMock),
      deleteCategorieWithReaffectation: vi.fn().mockResolvedValue(categorieMock),
    };

    electronServiceMock = {
      getApi: vi.fn().mockReturnValue(apiMock),
    };

    TestBed.configureTestingModule({
      providers: [
        CategorieService,
        { provide: ElectronService, useValue: electronServiceMock },
      ],
    });

    service = TestBed.inject(CategorieService);
  });

  it('devrait créer le service', () => {
    expect(service).toBeTruthy();
  });

  it('devrait récupérer toutes les catégories', async () => {
    const result = await service.getCategories();

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.getCategories).toHaveBeenCalled();
    expect(result).toEqual([categorieMock]);
  });

  it('devrait récupérer une catégorie par id', async () => {
    const result = await service.getCategorieById(1);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.getCategorieById).toHaveBeenCalledWith(1);
    expect(result).toEqual(categorieMock);
  });

  it('devrait créer une catégorie', async () => {
    const input: CategorieCreateInput = {
      nom_categorie: 'Aromates',
      descriptif: 'Plantes aromatiques',
    };

    const result = await service.createCategorie(input);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.createCategorie).toHaveBeenCalledWith(input);
    expect(result).toEqual(categorieMock);
  });

  it('devrait modifier une catégorie', async () => {
    const input: CategorieUpdateInput = {
      id_categorie: 1,
      nom_categorie: 'Aromates modifiés',
      descriptif: 'Description modifiée',
    };

    const result = await service.updateCategorie(input);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.updateCategorie).toHaveBeenCalledWith(input);
    expect(result).toEqual(categorieMock);
  });

  it('devrait supprimer une catégorie', async () => {
    const result = await service.deleteCategorie(1);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.deleteCategorie).toHaveBeenCalledWith(1);
    expect(result).toEqual(categorieMock);
  });

  it('devrait supprimer une catégorie avec réaffectation', async () => {
    const result = await service.deleteCategorieWithReaffectation(1, 2);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.deleteCategorieWithReaffectation).toHaveBeenCalledWith(1, 2);
    expect(result).toEqual(categorieMock);
  });

  it('devrait construire un CategorieCreateInput en nettoyant les espaces', () => {
    const result = service.construireCategorieCreateInput({
      nom_categorie: ' Aromates ',
      descriptif: ' Plantes aromatiques ',
    });

    expect(result).toEqual({
      nom_categorie: 'Aromates',
      descriptif: 'Plantes aromatiques',
    });
  });

  it('devrait construire un CategorieCreateInput avec descriptif null si le champ est vide', () => {
    const result = service.construireCategorieCreateInput({
      nom_categorie: ' Aromates ',
      descriptif: '   ',
    });

    expect(result).toEqual({
      nom_categorie: 'Aromates',
      descriptif: null,
    });
  });

  it('devrait construire un CategorieUpdateInput en nettoyant les espaces', () => {
    const result = service.construireCategorieUpdateInput(1, {
      nom_categorie: ' Aromates modifiés ',
      descriptif: ' Description modifiée ',
    });

    expect(result).toEqual({
      id_categorie: 1,
      nom_categorie: 'Aromates modifiés',
      descriptif: 'Description modifiée',
    });
  });

  it('devrait construire un CategorieUpdateInput avec descriptif null si le champ est vide', () => {
    const result = service.construireCategorieUpdateInput(1, {
      nom_categorie: ' Aromates ',
      descriptif: '',
    });

    expect(result).toEqual({
      id_categorie: 1,
      nom_categorie: 'Aromates',
      descriptif: null,
    });
  });

  it('devrait filtrer les catégories par nom', () => {
    const result = service.filtrerCategories(categoriesMock, 'aro', '');

    expect(result).toEqual([categoriesMock[0]]);
  });

  it('devrait filtrer les catégories par descriptif', () => {
    const result = service.filtrerCategories(categoriesMock, '', 'potag');

    expect(result).toEqual([categoriesMock[1]]);
  });

  it('devrait filtrer les catégories par nom et descriptif', () => {
    const result = service.filtrerCategories(categoriesMock, 'aro', 'plantes');

    expect(result).toEqual([categoriesMock[0]]);
  });

  it('devrait retourner toutes les catégories si les recherches sont vides', () => {
    const result = service.filtrerCategories(categoriesMock, '', '');

    expect(result).toEqual(categoriesMock);
  });

  it('devrait retourner une liste vide si aucune catégorie ne correspond', () => {
    const result = service.filtrerCategories(categoriesMock, 'introuvable', '');

    expect(result).toEqual([]);
  });

  it('devrait retourner le nombre de produits d’une catégorie', () => {
    expect(service.getNombreProduits(categoriesMock[0])).toBe(2);
  });

  it('devrait retourner 0 si la catégorie est null', () => {
    expect(service.getNombreProduits(null)).toBe(0);
  });

  it('devrait retourner 0 si le compteur de produits est absent', () => {
    const categorieSansCompteur = {
      id_categorie: 4,
      nom_categorie: 'Sans compteur',
      descriptif: null,
    } as Categorie;

    expect(service.getNombreProduits(categorieSansCompteur)).toBe(0);
  });

  it('devrait exclure une catégorie de la liste', () => {
    const result = service.exclureCategorie(categoriesMock, categoriesMock[0]);

    expect(result).toEqual([categoriesMock[1], categoriesMock[2]]);
  });

  it('devrait retourner le message d’erreur à la création', () => {
    const result = service.getMessageErreurCreation();

    expect(result).toBe('Une erreur est survenue pendant la création de la catégorie.');
  });

  it('devrait retourner le message d’erreur à la modification', () => {
    const result = service.getMessageErreurModification();

    expect(result).toBe('Une erreur est survenue pendant la modification de la catégorie.');
  });

  it('devrait retourner le message si la catégorie contient des produits à la suppression', () => {
    const result = service.getMessageErreurSuppression(new Error('CATEGORY_HAS_PRODUCTS'));

    expect(result).toBe('Cette catégorie contient des produits. Veuillez choisir une catégorie de réaffectation.');
  });

  it('devrait retourner le message technique à la suppression', () => {
    const result = service.getMessageErreurSuppression(new Error('Erreur technique'));

    expect(result).toBe('Une erreur est survenue pendant la suppression de la catégorie.');
  });

  it('devrait retourner le message si la catégorie de destination est identique', () => {
    const result = service.getMessageErreurReaffectation(new Error('SAME_CATEGORY'));

    expect(result).toBe('La catégorie de destination doit être différente.');
  });

  it('devrait retourner le message si la catégorie de destination est introuvable', () => {
    const result = service.getMessageErreurReaffectation(new Error('DESTINATION_CATEGORY_NOT_FOUND'));

    expect(result).toBe('La catégorie de destination est introuvable.');
  });

  it('devrait retourner le message technique pendant la réaffectation', () => {
    const result = service.getMessageErreurReaffectation(new Error('Erreur technique'));

    expect(result).toBe('Une erreur est survenue pendant la réaffectation.');
  });
});