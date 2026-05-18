import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { EspeceSupprimerComponent } from './espece-supprimer.component';

describe('EspeceSupprimerComponent', () => {
  let component: EspeceSupprimerComponent;
  let fixture: ComponentFixture<EspeceSupprimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspeceSupprimerComponent],
      providers: [
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EspeceSupprimerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait retourner 0 quand aucune espèce n’est chargée', () => {
    expect(component.getNombreVarietes()).toBe(0);
  });

  it('devrait retourner le nombre de variétés associées à l’espèce', () => {
    component.espece.set({
      id_espece: 1,
      nom_scientifique: 'Matricaria chamomilla',
      nom_commun: 'Camomille',
      type_plante: 'Plante aromatique',
      _count: {
        variete: 3,
      },
    });

    expect(component.getNombreVarietes()).toBe(3);
  });

  it('devrait retourner 0 quand l’espèce ne possède aucune variété associée', () => {
    component.espece.set({
      id_espece: 1,
      nom_scientifique: 'Matricaria chamomilla',
      nom_commun: 'Camomille',
      type_plante: 'Plante aromatique',
      _count: {
        variete: 0,
      },
    });

    expect(component.getNombreVarietes()).toBe(0);
  });
});