import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { AdresseLivraisonService } from './adresse-livraison.service';
import { ElectronService } from './electron.service';
import { AdresseLivraison, AdresseLivraisonCreateInput, AdresseLivraisonUpdateInput } from '../types/electron';

describe('AdresseLivraisonService', () => {
  let service: AdresseLivraisonService;

  let apiMock: {
    createAdresseLivraison: ReturnType<typeof vi.fn>;
    updateAdresseLivraison: ReturnType<typeof vi.fn>;
    deleteAdresseLivraison: ReturnType<typeof vi.fn>;
  };

  let electronServiceMock: {
    getApi: ReturnType<typeof vi.fn>;
  };

  const adresseMock: AdresseLivraison = {
    id_adresse: 1,
    rue: 'Rue des Fleurs',
    numero: '12',
    par_defaut: 1,
    utilisateur_id: 1,
    localite_id: 1,
    localite: {
      id_localite: 1,
      code_postal: '5000',
      localite: 'Namur',
    },
  };

  beforeEach(() => {
    apiMock = {
      createAdresseLivraison: vi.fn().mockResolvedValue(adresseMock),
      updateAdresseLivraison: vi.fn().mockResolvedValue(adresseMock),
      deleteAdresseLivraison: vi.fn().mockResolvedValue(adresseMock),
    };

    electronServiceMock = {
      getApi: vi.fn().mockReturnValue(apiMock),
    };

    TestBed.configureTestingModule({
      providers: [
        AdresseLivraisonService,
        { provide: ElectronService, useValue: electronServiceMock },
      ],
    });

    service = TestBed.inject(AdresseLivraisonService);
  });

  it('devrait créer le service', () => {
    expect(service).toBeTruthy();
  });

  it('devrait créer une adresse de livraison', async () => {
    const input: AdresseLivraisonCreateInput = {
      rue: 'Rue des Fleurs',
      numero: '12',
      par_defaut: 1,
      utilisateur_id: 1,
      localite_id: 1,
    };

    const result = await service.createAdresseLivraison(input);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.createAdresseLivraison).toHaveBeenCalledWith(input);
    expect(result).toEqual(adresseMock);
  });

  it('devrait modifier une adresse de livraison', async () => {
    const input: AdresseLivraisonUpdateInput = {
      id_adresse: 1,
      rue: 'Rue modifiée',
      numero: '99',
      par_defaut: 0,
      localite_id: 1,
    };

    const result = await service.updateAdresseLivraison(input);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.updateAdresseLivraison).toHaveBeenCalledWith(input);
    expect(result).toEqual(adresseMock);
  });

  it('devrait supprimer une adresse de livraison', async () => {
    const result = await service.deleteAdresseLivraison(1);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.deleteAdresseLivraison).toHaveBeenCalledWith(1);
    expect(result).toEqual(adresseMock);
  });
});