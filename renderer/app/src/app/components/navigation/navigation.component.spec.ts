import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { NavigationComponent } from './navigation.component';
import { AuthService, UtilisateurConnecte } from '../../services/auth.service';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let authServiceMock: {
    isLoggedIn: ReturnType<typeof vi.fn>;
    getUtilisateur: ReturnType<typeof vi.fn>;
    hasRole: ReturnType<typeof vi.fn>;
    hasAnyRole: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
  };
  let router: Router;

  beforeEach(async () => {
    authServiceMock = {
      isLoggedIn: vi.fn().mockReturnValue(false),
      getUtilisateur: vi.fn().mockReturnValue(null),
      hasRole: vi.fn().mockReturnValue(false),
      hasAnyRole: vi.fn().mockReturnValue(false),
      logout: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [NavigationComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('devrait afficher le lien Connexion si l’utilisateur n’est pas connecté', () => {
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Connexion');
  });

  it('devrait afficher les liens publics du catalogue', () => {
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Catégories');
    expect(element.textContent).toContain('Espèces');
    expect(element.textContent).toContain('Variétés');
    expect(element.textContent).toContain('Produits');
  });

  it('ne devrait pas afficher les liens protégés si l’utilisateur n’a pas les rôles', () => {
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).not.toContain('Propriétés médicinales');
    expect(element.textContent).not.toContain('Modération des avis');
    expect(element.textContent).not.toContain('Utilisateurs');
  });

  it('devrait afficher les initiales de l’utilisateur connecté', () => {
    const utilisateur: UtilisateurConnecte = {
      id_utilisateur: 1,
      prenom: 'Marie',
      nom: 'Dupont',
      email: 'marie.dupont@example.com',
      roles: ['CLIENT'],
    };

    authServiceMock.isLoggedIn.mockReturnValue(true);
    authServiceMock.getUtilisateur.mockReturnValue(utilisateur);

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('M. D.');
    expect(element.textContent).toContain('Déconnexion');
  });

  it('devrait afficher Propriétés médicinales pour un gestionnaire catalogue', () => {
    authServiceMock.isLoggedIn.mockReturnValue(true);
    authServiceMock.hasAnyRole.mockImplementation((roles: string[]) => {
      return roles.includes('GESTIONNAIRE_CATALOGUE');
    });

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Propriétés médicinales');
  });

  it('devrait afficher Modération des avis pour un modérateur', () => {
    authServiceMock.isLoggedIn.mockReturnValue(true);
    authServiceMock.hasAnyRole.mockImplementation((roles: string[]) => {
      return roles.includes('MODERATEUR');
    });

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Modération des avis');
  });

  it('devrait afficher Utilisateurs pour un administrateur', () => {
    authServiceMock.isLoggedIn.mockReturnValue(true);
    authServiceMock.hasRole.mockImplementation((role: string) => {
      return role === 'ADMIN';
    });

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Utilisateurs');
  });

  it('devrait déconnecter l’utilisateur et rediriger vers la connexion', async () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    component.deconnexion();

    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith('/connexion');
  });
});