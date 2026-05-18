import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { EspecesComponent } from './especes.component';
import { EspeceService } from '../../services/espece.service';
import { Espece } from '../../types/electron';

describe('EspecesComponent', () => {
  let component: EspecesComponent;
  let fixture: ComponentFixture<EspecesComponent>;

  const especesTest: Espece[] = [
    {
      id_espece: 1,
      nom_scientifique: 'Matricaria chamomilla',
      nom_commun: 'Camomille',
      type_plante: 'Plante aromatique',
      _count: {
        variete: 2,
      },
    },
    {
      id_espece: 2,
      nom_scientifique: 'Solanum lycopersicum',
      nom_commun: 'Tomate',
      type_plante: 'Légume fruit',
      _count: {
        variete: 5,
      },
    },
  ];

  const especeServiceMock = {
    getEspeces: () => Promise.resolve(especesTest),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspecesComponent],
      providers: [
        provideRouter([]),
        {
          provide: EspeceService,
          useValue: especeServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EspecesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger les espèces depuis le service', async () => {
    await component.chargerEspeces();

    expect(component.especes().length).toBe(2);
    expect(component.especes()[0].nom_commun).toBe('Camomille');
    expect(component.isLoading()).toBe(false);
    expect(component.message()).toBe('');
  });

  it('devrait afficher un message d’erreur si le chargement échoue', async () => {
    const service = TestBed.inject(EspeceService);

    service.getEspeces = () => Promise.reject();

    await component.chargerEspeces();

    expect(component.message()).toBe('Erreur pendant le chargement des espèces.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait retourner le nombre de variétés associées à une espèce', () => {
    const nombreVarietes = component.getNombreVarietes(especesTest[0]);

    expect(nombreVarietes).toBe(2);
  });

  it('devrait retourner 0 si le compteur de variétés est absent', () => {
    const especeSansCompteur: Espece = {
      id_espece: 3,
      nom_scientifique: 'Ocimum basilicum',
      nom_commun: 'Basilic',
      type_plante: 'Plante aromatique',
    };

    const nombreVarietes = component.getNombreVarietes(especeSansCompteur);

    expect(nombreVarietes).toBe(0);
  });
});