import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { UtilisateurAjouterComponent } from './utilisateur-ajouter.component';
import { UtilisateurService } from '../../../services/utilisateur.service';

describe('UtilisateurAjouterComponent', () => {
  let component: UtilisateurAjouterComponent;
  let fixture: ComponentFixture<UtilisateurAjouterComponent>;

  let utilisateurServiceMock: {
    createUtilisateur: ReturnType<typeof vi.fn>;
    construireUtilisateurCreateInput: ReturnType<typeof vi.fn>;
    getMessageErreurCreation: ReturnType<typeof vi.fn>;
  };

  let router: Router;

  beforeEach(async () => {
    utilisateurServiceMock = {
      createUtilisateur: vi.fn().mockResolvedValue(undefined),

      construireUtilisateurCreateInput: vi.fn().mockImplementation((valeurFormulaire) => {
        return {
          nom: valeurFormulaire.nom?.trim() ?? '',
          prenom: valeurFormulaire.prenom?.trim() ?? '',
          email: valeurFormulaire.email?.trim() ?? '',
          mot_de_passe: valeurFormulaire.mot_de_passe ?? '',
        };
      }),

      getMessageErreurCreation: vi.fn().mockReturnValue(
        'Une erreur est survenue pendant la création de l’utilisateur.'
      ),
    };

    await TestBed.configureTestingModule({
      imports: [UtilisateurAjouterComponent],
      providers: [
        provideRouter([]),
        { provide: UtilisateurService, useValue: utilisateurServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(UtilisateurAjouterComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait avoir un formulaire invalide quand les champs obligatoires sont vides', () => {
    component.utilisateurForm.patchValue({
      nom: '',
      prenom: '',
      email: '',
      mot_de_passe: '',
    });

    expect(component.utilisateurForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire invalide quand l’email est invalide', () => {
    component.utilisateurForm.patchValue({
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'email-invalide',
      mot_de_passe: 'secret',
    });

    expect(component.utilisateurForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire valide quand les champs obligatoires sont remplis', () => {
    component.utilisateurForm.patchValue({
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie@example.com',
      mot_de_passe: 'secret',
    });

    expect(component.utilisateurForm.valid).toBe(true);
  });

  it('ne devrait pas enregistrer si le formulaire est invalide', async () => {
    component.utilisateurForm.patchValue({
      nom: '',
      prenom: '',
      email: '',
      mot_de_passe: '',
    });

    await component.enregistrer();

    expect(component.message()).toBe('Veuillez remplir les champs obligatoires.');
    expect(utilisateurServiceMock.construireUtilisateurCreateInput).not.toHaveBeenCalled();
    expect(utilisateurServiceMock.createUtilisateur).not.toHaveBeenCalled();
  });

  it('devrait construire puis créer un utilisateur et rediriger vers la liste', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.utilisateurForm.patchValue({
      nom: ' Dupont ',
      prenom: ' Marie ',
      email: 'marie@example.com',
      mot_de_passe: 'secret',
    });

    await component.enregistrer();

    expect(utilisateurServiceMock.construireUtilisateurCreateInput).toHaveBeenCalledWith({
      nom: ' Dupont ',
      prenom: ' Marie ',
      email: 'marie@example.com',
      mot_de_passe: 'secret',
    });

    expect(utilisateurServiceMock.createUtilisateur).toHaveBeenCalledWith({
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie@example.com',
      mot_de_passe: 'secret',
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/utilisateurs']);
  });

  it('devrait afficher un message si la création échoue', async () => {
    utilisateurServiceMock.createUtilisateur.mockRejectedValue(new Error('Erreur'));

    component.utilisateurForm.patchValue({
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie@example.com',
      mot_de_passe: 'secret',
    });

    await component.enregistrer();

    expect(utilisateurServiceMock.getMessageErreurCreation).toHaveBeenCalled();
    expect(component.message()).toBe(
      'Une erreur est survenue pendant la création de l’utilisateur.'
    );
  });
});