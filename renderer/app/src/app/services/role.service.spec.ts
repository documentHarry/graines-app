import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RoleService } from './role.service';
import { ElectronService } from './electron.service';
import { Role, RoleCreateInput, RoleUpdateInput } from '../types/electron';

describe('RoleService', () => {
  let service: RoleService;

  const apiMock = {
    getRoles: vi.fn(),
    createRole: vi.fn(),
    updateRole: vi.fn(),
    deleteRole: vi.fn(),
  };

  const electronServiceMock = {
    getApi: vi.fn(() => apiMock),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        RoleService,
        {
          provide: ElectronService,
          useValue: electronServiceMock,
        },
      ],
    });

    service = TestBed.inject(RoleService);
  });

  it('devrait récupérer les rôles', async () => {
    const roles: Role[] = [
      { id_role: 1, nom_role: 'Admin' },
      { id_role: 2, nom_role: 'Utilisateur' },
    ];

    apiMock.getRoles.mockResolvedValue(roles);

    await expect(service.getRoles()).resolves.toEqual(roles);
    expect(apiMock.getRoles).toHaveBeenCalledOnce();
  });

  it('devrait créer un rôle', async () => {
    const input: RoleCreateInput = { nom_role: 'Admin' };
    const role: Role = { id_role: 1, nom_role: 'Admin' };

    apiMock.createRole.mockResolvedValue(role);

    await expect(service.createRole(input)).resolves.toEqual(role);
    expect(apiMock.createRole).toHaveBeenCalledWith(input);
  });

  it('devrait modifier un rôle', async () => {
    const input: RoleUpdateInput = { id_role: 1, nom_role: 'Manager' };
    const role: Role = { id_role: 1, nom_role: 'Manager' };

    apiMock.updateRole.mockResolvedValue(role);

    await expect(service.updateRole(input)).resolves.toEqual(role);
    expect(apiMock.updateRole).toHaveBeenCalledWith(input);
  });

  it('devrait supprimer un rôle', async () => {
    const role: Role = { id_role: 1, nom_role: 'Admin' };

    apiMock.deleteRole.mockResolvedValue(role);

    await expect(service.deleteRole(1)).resolves.toEqual(role);
    expect(apiMock.deleteRole).toHaveBeenCalledWith(1);
  });

  it('devrait construire un RoleCreateInput en trimant le nom', () => {
    expect(service.construireRoleCreateInput({ nom_role: '  Admin  ' })).toEqual({
      nom_role: 'Admin',
    });
  });

  it('devrait construire un RoleCreateInput vide si le nom est null', () => {
    expect(service.construireRoleCreateInput({ nom_role: null })).toEqual({
      nom_role: '',
    });
  });

  it('devrait construire un RoleUpdateInput en trimant le nom', () => {
    expect(service.construireRoleUpdateInput(1, { nom_role: '  Manager  ' })).toEqual({
      id_role: 1,
      nom_role: 'Manager',
    });
  });

  it('devrait construire un RoleUpdateInput vide si le nom est null', () => {
    expect(service.construireRoleUpdateInput(1, { nom_role: null })).toEqual({
      id_role: 1,
      nom_role: '',
    });
  });

  it('devrait filtrer les rôles selon la recherche', () => {
    const roles: Role[] = [
      { id_role: 1, nom_role: 'Admin' },
      { id_role: 2, nom_role: 'Utilisateur' },
      { id_role: 3, nom_role: 'Manager' },
    ];

    expect(service.filtrerRoles(roles, 'admin')).toEqual([
      { id_role: 1, nom_role: 'Admin' },
    ]);
  });

  it('devrait filtrer sans tenir compte des espaces ni de la casse', () => {
    const roles: Role[] = [
      { id_role: 1, nom_role: 'Admin' },
      { id_role: 2, nom_role: 'Utilisateur' },
    ];

    expect(service.filtrerRoles(roles, '  ADMIN  ')).toEqual([
      { id_role: 1, nom_role: 'Admin' },
    ]);
  });

  it('devrait retourner tous les rôles si la recherche est vide', () => {
    const roles: Role[] = [
      { id_role: 1, nom_role: 'Admin' },
      { id_role: 2, nom_role: 'Utilisateur' },
    ];

    expect(service.filtrerRoles(roles, '   ')).toEqual(roles);
  });

  it('devrait retourner le message d’erreur de création', () => {
    expect(service.getMessageErreurCreationRole()).toBe(
      'Une erreur est survenue pendant la création du rôle.',
    );
  });

  it('devrait retourner le message d’erreur de modification', () => {
    expect(service.getMessageErreurModificationRole()).toBe(
      'Une erreur est survenue pendant la modification du rôle.',
    );
  });

  it('devrait retourner le message d’erreur de suppression', () => {
    expect(service.getMessageErreurSuppressionRole()).toBe(
      'Une erreur est survenue pendant la suppression du rôle.',
    );
  });
});