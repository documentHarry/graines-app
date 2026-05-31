import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { RoleService } from './role.service';
import { ElectronService } from './electron.service';
import { Role, Utilisateur, UtilisateurRole, UtilisateurRoleUpdateInput } from '../types/electron';

describe('RoleService', () => {
  let service: RoleService;

  let apiMock: {
    getRoles: ReturnType<typeof vi.fn>;
    getUtilisateurRoles: ReturnType<typeof vi.fn>;
    updateUtilisateurRoles: ReturnType<typeof vi.fn>;
  };

  let electronServiceMock: {
    getApi: ReturnType<typeof vi.fn>;
  };

  const rolesMock: Role[] = [
    {
      id_role: 1,
      nom_role: 'ADMIN',
    },
    {
      id_role: 2,
      nom_role: 'CLIENT',
    },
  ];

  const utilisateurRolesMock: UtilisateurRole[] = [
    {
      utilisateur_id: 1,
      role_id: 2,
      role: {
        id_role: 2,
        nom_role: 'CLIENT',
      },
    } as UtilisateurRole,
  ];

  const utilisateurMock: Utilisateur = {
    id_utilisateur: 1,
    nom: 'Dupont',
    prenom: 'Marie',
    email: 'marie@example.com',
    mot_de_passe: 'secret',
    date_inscription: '2026-05-31 10:00:00',
    actif: 1,
    adresse_livraison: [],
    utilisateur_role: utilisateurRolesMock,
  } as Utilisateur;

  beforeEach(() => {
    apiMock = {
      getRoles: vi.fn().mockResolvedValue(rolesMock),
      getUtilisateurRoles: vi.fn().mockResolvedValue(utilisateurRolesMock),
      updateUtilisateurRoles: vi.fn().mockResolvedValue(utilisateurMock),
    };

    electronServiceMock = {
      getApi: vi.fn().mockReturnValue(apiMock),
    };

    TestBed.configureTestingModule({
      providers: [
        RoleService,
        { provide: ElectronService, useValue: electronServiceMock },
      ],
    });

    service = TestBed.inject(RoleService);
  });

  it('devrait créer le service', () => {
    expect(service).toBeTruthy();
  });

  it('devrait récupérer tous les rôles', async () => {
    const result = await service.getRoles();

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.getRoles).toHaveBeenCalled();
    expect(result).toEqual(rolesMock);
  });

  it('devrait récupérer les rôles d’un utilisateur', async () => {
    const result = await service.getUtilisateurRoles(1);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.getUtilisateurRoles).toHaveBeenCalledWith(1);
    expect(result).toEqual(utilisateurRolesMock);
  });

  it('devrait modifier les rôles d’un utilisateur', async () => {
    const input: UtilisateurRoleUpdateInput = {
      utilisateur_id: 1,
      roles_ids: [1, 2],
    };

    const result = await service.updateUtilisateurRoles(input);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.updateUtilisateurRoles).toHaveBeenCalledWith(input);
    expect(result).toEqual(utilisateurMock);
  });
});