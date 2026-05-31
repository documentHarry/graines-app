import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { UtilisateurSupprimerComponent } from './utilisateur-supprimer.component';
import { UtilisateurService } from '../../../services/utilisateur.service';
import { Utilisateur } from '../../../types/electron';

describe('UtilisateurSupprimerComponent', () => {
  let component: UtilisateurSupprimerComponent;
  let fixture: ComponentFixture<UtilisateurSupprimerComponent>;
  let utilisateurServiceMock: {
    getUtilisateurById: ReturnType<typeof vi.fn>;
    deleteUtilisateur: ReturnType<typeof vi.fn>;
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
    utilisateur_role: [],
  } as Utilisateur;

  beforeEach(async () => {
    utilisateurServiceMock = {
      getUtilisateurById: vi.fn().mockResolvedValue(utilisateurMock),
      deleteUtilisateur: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [UtilisateurSupprimerComponent],
      providers: [
        provideRouter([]),
        { provide: UtilisateurService, useValue: utilisateurServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(UtilisateurSupprimerComponent);
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

  it('devrait afficher un message si l’identifiant est invalide', async () => {
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

  it('devrait afficher un message si le chargement échoue', async () => {
    utilisateurServiceMock.getUtilisateurById.mockRejectedValue(new Error('Erreur test'));
    fixture.componentRef.setInput('id', '1');

    await component.chargerUtilisateur();

    expect(component.message()).toBe('Erreur pendant le chargement de l’utilisateur.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait retourner le nom complet', () => {
    component.utilisateur.set(utilisateurMock);

    expect(component.getNomComplet()).toBe('Marie Dupont');
  });

  it('devrait retourner une chaîne vide si aucun utilisateur n’est chargé', () => {
    component.utilisateur.set(null);

    expect(component.getNomComplet()).toBe('');
  });

  it('devrait retourner le nombre d’adresses', () => {
    component.utilisateur.set(utilisateurMock);

    expect(component.getNombreAdresses()).toBe(1);
  });

  it('devrait retourner 0 si aucune adresse n’existe', () => {
    component.utilisateur.set({
      ...utilisateurMock,
      adresse_livraison: [],
    });

    expect(component.getNombreAdresses()).toBe(0);
  });

  it('ne devrait pas supprimer si aucun utilisateur n’est chargé', async () => {
    await component.supprimerUtilisateur();

    expect(utilisateurServiceMock.deleteUtilisateur).not.toHaveBeenCalled();
  });

  it('ne devrait pas supprimer si la confirmation est annulée', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.utilisateur.set(utilisateurMock);

    await component.supprimerUtilisateur();

    expect(confirmSpy).toHaveBeenCalledWith('Voulez-vous vraiment désactiver cet utilisateur ?');
    expect(utilisateurServiceMock.deleteUtilisateur).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('devrait désactiver l’utilisateur et rediriger vers la liste', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.utilisateur.set(utilisateurMock);

    await component.supprimerUtilisateur();

    expect(utilisateurServiceMock.deleteUtilisateur).toHaveBeenCalledWith(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/utilisateurs']);

    confirmSpy.mockRestore();
  });

  it('devrait afficher un message si la suppression échoue', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    utilisateurServiceMock.deleteUtilisateur.mockRejectedValue(new Error('Erreur test'));

    component.utilisateur.set(utilisateurMock);

    await component.supprimerUtilisateur();

    expect(component.message()).toBe('Une erreur est survenue pendant la suppression de l’utilisateur.');
  });

  it('devrait annuler et retourner au détail utilisateur', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.utilisateur.set(utilisateurMock);

    await component.annuler();

    expect(navigateSpy).toHaveBeenCalledWith(['/utilisateurs', 1]);
  });
});