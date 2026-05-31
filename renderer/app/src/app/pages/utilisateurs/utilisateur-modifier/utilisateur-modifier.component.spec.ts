import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { UtilisateurModifierComponent } from './utilisateur-modifier.component';
import { UtilisateurService } from '../../../services/utilisateur.service';
import { Utilisateur } from '../../../types/electron';

describe('UtilisateurModifierComponent', () => {
  let component: UtilisateurModifierComponent;
  let fixture: ComponentFixture<UtilisateurModifierComponent>;
  let utilisateurServiceMock: {
    getUtilisateurById: ReturnType<typeof vi.fn>;
    updateUtilisateur: ReturnType<typeof vi.fn>;
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

  beforeEach(async () => {
    utilisateurServiceMock = {
      getUtilisateurById: vi.fn().mockResolvedValue(utilisateurMock),
      updateUtilisateur: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [UtilisateurModifierComponent],
      providers: [
        provideRouter([]),
        { provide: UtilisateurService, useValue: utilisateurServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(UtilisateurModifierComponent);
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
    expect(component.isLoading()).toBe(false);
    expect(component.message()).toBe('');
  });

  it('devrait remplir le formulaire avec l’utilisateur', async () => {
    fixture.componentRef.setInput('id', '1');

    await component.chargerUtilisateur();

    expect(component.utilisateurForm.getRawValue()).toEqual({
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie@example.com',
      actif: 1,
    });
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

  it('devrait avoir un formulaire invalide quand le nom est vide', () => {
    component.utilisateurForm.patchValue({
      nom: '',
      prenom: 'Marie',
      email: 'marie@example.com',
      actif: 1,
    });

    expect(component.utilisateurForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire invalide quand le prénom est vide', () => {
    component.utilisateurForm.patchValue({
      nom: 'Dupont',
      prenom: '',
      email: 'marie@example.com',
      actif: 1,
    });

    expect(component.utilisateurForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire invalide quand l’email est invalide', () => {
    component.utilisateurForm.patchValue({
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'email-invalide',
      actif: 1,
    });

    expect(component.utilisateurForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire valide quand les champs obligatoires sont remplis', () => {
    component.utilisateurForm.patchValue({
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie@example.com',
      actif: 1,
    });

    expect(component.utilisateurForm.valid).toBe(true);
  });

  it('ne devrait pas enregistrer si le formulaire est invalide', async () => {
    component.utilisateur.set(utilisateurMock);

    component.utilisateurForm.patchValue({
      nom: '',
      prenom: 'Marie',
      email: 'marie@example.com',
      actif: 1,
    });

    await component.enregistrer();

    expect(component.message()).toBe('Veuillez remplir les champs obligatoires.');
    expect(utilisateurServiceMock.updateUtilisateur).not.toHaveBeenCalled();
  });

  it('ne devrait pas enregistrer si aucun utilisateur n’est chargé', async () => {
    component.utilisateurForm.patchValue({
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie@example.com',
      actif: 1,
    });

    await component.enregistrer();

    expect(component.message()).toBe('Veuillez remplir les champs obligatoires.');
    expect(utilisateurServiceMock.updateUtilisateur).not.toHaveBeenCalled();
  });

  it('devrait modifier l’utilisateur et rediriger vers son détail', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.utilisateur.set(utilisateurMock);
    component.utilisateurForm.patchValue({
      nom: ' Dupont ',
      prenom: ' Marie ',
      email: 'marie@example.com',
      actif: 1,
    });

    await component.enregistrer();

    expect(utilisateurServiceMock.updateUtilisateur).toHaveBeenCalledWith({
      id_utilisateur: 1,
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie@example.com',
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/utilisateurs', 1]);
  });

  it('devrait afficher un message si l’email existe déjà', async () => {
    utilisateurServiceMock.updateUtilisateur.mockRejectedValue('DUPLICATE_USER_EMAIL');

    component.utilisateur.set(utilisateurMock);
    component.utilisateurForm.patchValue({
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie@example.com',
      actif: 1,
    });

    await component.enregistrer();

    expect(component.message()).toBe('Un utilisateur avec cet email existe déjà.');
  });

  it('devrait afficher un message si la modification échoue techniquement', async () => {
    utilisateurServiceMock.updateUtilisateur.mockRejectedValue(new Error('Erreur technique'));

    component.utilisateur.set(utilisateurMock);
    component.utilisateurForm.patchValue({
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie@example.com',
      actif: 1,
    });

    await component.enregistrer();

    expect(component.message()).toBe('Une erreur technique est survenue pendant la modification de l’utilisateur.');
  });
});