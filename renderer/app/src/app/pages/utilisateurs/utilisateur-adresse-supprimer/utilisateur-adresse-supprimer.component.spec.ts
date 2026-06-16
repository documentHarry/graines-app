import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { UtilisateurAdresseSupprimerComponent } from './utilisateur-adresse-supprimer.component';
import { AdresseLivraisonService } from '../../../services/adresse-livraison.service';
import { UtilisateurService } from '../../../services/utilisateur.service';

describe('UtilisateurAdresseSupprimerComponent', () => {
  let component: UtilisateurAdresseSupprimerComponent;
  let fixture: ComponentFixture<UtilisateurAdresseSupprimerComponent>;

  const adresseLivraisonServiceMock = {
    getAdresseComplete: vi.fn(),
    getLabelAdresseParDefaut: vi.fn(),
    deleteAdresseLivraison: vi.fn(),
    getMessageErreurSuppression: vi.fn(),
  };

  const utilisateurServiceMock = {
    getUtilisateurById: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [UtilisateurAdresseSupprimerComponent],
      providers: [
        provideRouter([]),
        {
          provide: AdresseLivraisonService,
          useValue: adresseLivraisonServiceMock,
        },
        {
          provide: UtilisateurService,
          useValue: utilisateurServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UtilisateurAdresseSupprimerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});