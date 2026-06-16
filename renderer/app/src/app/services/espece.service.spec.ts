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
  it('devrait filtrer les espèces par nom commun', () => {
    const especes: Espece[] = [
      {
        id_espece: 1,
        nom_commun: 'Basilic',
        nom_scientifique: 'Ocimum basilicum',
      } as Espece,
      {
        id_espece: 2,
        nom_commun: 'Tomate',
        nom_scientifique: 'Solanum lycopersicum',
      } as Espece,
    ];

    const result = service.filtrerEspeces(especes, 'basi', '');

    expect(result).toEqual([especes[0]]);
  });

  it('devrait filtrer les espèces par nom scientifique', () => {
    const especes: Espece[] = [
      {
        id_espece: 1,
        nom_commun: 'Basilic',
        nom_scientifique: 'Ocimum basilicum',
      } as Espece,
      {
        id_espece: 2,
        nom_commun: 'Tomate',
        nom_scientifique: 'Solanum lycopersicum',
      } as Espece,
    ];

    const result = service.filtrerEspeces(especes, '', 'solanum');

    expect(result).toEqual([especes[1]]);
  });

  it('devrait retourner toutes les espèces si les recherches sont vides', () => {
    const especes: Espece[] = [
      {
        id_espece: 1,
        nom_commun: 'Basilic',
        nom_scientifique: 'Ocimum basilicum',
      } as Espece,
      {
        id_espece: 2,
        nom_commun: 'Tomate',
        nom_scientifique: 'Solanum lycopersicum',
      } as Espece,
    ];

    const result = service.filtrerEspeces(especes, '', '');

    expect(result).toEqual(especes);
  });

  it('devrait retourner le nombre de variétés', () => {
    expect(service.getNombreVarietes(especeMock)).toBe(2);
  });

  it('devrait retourner 0 si l’espèce est null', () => {
    expect(service.getNombreVarietes(null)).toBe(0);
  });

  it('devrait construire un EspeceCreateInput', () => {
    const result = service.construireEspeceCreateInput({
      nom_commun: ' Basilic ',
      nom_scientifique: ' Ocimum basilicum ',
    });

    expect(result).toEqual({
      nom_commun: 'Basilic',
      nom_scientifique: 'Ocimum basilicum',
    });
  });

  it('devrait construire un EspeceUpdateInput', () => {
    const result = service.construireEspeceUpdateInput(1, {
      nom_commun: ' Basilic modifié ',
      nom_scientifique: ' Ocimum basilicum modifié ',
    });

    expect(result).toEqual({
      id_espece: 1,
      nom_commun: 'Basilic modifié',
      nom_scientifique: 'Ocimum basilicum modifié',
    });
  });

  it('devrait retourner le message d’erreur à la création', () => {
    expect(service.getMessageErreurCreation()).toBe(
      'Une erreur est survenue pendant la création de l’espèce.'
    );
  });

  it('devrait retourner le message d’erreur à la modification', () => {
    expect(service.getMessageErreurModification()).toBe(
      'Une erreur est survenue pendant la modification de l’espèce.'
    );
  });

  it('devrait retourner le message si l’espèce possède des variétés', () => {
    expect(service.getMessageErreurSuppression('ESPECE_HAS_VARIETES')).toBe(
      'Cette espèce possède des variétés associées. Elle ne peut pas être supprimée.'
    );
  });

  it('devrait retourner le message technique à la suppression', () => {
    expect(service.getMessageErreurSuppression(new Error('Erreur technique'))).toBe(
      'Une erreur est survenue pendant la suppression de l’espèce.'
    );
  });

});