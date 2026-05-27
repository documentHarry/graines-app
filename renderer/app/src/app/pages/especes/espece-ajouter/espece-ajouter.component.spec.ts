import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { EspeceAjouterComponent } from './espece-ajouter.component';

describe('EspeceAjouterComponent', () => {
  let component: EspeceAjouterComponent;
  let fixture: ComponentFixture<EspeceAjouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspeceAjouterComponent],
      providers: [
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EspeceAjouterComponent);
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
    });

    expect(component.especeForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire invalide quand le nom commun est vide', () => {
    component.especeForm.patchValue({
      nom_commun: '',
      nom_scientifique: 'Matricaria chamomilla',
    });

    expect(component.especeForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire invalide quand le nom scientifique est vide', () => {
    component.especeForm.patchValue({
      nom_commun: 'Camomille',
      nom_scientifique: '',
    });

    expect(component.especeForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire valide quand les données sont correctes', () => {
    component.especeForm.patchValue({
      nom_commun: 'Camomille',
      nom_scientifique: 'Matricaria chamomilla',
    });

    expect(component.especeForm.valid).toBe(true);
  });
});