import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { VarieteDetailComponent } from './variete-detail.component';
import { VarieteService } from '../../../services/variete.service';
import { AuthService } from '../../../services/auth.service';
import { Aromate, Variete } from '../../../types/electron';

describe('VarieteDetailComponent', () => {
  let component: VarieteDetailComponent;
  let fixture: ComponentFixture<VarieteDetailComponent>;

  let varieteServiceMock: {
    getVarieteById: ReturnType<typeof vi.fn>;
    getLabelBio: ReturnType<typeof vi.fn>;
    getNombreProduits: ReturnType<typeof vi.fn>;
    getConseilsPlantation: ReturnType<typeof vi.fn>;
  };

  let authServiceMock: {
    hasAnyRole: ReturnType<typeof vi.fn>;
  };

  const varieteMock: Variete = {
    id_variete: 1,
    nom: 'Marmande',
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
    conseil_plantation: 'Semer en godet. Repiquer après les gelées.',
    espece_id: 1,
    espece: {
      id_espece: 1,
      nom_scientifique: 'Solanum lycopersicum',
      nom_commun: 'Tomate',
    },
    _count: {
      produit: 4,
    }
  } as Variete;

  beforeEach(async () => {
    varieteServiceMock = {
      getVarieteById: vi.fn().mockResolvedValue(varieteMock),

      getLabelBio: vi.fn().mockImplementation((variete: Variete | null) => {
        return variete?.bio === 1 ? 'Bio' : 'Non bio';
      }),

      getNombreProduits: vi.fn().mockImplementation((variete: Variete | null) => {
        return variete?._count?.produit ?? 0;
      }),

      getConseilsPlantation: vi.fn().mockImplementation((variete: Variete | null) => {
        const conseil = variete?.conseil_plantation;

        if (!conseil) {
          return [];
        }

        return conseil
          .split('.')
          .map(phrase => phrase.trim())
          .filter(phrase => phrase.length > 0)
          .map(phrase => phrase + '.');
      }),
    };

    authServiceMock = {
      hasAnyRole: vi.fn().mockReturnValue(false),
    };

    await TestBed.configureTestingModule({
      imports: [VarieteDetailComponent],
      providers: [
        provideRouter([]),
        { provide: VarieteService, useValue: varieteServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VarieteDetailComponent);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger la variété', async () => {
    fixture.componentRef.setInput('id', '1');

    await component.chargerVariete();

    expect(varieteServiceMock.getVarieteById).toHaveBeenCalledWith(1);
    expect(component.variete()).toEqual(varieteMock);
    expect(component.message()).toBe('');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si l’identifiant est invalide', async () => {
    fixture.componentRef.setInput('id', 'abc');

    await component.chargerVariete();

    expect(component.message()).toBe('Identifiant de la variété invalide.');
    expect(component.isLoading()).toBe(false);
    expect(varieteServiceMock.getVarieteById).not.toHaveBeenCalled();
  });

  it('devrait afficher un message si la variété est introuvable', async () => {
    varieteServiceMock.getVarieteById.mockResolvedValue(null);
    fixture.componentRef.setInput('id', '1');

    await component.chargerVariete();

    expect(component.message()).toBe('Variété introuvable.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si le chargement échoue', async () => {
    varieteServiceMock.getVarieteById.mockRejectedValue(new Error('Erreur test'));
    fixture.componentRef.setInput('id', '1');

    await component.chargerVariete();

    expect(component.message()).toBe('Erreur pendant le chargement de la variété.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher Bio quand la variété est bio', () => {
    component.variete.set(varieteMock);

    expect(component.getLabelBio()).toBe('Bio');
  });

  it('devrait afficher Non bio quand la variété n’est pas bio', () => {
    component.variete.set({
      ...varieteMock,
      bio: 0,
    } as Variete);

    expect(component.getLabelBio()).toBe('Non bio');
  });

  it('devrait retourner le nombre de produits associés à la variété', () => {
    component.variete.set(varieteMock);

    expect(component.getNombreProduits()).toBe(4);
  });

  it('devrait retourner 0 si aucun compteur de produits n’est disponible', () => {
    component.variete.set({
      ...varieteMock,
      _count: undefined,
    } as Variete);

    expect(component.getNombreProduits()).toBe(0);
  });

  it('devrait découper les conseils de plantation en plusieurs phrases', () => {
    component.variete.set(varieteMock);

    expect(component.getConseilsPlantation()).toEqual([
      'Semer en godet.',
      'Repiquer après les gelées.',
    ]);
  });

  it('devrait retourner une liste vide quand aucun conseil de plantation n’est renseigné', () => {
    component.variete.set({
      ...varieteMock,
      conseil_plantation: null,
    } as Variete);

    expect(component.getConseilsPlantation()).toEqual([]);
  });

});