import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { UtilisateurService } from './utilisateur.service';
import { ElectronService } from './electron.service';
import { Utilisateur, UtilisateurCreateInput, UtilisateurUpdateInput } from '../types/electron';

describe('UtilisateurService', () => {
  let service: UtilisateurService;

  let apiMock: {
    getUtilisateurs: ReturnType<typeof vi.fn>;
    getUtilisateurById: ReturnType<typeof vi.fn>;
    createUtilisateur: ReturnType<typeof vi.fn>;
    updateUtilisateur: ReturnType<typeof vi.fn>;
    deleteUtilisateur: ReturnType<typeof vi.fn>;
  };

  let electronServiceMock: {
    getApi: ReturnType<typeof vi.fn>;
  };

  const utilisateurMock: Utilisateur = {
    id_utilisateur: 1,
    nom: 'Dupont',
    prenom: 'Marie',
    email: 'marie@example.com',
    mot_de_passe: 'secret',
    date_inscription: '2026-05-31 10:00:00',
    actif: 1,
    adresse_livraison: [],
    utilisateur_role: [],
  } as Utilisateur;

  beforeEach(() => {
    apiMock = {
      getUtilisateurs: vi.fn().mockResolvedValue([utilisateurMock]),
      getUtilisateurById: vi.fn().mockResolvedValue(utilisateurMock),
      createUtilisateur: vi.fn().mockResolvedValue(utilisateurMock),
      updateUtilisateur: vi.fn().mockResolvedValue(utilisateurMock),
      deleteUtilisateur: vi.fn().mockResolvedValue(utilisateurMock),
    };

    electronServiceMock = {
      getApi: vi.fn().mockReturnValue(apiMock),
    };

    TestBed.configureTestingModule({
      providers: [
        UtilisateurService,
        { provide: ElectronService, useValue: electronServiceMock },
      ],
    });

    service = TestBed.inject(UtilisateurService);
  });

  it('devrait créer le service', () => {
    expect(service).toBeTruthy();
  });

  it('devrait récupérer tous les utilisateurs', async () => {
    const result = await service.getUtilisateurs();

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.getUtilisateurs).toHaveBeenCalled();
    expect(result).toEqual([utilisateurMock]);
  });

  it('devrait récupérer un utilisateur par id', async () => {
    const result = await service.getUtilisateurById(1);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.getUtilisateurById).toHaveBeenCalledWith(1);
    expect(result).toEqual(utilisateurMock);
  });

  it('devrait créer un utilisateur', async () => {
    const input: UtilisateurCreateInput = {
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie@example.com',
      mot_de_passe: 'secret',
    };

    const result = await service.createUtilisateur(input);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.createUtilisateur).toHaveBeenCalledWith(input);
    expect(result).toEqual(utilisateurMock);
  });

  it('devrait modifier un utilisateur', async () => {
    const input: UtilisateurUpdateInput = {
      id_utilisateur: 1,
      nom: 'Dupont modifié',
      prenom: 'Marie',
      email: 'marie@example.com',
    };

    const result = await service.updateUtilisateur(input);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.updateUtilisateur).toHaveBeenCalledWith(input);
    expect(result).toEqual(utilisateurMock);
  });

  it('devrait supprimer un utilisateur', async () => {
    const result = await service.deleteUtilisateur(1);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.deleteUtilisateur).toHaveBeenCalledWith(1);
    expect(result).toEqual(utilisateurMock);
  });
});