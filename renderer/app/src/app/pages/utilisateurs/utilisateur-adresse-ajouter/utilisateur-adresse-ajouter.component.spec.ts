import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { UtilisateurAdresseAjouterComponent } from './utilisateur-adresse-ajouter.component';
import { AdresseLivraisonService } from '../../../services/adresse-livraison.service';
import { LocaliteService } from '../../../services/localite.service';
import { UtilisateurService } from '../../../services/utilisateur.service';

describe('UtilisateurAdresseAjouterComponent', () => {
  let component: UtilisateurAdresseAjouterComponent;
  let fixture: ComponentFixture<UtilisateurAdresseAjouterComponent>;

  const adresseLivraisonServiceMock = {
    getMessageErreurChampsObligatoires: vi.fn(),
    getMessageErreurLocalite: vi.fn(),
    construireAdresseLivraisonCreateInput: vi.fn(),
    createAdresseLivraison: vi.fn(),
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
      imports: [UtilisateurAdresseAjouterComponent],
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

    fixture = TestBed.createComponent(UtilisateurAdresseAjouterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});