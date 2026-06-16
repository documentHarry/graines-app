import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UtilisateurAdresseLivraisonComponent } from './utilisateur-adresse-livraison.component';
import { AdresseLivraisonService } from '../../../services/adresse-livraison.service';
import { AdresseLivraison } from '../../../types/electron';

describe('UtilisateurAdresseLivraisonComponent', () => {
  let component: UtilisateurAdresseLivraisonComponent;
  let fixture: ComponentFixture<UtilisateurAdresseLivraisonComponent>;

  const adresseMock: AdresseLivraison = {
    id_adresse: 1,
    rue: 'Rue des Lilas',
    numero: '10',
    par_defaut: 1,
    utilisateur_id: 1,
    localite_id: 1,
    localite: {
      id_localite: 1,
      code_postal: '75000',
      localite: 'Paris',
    },
  };

  const adresseLivraisonServiceMock = {
    getAdresseComplete: vi.fn(),
    getLabelAdresseParDefaut: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [UtilisateurAdresseLivraisonComponent],
      providers: [
        provideRouter([]),
        {
          provide: AdresseLivraisonService,
          useValue: adresseLivraisonServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UtilisateurAdresseLivraisonComponent);
    fixture.componentRef.setInput('utilisateurId', 1);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait avoir une liste d’adresses vide par défaut', () => {
    expect(component.adresses()).toEqual([]);
  });

  it('devrait recevoir les adresses en input', () => {
    fixture.componentRef.setInput('adresses', [adresseMock]);

    expect(component.adresses()).toEqual([adresseMock]);
  });

  it('devrait retourner l’adresse complète depuis le service', () => {
    adresseLivraisonServiceMock.getAdresseComplete.mockReturnValue('Rue des Lilas 10');

    expect(component.getAdresseComplete(adresseMock)).toBe('Rue des Lilas 10');
  });

  it('devrait retourner le label adresse par défaut depuis le service', () => {
    adresseLivraisonServiceMock.getLabelAdresseParDefaut.mockReturnValue('Adresse par défaut');

    expect(component.getLabelAdresseParDefaut(adresseMock)).toBe('Adresse par défaut');
  });
});