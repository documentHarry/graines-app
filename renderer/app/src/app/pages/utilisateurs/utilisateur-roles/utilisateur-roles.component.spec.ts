import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { UtilisateurRolesComponent } from './utilisateur-roles.component';
import { UtilisateurService } from '../../../services/utilisateur.service';
import { RoleService } from '../../../services/role.service';
import { Role, Utilisateur, UtilisateurRole } from '../../../types/electron';

describe('UtilisateurRolesComponent', () => {
  let component: UtilisateurRolesComponent;
  let fixture: ComponentFixture<UtilisateurRolesComponent>;

  let utilisateurServiceMock: {
    getUtilisateurById: ReturnType<typeof vi.fn>;
  };

  let roleServiceMock: {
    getRoles: ReturnType<typeof vi.fn>;
    getUtilisateurRoles: ReturnType<typeof vi.fn>;
    updateUtilisateurRoles: ReturnType<typeof vi.fn>;
  };

  let router: Router;

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

  const rolesMock: Role[] = [
    {
      id_role: 1,
      nom_role: 'ADMIN',
    },
    {
      id_role: 2,
      nom_role: 'CLIENT',
    },
    {
      id_role: 3,
      nom_role: 'MODERATEUR',
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

  beforeEach(async () => {
    utilisateurServiceMock = {
      getUtilisateurById: vi.fn().mockResolvedValue(utilisateurMock),
    };

    roleServiceMock = {
      getRoles: vi.fn().mockResolvedValue(rolesMock),
      getUtilisateurRoles: vi.fn().mockResolvedValue(utilisateurRolesMock),
      updateUtilisateurRoles: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [UtilisateurRolesComponent],
      providers: [
        provideRouter([]),
        { provide: UtilisateurService, useValue: utilisateurServiceMock },
        { provide: RoleService, useValue: roleServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(UtilisateurRolesComponent);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger l’utilisateur, les rôles et les rôles cochés', async () => {
    fixture.componentRef.setInput('id', '1');

    await component.chargerDonnees();

    expect(utilisateurServiceMock.getUtilisateurById).toHaveBeenCalledWith(1);
    expect(roleServiceMock.getRoles).toHaveBeenCalled();
    expect(roleServiceMock.getUtilisateurRoles).toHaveBeenCalledWith(1);

    expect(component.utilisateur()).toEqual(utilisateurMock);
    expect(component.roles()).toEqual(rolesMock);
    expect(component.utilisateurRoles()).toEqual(utilisateurRolesMock);
    expect(component.rolesForm.controls.roles_ids.value).toEqual([2]);
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
    utilisateurServiceMock.getUtilisateurById.mockResolvedValue(null);
    fixture.componentRef.setInput('id', '1');

    await component.chargerDonnees();

    expect(component.message()).toBe('Utilisateur introuvable.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si le chargement des rôles échoue', async () => {
    roleServiceMock.getRoles.mockRejectedValue(new Error('Erreur test'));
    fixture.componentRef.setInput('id', '1');

    await component.chargerDonnees();

    expect(component.message()).toBe('Erreur pendant le chargement des rôles de l’utilisateur.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait retourner le nom complet de l’utilisateur', () => {
    component.utilisateur.set(utilisateurMock);

    expect(component.getNomComplet()).toBe('Marie Dupont');
  });

  it('devrait retourner une chaîne vide si aucun utilisateur n’est chargé', () => {
    component.utilisateur.set(null);

    expect(component.getNomComplet()).toBe('');
  });

  it('devrait indiquer qu’un rôle est coché', () => {
    component.rolesForm.controls.roles_ids.setValue([2]);

    expect(component.isRoleCoche(rolesMock[1])).toBe(true);
  });

  it('devrait indiquer qu’un rôle n’est pas coché', () => {
    component.rolesForm.controls.roles_ids.setValue([2]);

    expect(component.isRoleCoche(rolesMock[0])).toBe(false);
  });

  it('devrait ajouter un rôle coché', () => {
    component.rolesForm.controls.roles_ids.setValue([2]);

    const event = {
      target: { checked: true },
    } as unknown as Event;

    component.modifierRole(rolesMock[0], event);

    expect(component.rolesForm.controls.roles_ids.value).toEqual([2, 1]);
  });

  it('devrait retirer un rôle décoché', () => {
    component.rolesForm.controls.roles_ids.setValue([1, 2]);

    const event = {
      target: { checked: false },
    } as unknown as Event;

    component.modifierRole(rolesMock[0], event);

    expect(component.rolesForm.controls.roles_ids.value).toEqual([2]);
  });

  it('devrait afficher un message si aucun utilisateur n’est chargé à l’enregistrement', async () => {
    component.rolesForm.controls.roles_ids.setValue([1]);

    await component.enregistrer();

    expect(component.message()).toBe('Utilisateur introuvable.');
    expect(roleServiceMock.updateUtilisateurRoles).not.toHaveBeenCalled();
  });

  it('devrait refuser l’enregistrement si aucun rôle n’est sélectionné', async () => {
    component.utilisateur.set(utilisateurMock);
    component.rolesForm.controls.roles_ids.setValue([]);

    await component.enregistrer();

    expect(component.message()).toBe('Un utilisateur doit avoir au moins un rôle.');
    expect(roleServiceMock.updateUtilisateurRoles).not.toHaveBeenCalled();
  });

  it('devrait enregistrer les rôles et rediriger vers le détail utilisateur', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.utilisateur.set(utilisateurMock);
    component.rolesForm.controls.roles_ids.setValue([1, 2]);

    await component.enregistrer();

    expect(roleServiceMock.updateUtilisateurRoles).toHaveBeenCalledWith({
      utilisateur_id: 1,
      roles_ids: [1, 2],
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/utilisateurs', 1]);
  });

  it('devrait afficher un message si l’enregistrement échoue', async () => {
    roleServiceMock.updateUtilisateurRoles.mockRejectedValue(new Error('Erreur test'));

    component.utilisateur.set(utilisateurMock);
    component.rolesForm.controls.roles_ids.setValue([1]);

    await component.enregistrer();

    expect(component.message()).toBe('Une erreur technique est survenue pendant la modification des rôles.');
  });
});