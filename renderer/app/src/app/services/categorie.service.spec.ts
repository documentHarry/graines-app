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
});