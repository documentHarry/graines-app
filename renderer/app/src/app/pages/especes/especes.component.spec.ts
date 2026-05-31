import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { EspecesComponent } from './especes.component';
import { EspeceService } from '../../services/espece.service';
import { AuthService } from '../../services/auth.service';
import { Espece } from '../../types/electron';

describe('EspecesComponent', () => {
  let component: EspecesComponent;
  let fixture: ComponentFixture<EspecesComponent>;

  let especeServiceMock: {
    getEspeces: ReturnType<typeof vi.fn>;
  };

  let authServiceMock: {
    hasAnyRole: ReturnType<typeof vi.fn>;
  };

  const especesTest: Espece[] = [
    {
      id_espece: 1,
      nom_scientifique: 'Matricaria chamomilla',
      nom_commun: 'Camomille',
      _count: {
        variete: 2,
      },
    } as Espece,
    {
      id_espece: 2,
      nom_scientifique: 'Solanum lycopersicum',
      nom_commun: 'Tomate',
      _count: {
        variete: 5,
      },
    } as Espece,
  ];

  beforeEach(async () => {
    especeServiceMock = {
      getEspeces: vi.fn().mockResolvedValue(especesTest),
    };

    authServiceMock = {
      hasAnyRole: vi.fn().mockReturnValue(false),
    };

    await TestBed.configureTestingModule({
      imports: [EspecesComponent],
      providers: [
        provideRouter([]),
        { provide: EspeceService, useValue: especeServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EspecesComponent);
    component = fixture.componentInstance;

    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger les espèces depuis le service', () => {
    expect(especeServiceMock.getEspeces).toHaveBeenCalled();
    expect(component.especes()).toEqual(especesTest);
    expect(component.isLoading()).toBe(false);
    expect(component.message()).toBe('');
  });

  it('devrait afficher un message d’erreur si le chargement échoue', async () => {
    especeServiceMock.getEspeces.mockRejectedValue(new Error('Erreur test'));

    await component.chargerEspeces();

    expect(component.message()).toBe('Erreur pendant le chargement des espèces.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait filtrer les espèces par nom commun', () => {
    component.rechercheNomCommun.set('camo');

    expect(component.especesFiltrees()).toEqual([especesTest[0]]);
  });

  it('devrait filtrer les espèces par nom scientifique', () => {
    component.rechercheNomScientifique.set('solanum');

    expect(component.especesFiltrees()).toEqual([especesTest[1]]);
  });

  it('devrait retourner toutes les espèces si les recherches sont vides', () => {
    expect(component.especesFiltrees()).toEqual(especesTest);
  });

  it('devrait mettre à jour la recherche par nom commun', () => {
    const event = {
      target: { value: 'tomate' },
    } as unknown as Event;

    component.changerRechercheNomCommun(event);

    expect(component.rechercheNomCommun()).toBe('tomate');
  });

  it('devrait mettre à jour la recherche par nom scientifique', () => {
    const event = {
      target: { value: 'solanum' },
    } as unknown as Event;

    component.changerRechercheNomScientifique(event);

    expect(component.rechercheNomScientifique()).toBe('solanum');
  });

  it('devrait retourner le nombre de variétés associées à une espèce', () => {
    expect(component.getNombreVarietes(especesTest[0])).toBe(2);
  });

  it('devrait retourner 0 si le compteur de variétés est absent', () => {
    const especeSansCompteur: Espece = {
      id_espece: 3,
      nom_scientifique: 'Ocimum basilicum',
      nom_commun: 'Basilic',
    } as Espece;

    expect(component.getNombreVarietes(especeSansCompteur)).toBe(0);
  });
});