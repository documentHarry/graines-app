import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { EspeceAjouterComponent } from './espece-ajouter.component';
import { EspeceService } from '../../../services/espece.service';

describe('EspeceAjouterComponent', () => {
  let component: EspeceAjouterComponent;
  let fixture: ComponentFixture<EspeceAjouterComponent>;

  let especeServiceMock: {
    createEspece: ReturnType<typeof vi.fn>;
    construireEspeceCreateInput: ReturnType<typeof vi.fn>;
    getMessageErreurCreation: ReturnType<typeof vi.fn>;
  };

  let router: Router;

  beforeEach(async () => {
    especeServiceMock = {
      createEspece: vi.fn().mockResolvedValue(undefined),

      construireEspeceCreateInput: vi.fn().mockImplementation((valeurFormulaire) => {
        return {
          nom_commun: valeurFormulaire.nom_commun?.trim() ?? '',
          nom_scientifique: valeurFormulaire.nom_scientifique?.trim() ?? '',
        };
      }),

      getMessageErreurCreation: vi.fn().mockImplementation((error: unknown) => {
        const message = String(error);

        if (message.includes('DUPLICATE_ESPECE')) {
          return 'Une espèce avec ce nom commun ou ce nom scientifique existe déjà.';
        }

        return 'Une erreur technique est survenue pendant la création de l’espèce.';
      }),
    };

    await TestBed.configureTestingModule({
      imports: [EspeceAjouterComponent],
      providers: [
        provideRouter([]),
        { provide: EspeceService, useValue: especeServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(EspeceAjouterComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('devrait créer le composant', () => {
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

  it('ne devrait pas enregistrer si le formulaire est invalide', async () => {
    component.especeForm.patchValue({
      nom_commun: '',
      nom_scientifique: '',
    });

    await component.enregistrer();

    expect(component.message()).toBe('Veuillez remplir les champs obligatoires.');
    expect(especeServiceMock.construireEspeceCreateInput).not.toHaveBeenCalled();
    expect(especeServiceMock.createEspece).not.toHaveBeenCalled();
  });

  it('devrait construire puis créer une espèce et rediriger vers la liste', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.especeForm.patchValue({
      nom_commun: ' Camomille ',
      nom_scientifique: ' Matricaria chamomilla ',
    });

    await component.enregistrer();

    expect(especeServiceMock.construireEspeceCreateInput).toHaveBeenCalledWith({
      nom_commun: ' Camomille ',
      nom_scientifique: ' Matricaria chamomilla ',
    });

    expect(especeServiceMock.createEspece).toHaveBeenCalledWith({
      nom_commun: 'Camomille',
      nom_scientifique: 'Matricaria chamomilla',
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/especes']);
  });

  it('devrait afficher un message si l’espèce existe déjà', async () => {
    especeServiceMock.createEspece.mockRejectedValue('DUPLICATE_ESPECE');

    component.especeForm.patchValue({
      nom_commun: 'Camomille',
      nom_scientifique: 'Matricaria chamomilla',
    });

    await component.enregistrer();

    expect(especeServiceMock.getMessageErreurCreation).toHaveBeenCalled();
    expect(component.message()).toBe(
      'Une erreur technique est survenue pendant la création de l’espèce.'
    );
  });

  it('devrait afficher un message si la création échoue techniquement', async () => {
    const error = new Error('Erreur technique');
    especeServiceMock.createEspece.mockRejectedValue(error);

    component.especeForm.patchValue({
      nom_commun: 'Camomille',
      nom_scientifique: 'Matricaria chamomilla',
    });

    await component.enregistrer();

    expect(especeServiceMock.getMessageErreurCreation).toHaveBeenCalled();
    expect(component.message()).toBe(
      'Une erreur technique est survenue pendant la création de l’espèce.'
    );
  });
});