import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { AromateDetailComponent } from './aromate-detail.component';
import { AromateService } from '../../../services/aromate.service';
import { AuthService } from '../../../services/auth.service';
import { Aromate } from '../../../types/electron';

describe('AromateDetailComponent', () => {
  let component: AromateDetailComponent;
  let fixture: ComponentFixture<AromateDetailComponent>;

  let aromateServiceMock: {
    getAromateById: ReturnType<typeof vi.fn>;
    getProprietesMedicinales: ReturnType<typeof vi.fn>;
  };

  let authServiceMock: {
    hasAnyRole: ReturnType<typeof vi.fn>;
  };

  const aromateMock: Aromate = {
    id_aromate: 1,
    partie_utilisee: 'Feuilles',
    propriete: 'Parfumée',
    usage_culinaire: 'Cuisine',
    variete_id: 1,
    variete: {
      id_variete: 1,
      nom: 'Basilic Genovese',
      descriptif: null,
      bio: 1,
      cycle_jours: null,
      couleur_legume: null,
      taille_fixe_legume: null,
      taille_min_legume: null,
      taille_max_legume: null,
      espacement_entre_les_plants: null,
      espacement_entre_les_lignes: null,
      type_ensoleillement: null,
      type_feuillage: null,
      hauteur_adulte_min: null,
      hauteur_adulte_max: null,
      duree_de_germination: null,
      temperature_min_de_germination: null,
      cycle_de_vie: null,
      rusticite_plante: null,
      date_semis_min: null,
      date_semis_max: null,
      duree_avant_recolte: null,
      type_de_sol: null,
      conseil_plantation: null,
      espece_id: 1,
      espece: {
        id_espece: 1,
        nom_commun: 'Basilic',
        nom_scientifique: 'Ocimum basilicum',
      },
    },
    aromate_propriete: [
      {
        aromate_id: 1,
        propriete_id: 1,
        propriete_medicinale: {
          id_propriete: 1,
          nom_propriete: 'Digestive',
        },
      },
    ],
  } as Aromate;

  beforeEach(async () => {
    aromateServiceMock = {
      getAromateById: vi.fn().mockResolvedValue(aromateMock),
      getProprietesMedicinales: vi.fn().mockReturnValue(['Digestive']),
    };

    authServiceMock = {
      hasAnyRole: vi.fn().mockReturnValue(false),
    };

    await TestBed.configureTestingModule({
      imports: [AromateDetailComponent],
      providers: [
        provideRouter([]),
        { provide: AromateService, useValue: aromateServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AromateDetailComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger un aromate par id', async () => {
    fixture.componentRef.setInput('id', '1');

    await component.chargerAromate();

    expect(aromateServiceMock.getAromateById).toHaveBeenCalledWith(1);
    expect(component.aromate()).toEqual(aromateMock);
    expect(component.message()).toBe('');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si l’identifiant est invalide', async () => {
    fixture.componentRef.setInput('id', 'abc');

    await component.chargerAromate();

    expect(component.message()).toBe('Identifiant de l’aromate invalide.');
    expect(component.isLoading()).toBe(false);
    expect(aromateServiceMock.getAromateById).not.toHaveBeenCalled();
  });

  it('devrait afficher un message si l’aromate est introuvable', async () => {
    aromateServiceMock.getAromateById.mockResolvedValue(null);
    fixture.componentRef.setInput('id', '1');

    await component.chargerAromate();

    expect(component.message()).toBe('Aromate introuvable.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si le chargement échoue', async () => {
    aromateServiceMock.getAromateById.mockRejectedValue(new Error('Erreur test'));
    fixture.componentRef.setInput('id', '1');

    await component.chargerAromate();

    expect(component.message()).toBe('Erreur pendant le chargement de l’aromate.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait retourner les propriétés médicinales', () => {
    component.aromate.set(aromateMock);

    expect(component.getProprietesMedicinales()).toEqual(['Digestive']);
    expect(aromateServiceMock.getProprietesMedicinales).toHaveBeenCalledWith(aromateMock);
  });

  it('devrait retourner une liste vide si aucun aromate n’est chargé', () => {
    component.aromate.set(null);

    expect(component.getProprietesMedicinales()).toEqual([]);
    expect(aromateServiceMock.getProprietesMedicinales).not.toHaveBeenCalled();
  });
});