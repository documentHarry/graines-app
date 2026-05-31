import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { EspeceService } from './espece.service';
import { ElectronService } from './electron.service';
import { Espece, EspeceCreateInput, EspeceUpdateInput } from '../types/electron';

describe('EspeceService', () => {
  let service: EspeceService;

  let apiMock: {
    getEspeces: ReturnType<typeof vi.fn>;
    getEspeceById: ReturnType<typeof vi.fn>;
    createEspece: ReturnType<typeof vi.fn>;
    updateEspece: ReturnType<typeof vi.fn>;
    deleteEspece: ReturnType<typeof vi.fn>;
  };

  let electronServiceMock: {
    getApi: ReturnType<typeof vi.fn>;
  };

  const especeMock: Espece = {
    id_espece: 1,
    nom_commun: 'Basilic',
    nom_scientifique: 'Ocimum basilicum',
    _count: {
      variete: 2,
    },
  } as Espece;

  beforeEach(() => {
    apiMock = {
      getEspeces: vi.fn().mockResolvedValue([especeMock]),
      getEspeceById: vi.fn().mockResolvedValue(especeMock),
      createEspece: vi.fn().mockResolvedValue(especeMock),
      updateEspece: vi.fn().mockResolvedValue(especeMock),
      deleteEspece: vi.fn().mockResolvedValue(especeMock),
    };

    electronServiceMock = {
      getApi: vi.fn().mockReturnValue(apiMock),
    };

    TestBed.configureTestingModule({
      providers: [
        EspeceService,
        { provide: ElectronService, useValue: electronServiceMock },
      ],
    });

    service = TestBed.inject(EspeceService);
  });

  it('devrait créer le service', () => {
    expect(service).toBeTruthy();
  });

  it('devrait récupérer toutes les espèces', async () => {
    const result = await service.getEspeces();

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.getEspeces).toHaveBeenCalled();
    expect(result).toEqual([especeMock]);
  });

  it('devrait récupérer une espèce par id', async () => {
    const result = await service.getEspeceById(1);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.getEspeceById).toHaveBeenCalledWith(1);
    expect(result).toEqual(especeMock);
  });

  it('devrait créer une espèce', async () => {
    const input: EspeceCreateInput = {
      nom_commun: 'Basilic',
      nom_scientifique: 'Ocimum basilicum',
    };

    const result = await service.createEspece(input);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.createEspece).toHaveBeenCalledWith(input);
    expect(result).toEqual(especeMock);
  });

  it('devrait modifier une espèce', async () => {
    const input: EspeceUpdateInput = {
      id_espece: 1,
      nom_commun: 'Basilic modifié',
      nom_scientifique: 'Ocimum basilicum modifié',
    };

    const result = await service.updateEspece(input);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.updateEspece).toHaveBeenCalledWith(input);
    expect(result).toEqual(especeMock);
  });

  it('devrait supprimer une espèce', async () => {
    const result = await service.deleteEspece(1);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.deleteEspece).toHaveBeenCalledWith(1);
    expect(result).toEqual(especeMock);
  });
});