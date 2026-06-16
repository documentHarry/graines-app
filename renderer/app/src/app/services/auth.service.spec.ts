import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { AuthService, UtilisateurConnecte } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const utilisateurMock: UtilisateurConnecte = {
    id_utilisateur: 1,
    email: 'marie@example.com',
    nom: 'Dupont',
    prenom: 'Marie',
    roles: ['CLIENT', 'ADMIN'],
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
    sessionStorage.clear();
    localStorage.clear();

    (window as any).api = {
      login: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    service.logout();
    sessionStorage.clear();
    localStorage.clear();
    vi.clearAllMocks();
    delete (window as any).api;
  });

  it('devrait créer le service', () => {
    expect(service).toBeTruthy();
  });

  it('devrait connecter un utilisateur avec des identifiants valides', async () => {
    (window as any).api.login.mockResolvedValue(utilisateurMock);

    const result = await service.login('marie@example.com', 'secret');

    expect((window as any).api.login).toHaveBeenCalledWith('marie@example.com', 'secret');
    expect(result).toEqual(utilisateurMock);
    expect(service.getUtilisateur()).toEqual(utilisateurMock);
    expect(sessionStorage.getItem('utilisateur')).toBe(JSON.stringify(utilisateurMock));
  });

  it('devrait retourner null si la connexion échoue', async () => {
    (window as any).api.login.mockResolvedValue(null);

    const result = await service.login('marie@example.com', 'mauvais');

    expect(result).toBeNull();
    expect(service.getUtilisateur()).toBeNull();
    expect(sessionStorage.getItem('utilisateur')).toBeNull();
  });

  it('devrait enregistrer l’utilisateur connecté dans le service et le sessionStorage', () => {
    service.setUtilisateur(utilisateurMock);

    expect(service.getUtilisateur()).toEqual(utilisateurMock);
    expect(sessionStorage.getItem('utilisateur')).toBe(JSON.stringify(utilisateurMock));
  });

  it('devrait récupérer l’utilisateur depuis le sessionStorage', () => {
    sessionStorage.setItem('utilisateur', JSON.stringify(utilisateurMock));

    expect(service.getUtilisateur()).toEqual(utilisateurMock);
  });

  it('devrait retourner null si aucun utilisateur n’est connecté', () => {
    expect(service.getUtilisateur()).toBeNull();
  });

  it('devrait indiquer que l’utilisateur est connecté', () => {
    service.setUtilisateur(utilisateurMock);

    expect(service.isLoggedIn()).toBe(true);
  });

  it('devrait indiquer que l’utilisateur n’est pas connecté', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('devrait retourner true si l’utilisateur possède le rôle demandé', () => {
    service.setUtilisateur(utilisateurMock);

    expect(service.hasRole('ADMIN')).toBe(true);
  });

  it('devrait retourner false si l’utilisateur ne possède pas le rôle demandé', () => {
    service.setUtilisateur(utilisateurMock);

    expect(service.hasRole('MODERATEUR')).toBe(false);
  });

  it('devrait retourner false pour hasRole si aucun utilisateur n’est connecté', () => {
    expect(service.hasRole('ADMIN')).toBe(false);
  });

  it('devrait retourner true si l’utilisateur possède au moins un des rôles demandés', () => {
    service.setUtilisateur(utilisateurMock);

    expect(service.hasAnyRole(['MODERATEUR', 'ADMIN'])).toBe(true);
  });

  it('devrait retourner false si l’utilisateur ne possède aucun des rôles demandés', () => {
    service.setUtilisateur(utilisateurMock);

    expect(service.hasAnyRole(['MODERATEUR', 'GESTIONNAIRE_CATALOGUE'])).toBe(false);
  });

  it('devrait retourner false pour hasAnyRole si aucun utilisateur n’est connecté', () => {
    expect(service.hasAnyRole(['ADMIN'])).toBe(false);
  });

  it('devrait déconnecter l’utilisateur', () => {
    service.setUtilisateur(utilisateurMock);

    service.logout();

    expect(service.getUtilisateur()).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
    expect(sessionStorage.getItem('utilisateur')).toBeNull();
  });
});