import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { AvisService } from './avis.service';
import { ElectronService } from './electron.service';
import { Avis, AvisCreateInput, AvisUpdateInput } from '../types/electron';

describe('AvisService', () => {
  let service: AvisService;

  let apiMock: {
    getAvis: ReturnType<typeof vi.fn>;
    getAvisById: ReturnType<typeof vi.fn>;
    getAvisByProduit: ReturnType<typeof vi.fn>;
    createAvis: ReturnType<typeof vi.fn>;
    updateAvis: ReturnType<typeof vi.fn>;
    deleteAvis: ReturnType<typeof vi.fn>;
    likeAvis: ReturnType<typeof vi.fn>;
  };

  let electronServiceMock: {
    getApi: ReturnType<typeof vi.fn>;
  };

  const avisMock = {
    id_avis: 1,
    note: 8,
    titre: 'Très bon produit',
    commentaire: 'Bonne germination',
    date_depot: '2026-05-31 10:00:00',
    statut: 'nouveau',
    nombre_jaime: 2,
    utilisateur_id: 1,
    produit_id: 10,
    utilisateur: {
      id_utilisateur: 1,
      prenom: 'Marie',
      nom: 'Dupont',
      email: 'marie@example.com',
    },
    produit: {
      id_produit: 10,
      intitule: 'Graines de basilic',
    },
  } as Avis;

  beforeEach(() => {
    apiMock = {
      getAvis: vi.fn().mockResolvedValue([avisMock]),
      getAvisById: vi.fn().mockResolvedValue(avisMock),
      getAvisByProduit: vi.fn().mockResolvedValue([avisMock]),
      createAvis: vi.fn().mockResolvedValue(avisMock),
      updateAvis: vi.fn().mockResolvedValue(avisMock),
      deleteAvis: vi.fn().mockResolvedValue(avisMock),
      likeAvis: vi.fn().mockResolvedValue(avisMock),
    };

    electronServiceMock = {
      getApi: vi.fn().mockReturnValue(apiMock),
    };

    TestBed.configureTestingModule({
      providers: [
        AvisService,
        { provide: ElectronService, useValue: electronServiceMock },
      ],
    });

    service = TestBed.inject(AvisService);
  });

  it('devrait créer le service', () => {
    expect(service).toBeTruthy();
  });

  it('devrait récupérer tous les avis', async () => {
    const result = await service.getAvis();

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.getAvis).toHaveBeenCalled();
    expect(result).toEqual([avisMock]);
  });

  it('devrait récupérer un avis par id', async () => {
    const result = await service.getAvisById(1);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.getAvisById).toHaveBeenCalledWith(1);
    expect(result).toEqual(avisMock);
  });

  it('devrait récupérer les avis d’un produit', async () => {
    const result = await service.getAvisByProduit(10);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.getAvisByProduit).toHaveBeenCalledWith(10);
    expect(result).toEqual([avisMock]);
  });

  it('devrait créer un avis', async () => {
    const input: AvisCreateInput = {
      note: 8,
      titre: 'Très bon produit',
      commentaire: 'Bonne germination',
      utilisateur_id: 1,
      produit_id: 10,
    };

    const result = await service.createAvis(input);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.createAvis).toHaveBeenCalledWith(input);
    expect(result).toEqual(avisMock);
  });

  it('devrait modifier un avis', async () => {
    const input: AvisUpdateInput = {
      id_avis: 1,
      note: 9,
      titre: 'Excellent produit',
      commentaire: 'Très satisfait',
    };

    const result = await service.updateAvis(input);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.updateAvis).toHaveBeenCalledWith(input);
    expect(result).toEqual(avisMock);
  });

  it('devrait supprimer un avis', async () => {
    const result = await service.deleteAvis(1);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.deleteAvis).toHaveBeenCalledWith(1);
    expect(result).toEqual(avisMock);
  });

  it('devrait aimer un avis', async () => {
    const result = await service.likeAvis(1);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.likeAvis).toHaveBeenCalledWith(1);
    expect(result).toEqual(avisMock);
  });
});