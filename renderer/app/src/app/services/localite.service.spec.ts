import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { LocaliteService } from './localite.service';
import { ElectronService } from './electron.service';
import { Localite, LocaliteCreateInput, LocaliteUpdateInput } from '../types/electron';

describe('LocaliteService', () => {
  let service: LocaliteService;

  let apiMock: {
    getLocalites: ReturnType<typeof vi.fn>;
    createLocalite: ReturnType<typeof vi.fn>;
    updateLocalite: ReturnType<typeof vi.fn>;
    deleteLocalite: ReturnType<typeof vi.fn>;
  };

  let electronServiceMock: {
    getApi: ReturnType<typeof vi.fn>;
  };

  const localiteMock: Localite = {
    id_localite: 1,
    code_postal: '5000',
    localite: 'Namur',
  };

  beforeEach(() => {
    apiMock = {
      getLocalites: vi.fn().mockResolvedValue([localiteMock]),
      createLocalite: vi.fn().mockResolvedValue(localiteMock),
      updateLocalite: vi.fn().mockResolvedValue(localiteMock),
      deleteLocalite: vi.fn().mockResolvedValue(localiteMock),
    };

    electronServiceMock = {
      getApi: vi.fn().mockReturnValue(apiMock),
    };

    TestBed.configureTestingModule({
      providers: [
        LocaliteService,
        { provide: ElectronService, useValue: electronServiceMock },
      ],
    });

    service = TestBed.inject(LocaliteService);
  });

  it('devrait créer le service', () => {
    expect(service).toBeTruthy();
  });

  it('devrait récupérer toutes les localités', async () => {
    const result = await service.getLocalites();

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.getLocalites).toHaveBeenCalled();
    expect(result).toEqual([localiteMock]);
  });

  it('devrait créer une localité', async () => {
    const input: LocaliteCreateInput = {
      code_postal: '5000',
      localite: 'Namur',
    };

    const result = await service.createLocalite(input);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.createLocalite).toHaveBeenCalledWith(input);
    expect(result).toEqual(localiteMock);
  });

  it('devrait modifier une localité', async () => {
    const input: LocaliteUpdateInput = {
      id_localite: 1,
      code_postal: '5000',
      localite: 'Namur modifié',
    };

    const result = await service.updateLocalite(input);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.updateLocalite).toHaveBeenCalledWith(input);
    expect(result).toEqual(localiteMock);
  });

  it('devrait supprimer une localité', async () => {
    const result = await service.deleteLocalite(1);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.deleteLocalite).toHaveBeenCalledWith(1);
    expect(result).toEqual(localiteMock);
  });
});