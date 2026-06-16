import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UtilisateurRolesComponent } from './utilisateur-roles.component';
import { UtilisateurService } from '../../../services/utilisateur.service';
import { RoleService } from '../../../services/role.service';
import { UtilisateurRoleService } from '../../../services/utilisateur-role.service';
import { Role, Utilisateur, UtilisateurRole } from '../../../types/electron';

describe('UtilisateurRolesComponent', () => {
  let component: UtilisateurRolesComponent;
  let fixture: ComponentFixture<UtilisateurRolesComponent>;

  const utilisateurMock: Utilisateur = {
    id_utilisateur: 1,
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@test.fr',
    date_inscription: '2024-01-01',
    actif: 1,
    adresse_livraison: [],
  };

  const rolesMock: Role[] = [
    { id_role: 1, nom_role: 'Admin' },
    { id_role: 2, nom_role: 'Client' },
  ];

  const utilisateurRolesMock = [
    { utilisateur_id: 1, role_id: 1 },
  ] as UtilisateurRole[];

  const utilisateurServiceMock = {
    getUtilisateurById: vi.fn(),
  };

  const roleServiceMock = {
    getRoles: vi.fn(),
  };

  const utilisateurRoleServiceMock = {
    getUtilisateurRoles: vi.fn(),
    getRoleIdsDepuisUtilisateurRoles: vi.fn(),
    getNomComplet: vi.fn(),
    isRoleCoche: vi.fn(),
    ajouterRoleId: vi.fn(),
    retirerRoleId: vi.fn(),
    construireUtilisateurRoleUpdateInput: vi.fn(),
    updateUtilisateurRoles: vi.fn(),
    getMessageErreurAucunRole: vi.fn(),
    getMessageErreurModification: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [UtilisateurRolesComponent],
      providers: [
        { provide: UtilisateurService, useValue: utilisateurServiceMock },
        { provide: RoleService, useValue: roleServiceMock },
        { provide: UtilisateurRoleService, useValue: utilisateurRoleServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UtilisateurRolesComponent);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger l’utilisateur, les rôles et les rôles cochés', async () => {
    fixture.componentRef.setInput('id', '1');

    utilisateurServiceMock.getUtilisateurById.mockResolvedValue(utilisateurMock);
    roleServiceMock.getRoles.mockResolvedValue(rolesMock);
    utilisateurRoleServiceMock.getUtilisateurRoles.mockResolvedValue(utilisateurRolesMock);
    utilisateurRoleServiceMock.getRoleIdsDepuisUtilisateurRoles.mockReturnValue([1]);

    await component.chargerDonnees();

    expect(utilisateurServiceMock.getUtilisateurById).toHaveBeenCalledWith(1);
    expect(roleServiceMock.getRoles).toHaveBeenCalledOnce();
    expect(utilisateurRoleServiceMock.getUtilisateurRoles).toHaveBeenCalledWith(1);
    expect(component.utilisateur()).toEqual(utilisateurMock);
    expect(component.roles()).toEqual(rolesMock);
    expect(component.utilisateurRoles()).toEqual(utilisateurRolesMock);
    expect(component.rolesForm.controls.roles_ids.value).toEqual([1]);
    expect(component.message()).toBe('');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si l’identifiant utilisateur est invalide', async () => {
    fixture.componentRef.setInput('id', 'abc');

    await component.chargerDonnees();

    expect(component.message()).toBe('Identifiant de l’utilisateur invalide.');
    expect(component.isLoading()).toBe(false);
    expect(utilisateurServiceMock.getUtilisateurById).not.toHaveBeenCalled();
  });

  it('devrait afficher un message si l’utilisateur est introuvable', async () => {
    fixture.componentRef.setInput('id', '1');

    utilisateurServiceMock.getUtilisateurById.mockResolvedValue(null);
    roleServiceMock.getRoles.mockResolvedValue(rolesMock);
    utilisateurRoleServiceMock.getUtilisateurRoles.mockResolvedValue([]);

    await component.chargerDonnees();

    expect(component.message()).toBe('Utilisateur introuvable.');
    expect(component.utilisateur()).toBeNull();
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si le chargement des rôles échoue', async () => {
    fixture.componentRef.setInput('id', '1');

    utilisateurServiceMock.getUtilisateurById.mockResolvedValue(utilisateurMock);
    roleServiceMock.getRoles.mockRejectedValue(new Error('Erreur'));

    await component.chargerDonnees();

    expect(component.message()).toBe('Erreur pendant le chargement des rôles de l’utilisateur.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait retourner le nom complet de l’utilisateur via le service', () => {
    component.utilisateur.set(utilisateurMock);
    utilisateurRoleServiceMock.getNomComplet.mockReturnValue('Jean Dupont');

    expect(component.getNomComplet()).toBe('Jean Dupont');
    expect(utilisateurRoleServiceMock.getNomComplet).toHaveBeenCalledWith(utilisateurMock);
  });

  it('devrait indiquer qu’un rôle est coché via le service', () => {
    component.rolesForm.controls.roles_ids.setValue([1]);
    utilisateurRoleServiceMock.isRoleCoche.mockReturnValue(true);

    expect(component.isRoleCoche(rolesMock[0])).toBe(true);
    expect(utilisateurRoleServiceMock.isRoleCoche).toHaveBeenCalledWith(rolesMock[0], [1]);
  });

  it('devrait ajouter un rôle coché via le service', () => {
    component.rolesForm.controls.roles_ids.setValue([1]);
    utilisateurRoleServiceMock.ajouterRoleId.mockReturnValue([1, 2]);

    component.modifierRole(rolesMock[1], {
      target: { checked: true },
    } as unknown as Event);

    expect(utilisateurRoleServiceMock.ajouterRoleId).toHaveBeenCalledWith([1], rolesMock[1]);
    expect(component.rolesForm.controls.roles_ids.value).toEqual([1, 2]);
  });

  it('devrait retirer un rôle décoché via le service', () => {
    component.rolesForm.controls.roles_ids.setValue([1, 2]);
    utilisateurRoleServiceMock.retirerRoleId.mockReturnValue([1]);

    component.modifierRole(rolesMock[1], {
      target: { checked: false },
    } as unknown as Event);

    expect(utilisateurRoleServiceMock.retirerRoleId).toHaveBeenCalledWith([1, 2], rolesMock[1]);
    expect(component.rolesForm.controls.roles_ids.value).toEqual([1]);
  });

  it('devrait afficher un message si aucun utilisateur n’est chargé à l’enregistrement', async () => {
    await component.enregistrer();

    expect(component.message()).toBe('Utilisateur introuvable.');
  });

  it('devrait refuser l’enregistrement si aucun rôle n’est sélectionné', async () => {
    component.utilisateur.set(utilisateurMock);
    component.rolesForm.controls.roles_ids.setValue([]);
    utilisateurRoleServiceMock.getMessageErreurAucunRole.mockReturnValue('Veuillez sélectionner au moins un rôle.');

    await component.enregistrer();

    expect(component.message()).toBe('Veuillez sélectionner au moins un rôle.');
    expect(utilisateurRoleServiceMock.updateUtilisateurRoles).not.toHaveBeenCalled();
  });

  it('devrait enregistrer les rôles et rediriger vers le détail utilisateur', async () => {
    const donnees = {
      utilisateur_id: 1,
      roles_ids: [1, 2],
    };

    component.utilisateur.set(utilisateurMock);
    component.rolesForm.controls.roles_ids.setValue([1, 2]);

    utilisateurRoleServiceMock.construireUtilisateurRoleUpdateInput.mockReturnValue(donnees);
    utilisateurRoleServiceMock.updateUtilisateurRoles.mockResolvedValue(undefined);
    routerMock.navigate.mockResolvedValue(true);

    await component.enregistrer();

    expect(utilisateurRoleServiceMock.construireUtilisateurRoleUpdateInput).toHaveBeenCalledWith(1, [1, 2]);
    expect(utilisateurRoleServiceMock.updateUtilisateurRoles).toHaveBeenCalledWith(donnees);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/utilisateurs', 1]);
  });

  it('devrait afficher un message si l’enregistrement échoue', async () => {
    component.utilisateur.set(utilisateurMock);
    component.rolesForm.controls.roles_ids.setValue([1]);

    utilisateurRoleServiceMock.construireUtilisateurRoleUpdateInput.mockReturnValue({
      utilisateur_id: 1,
      roles_ids: [1],
    });
    utilisateurRoleServiceMock.updateUtilisateurRoles.mockRejectedValue(new Error('Erreur'));
    utilisateurRoleServiceMock.getMessageErreurModification.mockReturnValue(
      'Erreur pendant la modification des rôles.',
    );

    await component.enregistrer();

    expect(component.message()).toBe('Erreur pendant la modification des rôles.');
  });
});