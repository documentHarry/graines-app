import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { ElectronService } from './electron.service';
import { ElectronAPI } from '../types/electron';

describe('ElectronService', () => {
  let service: ElectronService;

  const apiMock = {
    login: vi.fn(),
  } as unknown as ElectronAPI;

  beforeEach(() => {
    delete (window as any).api;

    TestBed.configureTestingModule({
      providers: [ElectronService],
    });

    service = TestBed.inject(ElectronService);
  });

  afterEach(() => {
    delete (window as any).api;
    vi.clearAllMocks();
  });

  it('devrait créer le service', () => {
    expect(service).toBeTruthy();
  });

  it('devrait retourner false si l’API Electron n’est pas disponible', () => {
    delete (window as any).api;

    expect(service.isElectron()).toBe(false);
  });

  it('devrait retourner true si l’API Electron est disponible', () => {
    (window as any).api = apiMock;

    expect(service.isElectron()).toBe(true);
  });

  it('devrait retourner l’API Electron si elle est disponible', () => {
    (window as any).api = apiMock;

    expect(service.getApi()).toBe(apiMock);
  });

  it('devrait lancer une erreur si l’API Electron n’est pas disponible', () => {
    delete (window as any).api;

    expect(() => service.getApi()).toThrow('API Electron non disponible');
  });
});