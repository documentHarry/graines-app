import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { UtilisateurAdresseModifierComponent } from './utilisateur-adresse-modifier.component';
import { AdresseLivraisonService } from '../../../services/adresse-livraison.service';
import { LocaliteService } from '../../../services/localite.service';
import { UtilisateurService } from '../../../services/utilisateur.service';

describe('UtilisateurAdresseModifierComponent', () => {
  let component: UtilisateurAdresseModifierComponent;
  let fixture: ComponentFixture<UtilisateurAdresseModifierComponent>;

  const adresseLivraisonServiceMock = {
    getMessageErreurChampsObligatoires: vi.fn(),
    getMessageErreurLocalite: vi.fn(),
    construireAdresseLivraisonUpdateInput: vi.fn(),
    updateAdresseLivraison: vi.fn(),
    getMessageErreurEnregistrement: vi.fn(),
  };

  const localiteServiceMock = {
    getLocalites: vi.fn(),
  };

  const utilisateurServiceMock = {
    getUtilisateurById: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [UtilisateurAdresseModifierComponent],
      providers: [
        provideRouter([]),
        {
          provide: AdresseLivraisonService,
          useValue: adresseLivraisonServiceMock,
        },
        {
          provide: LocaliteService,
          useValue: localiteServiceMock,
        },
        {
          provide: UtilisateurService,
          useValue: utilisateurServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UtilisateurAdresseModifierComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});