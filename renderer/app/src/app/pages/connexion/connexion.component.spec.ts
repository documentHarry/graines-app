import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { vi } from 'vitest';

import { ConnexionComponent } from './connexion.component';
import { AuthService, UtilisateurConnecte } from '../../services/auth.service';

describe('ConnexionComponent', () => {
  let component: ConnexionComponent;
  let fixture: ComponentFixture<ConnexionComponent>;

  let authServiceMock: {
    login: ReturnType<typeof vi.fn>;
    construireIdentifiantsConnexion: ReturnType<typeof vi.fn>;
    getMessageErreurFormulaireConnexion: ReturnType<typeof vi.fn>;
    getMessageErreurIdentifiants: ReturnType<typeof vi.fn>;
    getMessageErreurConnexion: ReturnType<typeof vi.fn>;
  };

  let routerMock: {
    navigateByUrl: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authServiceMock = {
      login: vi.fn(),

      construireIdentifiantsConnexion: vi.fn().mockImplementation((valeurFormulaire) => {
        return {
          email: valeurFormulaire.email?.trim() ?? '',
          mot_de_passe: valeurFormulaire.mot_de_passe ?? '',
        };
      }),

      getMessageErreurFormulaireConnexion: vi.fn().mockReturnValue(
        'Veuillez remplir correctement les champs.'
      ),

      getMessageErreurIdentifiants: vi.fn().mockReturnValue(
        'Email ou mot de passe incorrect.'
      ),

      getMessageErreurConnexion: vi.fn().mockReturnValue(
        'Une erreur est survenue pendant la connexion.'
      ),
    };

    routerMock = {
      navigateByUrl: vi.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [ConnexionComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: vi.fn().mockReturnValue(null),
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnexionComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('devrait créer le composant', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('devrait créer le formulaire avec les champs vides', () => {
    expect(component.connexionForm.getRawValue()).toEqual({
      email: '',
      mot_de_passe: '',
    });
  });

  it('devrait rendre le formulaire invalide si les champs sont vides', async () => {
    await component.seConnecter();

    expect(component.connexionForm.invalid).toBe(true);
    expect(authServiceMock.getMessageErreurFormulaireConnexion).toHaveBeenCalled();
    expect(component.messageErreur).toBe('Veuillez remplir correctement les champs.');
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('devrait refuser un email invalide', async () => {
    component.connexionForm.setValue({
      email: 'mauvais-email',
      mot_de_passe: 'secret',
    });

    await component.seConnecter();

    expect(component.connexionForm.invalid).toBe(true);
    expect(authServiceMock.getMessageErreurFormulaireConnexion).toHaveBeenCalled();
    expect(component.messageErreur).toBe('Veuillez remplir correctement les champs.');
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('devrait afficher une erreur si les identifiants sont incorrects', async () => {
    authServiceMock.login.mockResolvedValue(null);

    component.connexionForm.setValue({
      email: 'test@example.com',
      mot_de_passe: 'mauvais',
    });

    await component.seConnecter();

    expect(authServiceMock.construireIdentifiantsConnexion).toHaveBeenCalledWith({
      email: 'test@example.com',
      mot_de_passe: 'mauvais',
    });

    expect(authServiceMock.login).toHaveBeenCalledWith('test@example.com', 'mauvais');
    expect(authServiceMock.getMessageErreurIdentifiants).toHaveBeenCalled();
    expect(component.messageErreur).toBe('Email ou mot de passe incorrect.');
    expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
  });

  it('devrait connecter l’utilisateur et rediriger vers la page demandée', async () => {
    const utilisateur: UtilisateurConnecte = {
      id_utilisateur: 1,
      email: 'admin@example.com',
      nom: 'Admin',
      prenom: 'Alice',
      roles: ['ADMIN'],
    };

    authServiceMock.login.mockResolvedValue(utilisateur);

    const route = TestBed.inject(ActivatedRoute);
    vi.mocked(route.snapshot.queryParamMap.get).mockReturnValue('/produits');

    component.connexionForm.setValue({
      email: 'admin@example.com',
      mot_de_passe: 'secret',
    });

    await component.seConnecter();

    expect(authServiceMock.construireIdentifiantsConnexion).toHaveBeenCalledWith({
      email: 'admin@example.com',
      mot_de_passe: 'secret',
    });

    expect(authServiceMock.login).toHaveBeenCalledWith('admin@example.com', 'secret');
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/produits');
  });

  it('devrait rediriger vers la racine si aucun returnUrl n’est présent', async () => {
    const utilisateur: UtilisateurConnecte = {
      id_utilisateur: 1,
      email: 'admin@example.com',
      nom: 'Admin',
      prenom: 'Alice',
      roles: ['ADMIN'],
    };

    authServiceMock.login.mockResolvedValue(utilisateur);

    component.connexionForm.setValue({
      email: 'admin@example.com',
      mot_de_passe: 'secret',
    });

    await component.seConnecter();

    expect(authServiceMock.login).toHaveBeenCalledWith('admin@example.com', 'secret');
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('devrait afficher une erreur si le service de connexion échoue', async () => {
    authServiceMock.login.mockRejectedValue(new Error('Erreur test'));

    component.connexionForm.setValue({
      email: 'test@example.com',
      mot_de_passe: 'secret',
    });

    await component.seConnecter();

    expect(authServiceMock.getMessageErreurConnexion).toHaveBeenCalled();
    expect(component.messageErreur).toBe('Une erreur est survenue pendant la connexion.');
  });
});