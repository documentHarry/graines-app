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
    filtrerUtilisateurs: ReturnType<typeof vi.fn>;
    getRolesUtilisateur: ReturnType<typeof vi.fn>;
    getNomComplet: ReturnType<typeof vi.fn>;
    getStatutUtilisateur: ReturnType<typeof vi.fn>;
    getNombreAdresses: ReturnType<typeof vi.fn>;
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

      filtrerUtilisateurs: vi.fn().mockImplementation((
        utilisateurs: Utilisateur[],
        nomRecherche: string,
        prenomRecherche: string,
        emailRecherche: string,
        statutRecherche: string,
        roleRecherche: string,
        adresseRecherche: string
      ) => {
        const nom = nomRecherche.toLowerCase().trim();
        const prenom = prenomRecherche.toLowerCase().trim();
        const email = emailRecherche.toLowerCase().trim();

        return utilisateurs.filter(utilisateur => {
          const correspondNom =
            nom === '' || utilisateur.nom.toLowerCase().includes(nom);

          const correspondPrenom =
            prenom === '' || utilisateur.prenom.toLowerCase().includes(prenom);

          const correspondEmail =
            email === '' || utilisateur.email.toLowerCase().includes(email);

          const correspondStatut =
            statutRecherche === '' ||
            statutRecherche === 'actif' && utilisateur.actif === 1 ||
            statutRecherche === 'inactif' && utilisateur.actif === 0;

          const correspondRole =
            roleRecherche === '' ||
            (utilisateur.utilisateur_role ?? [])
              .some(utilisateurRole => utilisateurRole.role.nom_role === roleRecherche);

          const nombreAdresses = utilisateur.adresse_livraison?.length ?? 0;

          const correspondAdresse =
            adresseRecherche === '' ||
            adresseRecherche === 'avec-adresse' && nombreAdresses > 0 ||
            adresseRecherche === 'sans-adresse' && nombreAdresses === 0;

          return correspondNom
            && correspondPrenom
            && correspondEmail
            && correspondStatut
            && correspondRole
            && correspondAdresse;
        });
      }),

      getRolesUtilisateur: vi.fn().mockImplementation((utilisateur: Utilisateur | null) => {
        const roles = utilisateur?.utilisateur_role ?? [];

        if (roles.length === 0) {
          return 'Aucun rôle';
        }

        return roles.map(utilisateurRole => utilisateurRole.role.nom_role).join(', ');
      }),

      getNomComplet: vi.fn().mockImplementation((utilisateur: Utilisateur | null) => {
        if (!utilisateur) {
          return '';
        }

        return `${utilisateur.prenom} ${utilisateur.nom}`;
      }),

      getStatutUtilisateur: vi.fn().mockImplementation((utilisateur: Utilisateur | null) => {
        if (utilisateur?.actif === 1) {
          return 'Actif';
        }

        return 'Inactif';
      }),

      getNombreAdresses: vi.fn().mockImplementation((utilisateur: Utilisateur | null) => {
        return utilisateur?.adresse_livraison?.length ?? 0;
      }),
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

  afterEach(() => {
    vi.clearAllMocks();
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

  it('devrait retourner les rôles de l’utilisateur via le service', () => {
    expect(component.getRolesUtilisateur(utilisateursMock[0])).toBe('ADMIN');
    expect(utilisateurServiceMock.getRolesUtilisateur).toHaveBeenCalledWith(utilisateursMock[0]);
  });

  it('devrait retourner Aucun rôle si l’utilisateur n’a pas de rôle via le service', () => {
    const utilisateurSansRole = {
      ...utilisateursMock[0],
      utilisateur_role: [],
    } as Utilisateur;

    expect(component.getRolesUtilisateur(utilisateurSansRole)).toBe('Aucun rôle');
    expect(utilisateurServiceMock.getRolesUtilisateur).toHaveBeenCalledWith(utilisateurSansRole);
  });

  it('devrait filtrer par nom via le service', () => {
    component.utilisateurs.set(utilisateursMock);
    component.nomRecherche.set('dup');

    expect(component.utilisateursFiltres()).toEqual([utilisateursMock[0]]);
    expect(utilisateurServiceMock.filtrerUtilisateurs).toHaveBeenCalledWith(
      utilisateursMock,
      'dup',
      '',
      '',
      '',
      '',
      ''
    );
  });

  it('devrait filtrer par prénom via le service', () => {
    component.utilisateurs.set(utilisateursMock);
    component.prenomRecherche.set('jean');

    expect(component.utilisateursFiltres()).toEqual([utilisateursMock[1]]);
  });

  it('devrait filtrer par email via le service', () => {
    component.utilisateurs.set(utilisateursMock);
    component.emailRecherche.set('marie');

    expect(component.utilisateursFiltres()).toEqual([utilisateursMock[0]]);
  });

  it('devrait filtrer les utilisateurs actifs via le service', () => {
    component.utilisateurs.set(utilisateursMock);
    component.statutRecherche.set('actif');

    expect(component.utilisateursFiltres()).toEqual([utilisateursMock[0]]);
  });

  it('devrait filtrer les utilisateurs inactifs via le service', () => {
    component.utilisateurs.set(utilisateursMock);
    component.statutRecherche.set('inactif');

    expect(component.utilisateursFiltres()).toEqual([utilisateursMock[1]]);
  });

  it('devrait filtrer par rôle via le service', () => {
    component.utilisateurs.set(utilisateursMock);
    component.roleRecherche.set('CLIENT');

    expect(component.utilisateursFiltres()).toEqual([utilisateursMock[1]]);
  });

  it('devrait filtrer les utilisateurs avec adresse via le service', () => {
    component.utilisateurs.set(utilisateursMock);
    component.adresseRecherche.set('avec-adresse');

    expect(component.utilisateursFiltres()).toEqual([utilisateursMock[0]]);
  });

  it('devrait filtrer les utilisateurs sans adresse via le service', () => {
    component.utilisateurs.set(utilisateursMock);
    component.adresseRecherche.set('sans-adresse');

    expect(component.utilisateursFiltres()).toEqual([utilisateursMock[1]]);
  });

  it('devrait retourner le nom complet via le service', () => {
    expect(component.getNomComplet(utilisateursMock[0])).toBe('Marie Dupont');
    expect(utilisateurServiceMock.getNomComplet).toHaveBeenCalledWith(utilisateursMock[0]);
  });

  it('devrait retourner le statut Actif via le service', () => {
    expect(component.getStatutUtilisateur(utilisateursMock[0])).toBe('Actif');
    expect(utilisateurServiceMock.getStatutUtilisateur).toHaveBeenCalledWith(utilisateursMock[0]);
  });

  it('devrait retourner le statut Inactif via le service', () => {
    expect(component.getStatutUtilisateur(utilisateursMock[1])).toBe('Inactif');
    expect(utilisateurServiceMock.getStatutUtilisateur).toHaveBeenCalledWith(utilisateursMock[1]);
  });

  it('devrait retourner le nombre d’adresses via le service', () => {
    expect(component.getNombreAdresses(utilisateursMock[0])).toBe(1);
    expect(utilisateurServiceMock.getNombreAdresses).toHaveBeenCalledWith(utilisateursMock[0]);
  });

  it('devrait retourner 0 si l’utilisateur n’a pas d’adresse via le service', () => {
    expect(component.getNombreAdresses(utilisateursMock[1])).toBe(0);
    expect(utilisateurServiceMock.getNombreAdresses).toHaveBeenCalledWith(utilisateursMock[1]);
  });
});