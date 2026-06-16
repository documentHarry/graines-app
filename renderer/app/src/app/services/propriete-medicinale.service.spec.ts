import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { ProprieteMedicinaleService } from './propriete-medicinale.service';
import { ElectronService } from './electron.service';
import { ProprieteMedicinale, ProprieteMedicinaleCreateInput, ProprieteMedicinaleUpdateInput } from '../types/electron';

describe('ProprieteMedicinaleService', () => {
  let service: ProprieteMedicinaleService;

  let apiMock: {
    getProprietesMedicinales: ReturnType<typeof vi.fn>;
    createProprieteMedicinale: ReturnType<typeof vi.fn>;
    updateProprieteMedicinale: ReturnType<typeof vi.fn>;
    deleteProprieteMedicinale: ReturnType<typeof vi.fn>;
  };

  let electronServiceMock: {
    getApi: ReturnType<typeof vi.fn>;
  };

  const proprieteMock: ProprieteMedicinale = {
    id_propriete: 1,
    nom_propriete: 'Digestive',
  };

  const proprietesMock: ProprieteMedicinale[] = [
    { id_propriete: 1, nom_propriete: 'Digestive' },
    { id_propriete: 2, nom_propriete: 'Antioxydante' },
  ];

  beforeEach(() => {
    apiMock = {
      getProprietesMedicinales: vi.fn().mockResolvedValue([proprieteMock]),
      createProprieteMedicinale: vi.fn().mockResolvedValue(proprieteMock),
      updateProprieteMedicinale: vi.fn().mockResolvedValue(proprieteMock),
      deleteProprieteMedicinale: vi.fn().mockResolvedValue(proprieteMock),
    };

    electronServiceMock = {
      getApi: vi.fn().mockReturnValue(apiMock),
    };

    TestBed.configureTestingModule({
      providers: [
        ProprieteMedicinaleService,
        { provide: ElectronService, useValue: electronServiceMock },
      ],
    });

    service = TestBed.inject(ProprieteMedicinaleService);
  });

  it('devrait créer le service', () => {
    expect(service).toBeTruthy();
  });

  it('devrait récupérer toutes les propriétés médicinales', async () => {
    const result = await service.getProprietesMedicinales();

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.getProprietesMedicinales).toHaveBeenCalled();
    expect(result).toEqual([proprieteMock]);
  });

  it('devrait créer une propriété médicinale', async () => {
    const input: ProprieteMedicinaleCreateInput = {
      nom_propriete: 'Digestive',
    };

    const result = await service.createProprieteMedicinale(input);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.createProprieteMedicinale).toHaveBeenCalledWith(input);
    expect(result).toEqual(proprieteMock);
  });

  it('devrait modifier une propriété médicinale', async () => {
    const input: ProprieteMedicinaleUpdateInput = {
      id_propriete: 1,
      nom_propriete: 'Digestive modifiée',
    };

    const result = await service.updateProprieteMedicinale(input);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.updateProprieteMedicinale).toHaveBeenCalledWith(input);
    expect(result).toEqual(proprieteMock);
  });

  it('devrait supprimer une propriété médicinale', async () => {
    const result = await service.deleteProprieteMedicinale(1);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.deleteProprieteMedicinale).toHaveBeenCalledWith(1);
    expect(result).toEqual(proprieteMock);
  });

  it('devrait construire un input de création', () => {
    expect(service.construireProprieteMedicinaleCreateInput({
      nom_propriete: ' Digestive ',
    })).toEqual({
      nom_propriete: 'Digestive',
    });
  });

  it('devrait construire un input de modification', () => {
    expect(service.construireProprieteMedicinaleUpdateInput(1, {
      nom_propriete: ' Digestive modifiée ',
    })).toEqual({
      id_propriete: 1,
      nom_propriete: 'Digestive modifiée',
    });
  });

  it('devrait filtrer les propriétés médicinales', () => {
    expect(service.filtrerProprietesMedicinales(proprietesMock, 'anti')).toEqual([
      proprietesMock[1],
    ]);
  });

  it('devrait retourner toutes les propriétés si la recherche est vide', () => {
    expect(service.filtrerProprietesMedicinales(proprietesMock, '')).toEqual(proprietesMock);
  });

  it('devrait nettoyer le nom de la propriété', () => {
    expect(service.getNomProprieteNettoye({
      nom_propriete: ' Digestive ',
    })).toBe('Digestive');
  });

  it('devrait retourner le message d’erreur d’enregistrement', () => {
    expect(service.getMessageErreurEnregistrement()).toBe(
      'Erreur pendant l’enregistrement de la propriété médicinale.'
    );
  });

  it('devrait retourner le message d’erreur de suppression', () => {
    expect(service.getMessageErreurSuppression()).toBe(
      'Erreur pendant la suppression de la propriété médicinale.'
    );
  });
});