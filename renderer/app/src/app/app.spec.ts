import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { App } from './app';
import { AuthService } from './services/auth.service';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let authServiceMock: {
    isLoggedIn: ReturnType<typeof vi.fn>;
    getUtilisateur: ReturnType<typeof vi.fn>;
    hasRole: ReturnType<typeof vi.fn>;
    hasAnyRole: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authServiceMock = {
      isLoggedIn: vi.fn().mockReturnValue(false),
      getUtilisateur: vi.fn().mockReturnValue(null),
      hasRole: vi.fn().mockReturnValue(false),
      hasAnyRole: vi.fn().mockReturnValue(false),
      logout: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('devrait afficher la navigation publique principale', () => {
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Connexion');
    expect(element.textContent).toContain('Catégories');
    expect(element.textContent).toContain('Produits');
    expect(element.textContent).toContain('Espèces');
    expect(element.textContent).toContain('Variétés');

    expect(element.textContent).not.toContain('Utilisateurs');
    expect(element.textContent).not.toContain('Modération des avis');
    expect(element.textContent).not.toContain('Propriétés médicinales');
  });

  it('devrait afficher le lien Utilisateurs pour un administrateur', () => {
    authServiceMock.isLoggedIn.mockReturnValue(true);
    authServiceMock.hasRole.mockImplementation((role: string) => {
      return role === 'ADMIN';
    });

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Utilisateurs');
  });
});