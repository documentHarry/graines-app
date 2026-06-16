import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { UtilisateurDetailComponent } from './utilisateur-detail.component';
import { UtilisateurService } from '../../../services/utilisateur.service';
import { AdresseLivraisonService } from '../../../services/adresse-livraison.service';
import { Utilisateur } from '../../../types/electron';

describe('UtilisateurDetailComponent', () => {
  let component: UtilisateurDetailComponent;
  let fixture: ComponentFixture<UtilisateurDetailComponent>;

  const utilisateurMock: Utilisateur = {
    id_utilisateur: 1,
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@test.fr',
    date_inscription: '2024-01-01',
    actif: 1,
    adresse_livraison: [],
  };

  const utilisateurServiceMock = {
    getUtilisateurById: vi.fn(),
    getStatutUtilisateur: vi.fn(),
    getNomComplet: vi.fn(),
    getRolesUtilisateur: vi.fn(),
  };

  const adresseLivraisonServiceMock = {
    getAdresseComplete: vi.fn(),
    getLabelAdresseParDefaut: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [UtilisateurDetailComponent],
      providers: [
        provideRouter([]),
        {
          provide: UtilisateurService,
          useValue: utilisateurServiceMock,
        },
        {
          provide: AdresseLivraisonService,
          useValue: adresseLivraisonServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UtilisateurDetailComponent);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger un utilisateur valide', async () => {
    fixture.componentRef.setInput('id', '1');
    utilisateurServiceMock.getUtilisateurById.mockResolvedValue(utilisateurMock);

    await component.chargerUtilisateur();

    expect(utilisateurServiceMock.getUtilisateurById).toHaveBeenCalledWith(1);
    expect(component.utilisateur()).toEqual(utilisateurMock);
    expect(component.message()).toBe('');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si l’identifiant est invalide', async () => {
    fixture.componentRef.setInput('id', 'abc');

    await component.chargerUtilisateur();

    expect(utilisateurServiceMock.getUtilisateurById).not.toHaveBeenCalled();
    expect(component.message()).toBe('Identifiant de l’utilisateur invalide.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si l’utilisateur est introuvable', async () => {
    fixture.componentRef.setInput('id', '1');
    utilisateurServiceMock.getUtilisateurById.mockResolvedValue(null);

    await component.chargerUtilisateur();

    expect(component.utilisateur()).toBeNull();
    expect(component.message()).toBe('Utilisateur introuvable.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message en cas d’erreur de chargement', async () => {
    fixture.componentRef.setInput('id', '1');
    utilisateurServiceMock.getUtilisateurById.mockRejectedValue(new Error('Erreur'));

    await component.chargerUtilisateur();

    expect(component.message()).toBe('Erreur pendant le chargement de l’utilisateur.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait appeler chargerUtilisateur au ngOnInit', async () => {
    fixture.componentRef.setInput('id', '1');
    utilisateurServiceMock.getUtilisateurById.mockResolvedValue(utilisateurMock);

    await component.ngOnInit();

    expect(utilisateurServiceMock.getUtilisateurById).toHaveBeenCalledWith(1);
  });

  it('devrait retourner le statut utilisateur depuis le service', () => {
    component.utilisateur.set(utilisateurMock);
    utilisateurServiceMock.getStatutUtilisateur.mockReturnValue('Actif');

    expect(component.getStatutUtilisateur()).toBe('Actif');
    expect(utilisateurServiceMock.getStatutUtilisateur).toHaveBeenCalledWith(utilisateurMock);
  });

  it('devrait retourner le nom complet depuis le service', () => {
    component.utilisateur.set(utilisateurMock);
    utilisateurServiceMock.getNomComplet.mockReturnValue('Jean Dupont');

    expect(component.getNomComplet()).toBe('Jean Dupont');
    expect(utilisateurServiceMock.getNomComplet).toHaveBeenCalledWith(utilisateurMock);
  });

  it('devrait retourner les rôles utilisateur depuis le service', () => {
    component.utilisateur.set(utilisateurMock);
    utilisateurServiceMock.getRolesUtilisateur.mockReturnValue('Admin');

    expect(component.getRolesUtilisateur()).toBe('Admin');
    expect(utilisateurServiceMock.getRolesUtilisateur).toHaveBeenCalledWith(utilisateurMock);
  });

  it('devrait retourner les adresses de livraison de l’utilisateur', () => {
    const adresse = {
      id_adresse: 1,
      rue: 'Rue des Lilas',
      numero: '10',
      par_defaut: 1,
      utilisateur_id: 1,
      localite_id: 1,
      localite: {
        id_localite: 1,
        code_postal: '75000',
        localite: 'Paris',
      },
    };

    component.utilisateur.set({
      ...utilisateurMock,
      adresse_livraison: [adresse],
    });

    expect(component.getAdresses()).toEqual([adresse]);
  });

  it('devrait retourner une liste vide si aucun utilisateur n’est chargé', () => {
    component.utilisateur.set(null);

    expect(component.getAdresses()).toEqual([]);
  });
});