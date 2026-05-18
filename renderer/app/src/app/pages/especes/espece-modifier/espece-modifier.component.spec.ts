import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { EspeceModifierComponent } from './espece-modifier.component';

describe('EspeceModifierComponent', () => {
  let component: EspeceModifierComponent;
  let fixture: ComponentFixture<EspeceModifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspeceModifierComponent],
      providers: [
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EspeceModifierComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait avoir un formulaire invalide quand les champs obligatoires sont vides', () => {
    component.especeForm.patchValue({
      nom_commun: '',
      nom_scientifique: '',
      type_plante: '',
    });

    expect(component.especeForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire invalide quand le nom commun est vide', () => {
    component.especeForm.patchValue({
      nom_commun: '',
      nom_scientifique: 'Matricaria chamomilla',
      type_plante: 'Plante aromatique',
    });

    expect(component.especeForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire invalide quand le nom scientifique est vide', () => {
    component.especeForm.patchValue({
      nom_commun: 'Camomille',
      nom_scientifique: '',
      type_plante: 'Plante aromatique',
    });

    expect(component.especeForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire invalide quand le type de plante est vide', () => {
    component.especeForm.patchValue({
      nom_commun: 'Camomille',
      nom_scientifique: 'Matricaria chamomilla',
      type_plante: '',
    });

    expect(component.especeForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire valide quand les données sont correctes', () => {
    component.especeForm.patchValue({
      nom_commun: 'Camomille',
      nom_scientifique: 'Matricaria chamomilla',
      type_plante: 'Plante aromatique',
    });

    expect(component.especeForm.valid).toBe(true);
  });
});