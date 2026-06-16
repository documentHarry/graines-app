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

    it('devrait retourner le nom complet', () => {
    expect(service.getNomComplet(utilisateurMock)).toBe('Marie Dupont');
  });

  it('devrait retourner une chaîne vide si l’utilisateur est null', () => {
    expect(service.getNomComplet(null)).toBe('');
  });

  it('devrait retourner le statut Actif', () => {
    expect(service.getStatutUtilisateur(utilisateurMock)).toBe('Actif');
  });

  it('devrait retourner le statut Inactif', () => {
    expect(service.getStatutUtilisateur({
      ...utilisateurMock,
      actif: 0,
    } as Utilisateur)).toBe('Inactif');
  });

  it('devrait retourner Aucun rôle si l’utilisateur n’a pas de rôle', () => {
    expect(service.getRolesUtilisateur(utilisateurMock)).toBe('Aucun rôle');
  });

  it('devrait retourner les rôles de l’utilisateur', () => {
    const utilisateurAvecRoles = {
      ...utilisateurMock,
      utilisateur_role: [
        {
          utilisateur_id: 1,
          role_id: 1,
          role: {
            id_role: 1,
            nom_role: 'ADMIN',
          },
        },
        {
          utilisateur_id: 1,
          role_id: 2,
          role: {
            id_role: 2,
            nom_role: 'CLIENT',
          },
        },
      ],
    } as Utilisateur;

    expect(service.getRolesUtilisateur(utilisateurAvecRoles)).toBe('ADMIN, CLIENT');
  });

  it('devrait retourner le nombre d’adresses', () => {
    const utilisateurAvecAdresse = {
      ...utilisateurMock,
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
    } as Utilisateur;

    expect(service.getNombreAdresses(utilisateurAvecAdresse)).toBe(1);
  });

  it('devrait retourner 0 si l’utilisateur est null', () => {
    expect(service.getNombreAdresses(null)).toBe(0);
  });

  it('devrait filtrer les utilisateurs par nom', () => {
    const result = service.filtrerUtilisateurs(
      [utilisateurMock],
      'dup',
      '',
      '',
      '',
      '',
      ''
    );

    expect(result).toEqual([utilisateurMock]);
  });

  it('devrait filtrer les utilisateurs par prénom', () => {
    const result = service.filtrerUtilisateurs(
      [utilisateurMock],
      '',
      'mar',
      '',
      '',
      '',
      ''
    );

    expect(result).toEqual([utilisateurMock]);
  });

  it('devrait filtrer les utilisateurs par email', () => {
    const result = service.filtrerUtilisateurs(
      [utilisateurMock],
      '',
      '',
      'marie@example',
      '',
      '',
      ''
    );

    expect(result).toEqual([utilisateurMock]);
  });

  it('devrait filtrer les utilisateurs actifs', () => {
    const result = service.filtrerUtilisateurs(
      [utilisateurMock],
      '',
      '',
      '',
      'actif',
      '',
      ''
    );

    expect(result).toEqual([utilisateurMock]);
  });

  it('devrait filtrer les utilisateurs inactifs', () => {
    const utilisateurInactif = {
      ...utilisateurMock,
      actif: 0,
    } as Utilisateur;

    const result = service.filtrerUtilisateurs(
      [utilisateurMock, utilisateurInactif],
      '',
      '',
      '',
      'inactif',
      '',
      ''
    );

    expect(result).toEqual([utilisateurInactif]);
  });

  it('devrait filtrer les utilisateurs par rôle', () => {
    const utilisateurAvecRole = {
      ...utilisateurMock,
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
    } as Utilisateur;

    const result = service.filtrerUtilisateurs(
      [utilisateurAvecRole],
      '',
      '',
      '',
      '',
      'ADMIN',
      ''
    );

    expect(result).toEqual([utilisateurAvecRole]);
  });

  it('devrait filtrer les utilisateurs avec adresse', () => {
    const utilisateurAvecAdresse = {
      ...utilisateurMock,
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
    } as Utilisateur;

    const result = service.filtrerUtilisateurs(
      [utilisateurMock, utilisateurAvecAdresse],
      '',
      '',
      '',
      '',
      '',
      'avec-adresse'
    );

    expect(result).toEqual([utilisateurAvecAdresse]);
  });

  it('devrait filtrer les utilisateurs sans adresse', () => {
    const utilisateurAvecAdresse = {
      ...utilisateurMock,
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
    } as Utilisateur;

    const result = service.filtrerUtilisateurs(
      [utilisateurMock, utilisateurAvecAdresse],
      '',
      '',
      '',
      '',
      '',
      'sans-adresse'
    );

    expect(result).toEqual([utilisateurMock]);
  });

  it('devrait retourner une liste vide si aucun utilisateur ne correspond', () => {
    const result = service.filtrerUtilisateurs(
      [utilisateurMock],
      'inexistant',
      '',
      '',
      '',
      '',
      ''
    );

    expect(result).toEqual([]);
  });

  it('devrait construire un UtilisateurCreateInput', () => {
    const result = service.construireUtilisateurCreateInput({
      nom: ' Dupont ',
      prenom: ' Marie ',
      email: ' marie@example.com ',
      mot_de_passe: 'secret',
    });

    expect(result).toEqual({
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie@example.com',
      mot_de_passe: 'secret',
    });
  });

  it('devrait construire un UtilisateurUpdateInput', () => {
    const result = service.construireUtilisateurUpdateInput(1, {
      nom: ' Dupont modifié ',
      prenom: ' Marie ',
      email: ' marie@example.com ',
      actif: 1,
    });

    expect(result).toEqual({
      id_utilisateur: 1,
      nom: 'Dupont modifié',
      prenom: 'Marie',
      email: 'marie@example.com',
    });
  });

  it('devrait retourner le message d’erreur à la création', () => {
    expect(service.getMessageErreurCreation()).toBe(
      'Une erreur est survenue pendant la création de l’utilisateur.'
    );
  });

  it('devrait retourner le message d’erreur à la modification', () => {
    expect(service.getMessageErreurModification()).toBe(
      'Une erreur est survenue pendant la modification de l’utilisateur.'
    );
  });

  it('devrait retourner le message d’erreur de suppression', () => {
    expect(service.getMessageErreurSuppression()).toBe(
      'Une erreur est survenue pendant la suppression de l’utilisateur.'
    );
  });
});