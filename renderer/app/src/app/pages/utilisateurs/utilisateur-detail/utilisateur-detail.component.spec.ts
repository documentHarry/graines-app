import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { UtilisateurDetailComponent } from './utilisateur-detail.component';
import { UtilisateurService } from '../../../services/utilisateur.service';
import { LocaliteService } from '../../../services/localite.service';
import { Utilisateur, Localite } from '../../../types/electron';

describe('UtilisateurDetailComponent', () => {
  let component: UtilisateurDetailComponent;
  let fixture: ComponentFixture<UtilisateurDetailComponent>;

  let utilisateurServiceMock: {
    getUtilisateurById: ReturnType<typeof vi.fn>;
  };

  let localiteServiceMock: {
    getLocalites: ReturnType<typeof vi.fn>;
  };

  const localitesMock: Localite[] = [
    {
      id_localite: 1,
      code_postal: '5000',
      localite: 'Namur',
    },
  ];

  const utilisateurMock: Utilisateur = {
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
        localite: localitesMock[0],
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
  } as Utilisateur;

  beforeEach(async () => {
    utilisateurServiceMock = {
      getUtilisateurById: vi.fn().mockResolvedValue(utilisateurMock),
    };

    localiteServiceMock = {
      getLocalites: vi.fn().mockResolvedValue(localitesMock),
    };

    await TestBed.configureTestingModule({
      imports: [UtilisateurDetailComponent],
      providers: [
        provideRouter([]),
        { provide: UtilisateurService, useValue: utilisateurServiceMock },
        { provide: LocaliteService, useValue: localiteServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UtilisateurDetailComponent);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger l’utilisateur', async () => {
    fixture.componentRef.setInput('id', '1');

    await component.chargerUtilisateur();

    expect(utilisateurServiceMock.getUtilisateurById).toHaveBeenCalledWith(1);
    expect(component.utilisateur()).toEqual(utilisateurMock);
    expect(component.message()).toBe('');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait charger les localités', async () => {
    await component.chargerLocalites();

    expect(localiteServiceMock.getLocalites).toHaveBeenCalled();
    expect(component.localites()).toEqual(localitesMock);
  });

  it('devrait afficher un message si l’identifiant utilisateur est invalide', async () => {
    fixture.componentRef.setInput('id', 'abc');

    await component.chargerUtilisateur();

    expect(component.message()).toBe('Identifiant de l’utilisateur invalide.');
    expect(component.isLoading()).toBe(false);
    expect(utilisateurServiceMock.getUtilisateurById).not.toHaveBeenCalled();
  });

  it('devrait afficher un message si l’utilisateur est introuvable', async () => {
    utilisateurServiceMock.getUtilisateurById.mockResolvedValue(null);
    fixture.componentRef.setInput('id', '1');

    await component.chargerUtilisateur();

    expect(component.message()).toBe('Utilisateur introuvable.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si le chargement de l’utilisateur échoue', async () => {
    utilisateurServiceMock.getUtilisateurById.mockRejectedValue(new Error('Erreur test'));
    fixture.componentRef.setInput('id', '1');

    await component.chargerUtilisateur();

    expect(component.message()).toBe('Erreur pendant le chargement de l’utilisateur.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si le chargement des localités échoue', async () => {
    localiteServiceMock.getLocalites.mockRejectedValue(new Error('Erreur test'));

    await component.chargerLocalites();

    expect(component.message()).toBe('Erreur pendant le chargement des localités.');
  });

  it('devrait retourner le statut Actif', () => {
    component.utilisateur.set(utilisateurMock);

    expect(component.getStatutUtilisateur()).toBe('Actif');
  });

  it('devrait retourner le statut Inactif', () => {
    component.utilisateur.set({
      ...utilisateurMock,
      actif: 0,
    });

    expect(component.getStatutUtilisateur()).toBe('Inactif');
  });

  it('devrait retourner le nom complet', () => {
    component.utilisateur.set(utilisateurMock);

    expect(component.getNomComplet()).toBe('Marie Dupont');
  });

  it('devrait retourner une chaîne vide si aucun utilisateur n’est chargé', () => {
    component.utilisateur.set(null);

    expect(component.getNomComplet()).toBe('');
  });

  it('devrait retourner les adresses de livraison', () => {
    component.utilisateur.set(utilisateurMock);

    expect(component.getAdresses()).toEqual(utilisateurMock.adresse_livraison);
  });

  it('devrait retourner une liste vide si aucune adresse n’existe', () => {
    component.utilisateur.set({
      ...utilisateurMock,
      adresse_livraison: [],
    });

    expect(component.getAdresses()).toEqual([]);
  });

  it('devrait retourner les rôles de l’utilisateur', () => {
    component.utilisateur.set(utilisateurMock);

    expect(component.getRolesUtilisateur()).toBe('ADMIN');
  });

  it('devrait retourner Aucun rôle si l’utilisateur n’a pas de rôle', () => {
    component.utilisateur.set({
      ...utilisateurMock,
      utilisateur_role: [],
    });

    expect(component.getRolesUtilisateur()).toBe('Aucun rôle');
  });

  it('devrait mettre à jour le message avec une erreur d’adresse', () => {
    component.afficherErreurAdresse('Erreur adresse test');

    expect(component.message()).toBe('Erreur adresse test');
  });
});