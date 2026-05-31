import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { UtilisateursComponent } from './utilisateurs.component';
import { UtilisateurService } from '../../services/utilisateur.service';
import { AuthService } from '../../services/auth.service';
import { Utilisateur } from '../../types/electron';

describe('UtilisateursComponent', () => {
  let component: UtilisateursComponent;
  let fixture: ComponentFixture<UtilisateursComponent>;

  let utilisateurServiceMock: {
    getUtilisateurs: ReturnType<typeof vi.fn>;
  };

  let authServiceMock: {
    hasRole: ReturnType<typeof vi.fn>;
  };

  const utilisateursMock: Utilisateur[] = [
    {
      id_utilisateur: 1,
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie@example.com',
      mot_de_passe: 'secret',
      date_inscription: '2026-05-31 10:00:00',
      actif: 1,
      adresse_livraison: [
        {
          id_adresse: 1,
          rue: 'Rue des Fleurs',
          numero: '12',
          par_defaut: 1,
          utilisateur_id: 1,
          localite_id: 1,
          localite: {
            id_localite: 1,
            code_postal: '5000',
            localite: 'Namur',
          },
        },
      ],
      utilisateur_role: [
        {
          utilisateur_id: 1,
          role_id: 1,
          role: {
            id_role: 1,
            nom_role: 'ADMIN',
          },
        },
      ],
    } as Utilisateur,
    {
      id_utilisateur: 2,
      nom: 'Martin',
      prenom: 'Jean',
      email: 'jean@example.com',
      mot_de_passe: 'secret',
      date_inscription: '2026-05-31 11:00:00',
      actif: 0,
      adresse_livraison: [],
      utilisateur_role: [
        {
          utilisateur_id: 2,
          role_id: 2,
          role: {
            id_role: 2,
            nom_role: 'CLIENT',
          },
        },
      ],
    } as Utilisateur,
  ];

  beforeEach(async () => {
    utilisateurServiceMock = {
      getUtilisateurs: vi.fn().mockResolvedValue(utilisateursMock),
    };

    authServiceMock = {
      hasRole: vi.fn().mockReturnValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [UtilisateursComponent],
      providers: [
        provideRouter([]),
        { provide: UtilisateurService, useValue: utilisateurServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UtilisateursComponent);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger les utilisateurs', async () => {
    await component.chargerUtilisateurs();

    expect(utilisateurServiceMock.getUtilisateurs).toHaveBeenCalled();
    expect(component.utilisateurs()).toEqual(utilisateursMock);
    expect(component.message()).toBe('');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si le chargement échoue', async () => {
    utilisateurServiceMock.getUtilisateurs.mockRejectedValue(new Error('Erreur test'));

    await component.chargerUtilisateurs();

    expect(component.message()).toBe('Erreur pendant le chargement des utilisateurs.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait retourner les rôles disponibles triés', () => {
    component.utilisateurs.set(utilisateursMock);

    expect(component.rolesDisponibles()).toEqual(['ADMIN', 'CLIENT']);
  });

  it('devrait retourner les rôles de l’utilisateur', () => {
    expect(component.getRolesUtilisateur(utilisateursMock[0])).toBe('ADMIN');
  });

  it('devrait retourner Aucun rôle si l’utilisateur n’a pas de rôle', () => {
    expect(component.getRolesUtilisateur({
      ...utilisateursMock[0],
      utilisateur_role: [],
    } as Utilisateur)).toBe('Aucun rôle');
  });

  it('devrait filtrer par nom', () => {
    component.utilisateurs.set(utilisateursMock);
    component.nomRecherche.set('dup');

    expect(component.utilisateursFiltres()).toEqual([utilisateursMock[0]]);
  });

  it('devrait filtrer par prénom', () => {
    component.utilisateurs.set(utilisateursMock);
    component.prenomRecherche.set('jean');

    expect(component.utilisateursFiltres()).toEqual([utilisateursMock[1]]);
  });

  it('devrait filtrer par email', () => {
    component.utilisateurs.set(utilisateursMock);
    component.emailRecherche.set('marie');

    expect(component.utilisateursFiltres()).toEqual([utilisateursMock[0]]);
  });

  it('devrait filtrer les utilisateurs actifs', () => {
    component.utilisateurs.set(utilisateursMock);
    component.statutRecherche.set('actif');

    expect(component.utilisateursFiltres()).toEqual([utilisateursMock[0]]);
  });

  it('devrait filtrer les utilisateurs inactifs', () => {
    component.utilisateurs.set(utilisateursMock);
    component.statutRecherche.set('inactif');

    expect(component.utilisateursFiltres()).toEqual([utilisateursMock[1]]);
  });

  it('devrait filtrer par rôle', () => {
    component.utilisateurs.set(utilisateursMock);
    component.roleRecherche.set('CLIENT');

    expect(component.utilisateursFiltres()).toEqual([utilisateursMock[1]]);
  });

  it('devrait filtrer les utilisateurs avec adresse', () => {
    component.utilisateurs.set(utilisateursMock);
    component.adresseRecherche.set('avec-adresse');

    expect(component.utilisateursFiltres()).toEqual([utilisateursMock[0]]);
  });

  it('devrait filtrer les utilisateurs sans adresse', () => {
    component.utilisateurs.set(utilisateursMock);
    component.adresseRecherche.set('sans-adresse');

    expect(component.utilisateursFiltres()).toEqual([utilisateursMock[1]]);
  });

  it('devrait retourner le nom complet', () => {
    expect(component.getNomComplet(utilisateursMock[0])).toBe('Marie Dupont');
  });

  it('devrait retourner le statut Actif', () => {
    expect(component.getStatutUtilisateur(utilisateursMock[0])).toBe('Actif');
  });

  it('devrait retourner le statut Inactif', () => {
    expect(component.getStatutUtilisateur(utilisateursMock[1])).toBe('Inactif');
  });

  it('devrait retourner le nombre d’adresses', () => {
    expect(component.getNombreAdresses(utilisateursMock[0])).toBe(1);
  });

  it('devrait retourner 0 si l’utilisateur n’a pas d’adresse', () => {
    expect(component.getNombreAdresses(utilisateursMock[1])).toBe(0);
  });
});