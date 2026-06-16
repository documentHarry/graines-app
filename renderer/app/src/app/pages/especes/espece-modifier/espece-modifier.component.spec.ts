import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { EspeceModifierComponent } from './espece-modifier.component';
import { EspeceService } from '../../../services/espece.service';
import { Espece } from '../../../types/electron';

describe('EspeceModifierComponent', () => {
  let component: EspeceModifierComponent;
  let fixture: ComponentFixture<EspeceModifierComponent>;

  let especeServiceMock: {
    getEspeceById: ReturnType<typeof vi.fn>;
    updateEspece: ReturnType<typeof vi.fn>;
    construireEspeceUpdateInput: ReturnType<typeof vi.fn>;
    getMessageErreurModification: ReturnType<typeof vi.fn>;
  };

  let router: Router;

  const especeMock: Espece = {
    id_espece: 1,
    nom_commun: 'Camomille',
    nom_scientifique: 'Matricaria chamomilla',
  } as Espece;

  beforeEach(async () => {
    especeServiceMock = {
      getEspeceById: vi.fn().mockResolvedValue(especeMock),
      updateEspece: vi.fn().mockResolvedValue(undefined),

      construireEspeceUpdateInput: vi.fn().mockImplementation((idEspece, valeurFormulaire) => {
        return {
          id_espece: idEspece,
          nom_commun: valeurFormulaire.nom_commun?.trim() ?? '',
          nom_scientifique: valeurFormulaire.nom_scientifique?.trim() ?? '',
        };
      }),

      getMessageErreurModification: vi.fn().mockImplementation((error: unknown) => {
        const message = String(error);

        if (message.includes('DUPLICATE_ESPECE')) {
          return 'Une espèce avec ce nom commun ou ce nom scientifique existe déjà.';
        }

        return 'Une erreur technique est survenue pendant la modification de l’espèce.';
      }),
    };

    await TestBed.configureTestingModule({
      imports: [EspeceModifierComponent],
      providers: [
        provideRouter([]),
        { provide: EspeceService, useValue: especeServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(EspeceModifierComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger l’espèce', async () => {
    fixture.componentRef.setInput('id', '1');

    await component.chargerEspece();

    expect(especeServiceMock.getEspeceById).toHaveBeenCalledWith(1);
    expect(component.espece()).toEqual(especeMock);
    expect(component.message()).toBe('');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait remplir le formulaire avec l’espèce', async () => {
    fixture.componentRef.setInput('id', '1');

    await component.chargerEspece();

    expect(component.especeForm.getRawValue()).toEqual({
      nom_commun: 'Camomille',
      nom_scientifique: 'Matricaria chamomilla',
    });
  });

  it('devrait afficher un message si l’identifiant est invalide', async () => {
    fixture.componentRef.setInput('id', 'abc');

    await component.chargerEspece();

    expect(component.message()).toBe('Identifiant de l’espèce invalide.');
    expect(component.isLoading()).toBe(false);
    expect(especeServiceMock.getEspeceById).not.toHaveBeenCalled();
  });

  it('devrait afficher un message si l’espèce est introuvable', async () => {
    especeServiceMock.getEspeceById.mockResolvedValue(null);
    fixture.componentRef.setInput('id', '1');

    await component.chargerEspece();

    expect(component.message()).toBe('Espèce introuvable.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si le chargement échoue', async () => {
    especeServiceMock.getEspeceById.mockRejectedValue(new Error('Erreur test'));
    fixture.componentRef.setInput('id', '1');

    await component.chargerEspece();

    expect(component.message()).toBe('Erreur pendant le chargement de l’espèce.');
    expect(component.isLoading()).toBe(false);
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
    component.espece.set(especeMock);

    component.especeForm.patchValue({
      nom_commun: '',
      nom_scientifique: 'Matricaria chamomilla',
    });

    await component.enregistrer();

    expect(component.message()).toBe('Veuillez remplir les champs obligatoires.');
    expect(especeServiceMock.construireEspeceUpdateInput).not.toHaveBeenCalled();
    expect(especeServiceMock.updateEspece).not.toHaveBeenCalled();
  });

  it('ne devrait pas enregistrer si aucune espèce n’est chargée', async () => {
    component.especeForm.patchValue({
      nom_commun: 'Camomille',
      nom_scientifique: 'Matricaria chamomilla',
    });

    await component.enregistrer();

    expect(component.message()).toBe('Veuillez remplir les champs obligatoires.');
    expect(especeServiceMock.construireEspeceUpdateInput).not.toHaveBeenCalled();
    expect(especeServiceMock.updateEspece).not.toHaveBeenCalled();
  });

  it('devrait construire puis modifier l’espèce et rediriger vers la liste', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.espece.set(especeMock);
    component.especeForm.patchValue({
      nom_commun: ' Camomille romaine ',
      nom_scientifique: ' Chamaemelum nobile ',
    });

    await component.enregistrer();

    expect(especeServiceMock.construireEspeceUpdateInput).toHaveBeenCalledWith(
      1,
      {
        nom_commun: ' Camomille romaine ',
        nom_scientifique: ' Chamaemelum nobile ',
      }
    );

    expect(especeServiceMock.updateEspece).toHaveBeenCalledWith({
      id_espece: 1,
      nom_commun: 'Camomille romaine',
      nom_scientifique: 'Chamaemelum nobile',
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/especes']);
  });

  it('devrait afficher un message si l’espèce existe déjà', async () => {
    especeServiceMock.updateEspece.mockRejectedValue('DUPLICATE_ESPECE');

    component.espece.set(especeMock);
    component.especeForm.patchValue({
      nom_commun: 'Camomille',
      nom_scientifique: 'Matricaria chamomilla',
    });

    await component.enregistrer();

    expect(especeServiceMock.getMessageErreurModification).toHaveBeenCalled();
    expect(component.message()).toBe(
      'Une erreur technique est survenue pendant la modification de l’espèce.'
    );
  });

  it('devrait afficher un message si la modification échoue techniquement', async () => {
    const error = new Error('Erreur technique');
    especeServiceMock.updateEspece.mockRejectedValue(error);

    component.espece.set(especeMock);
    component.especeForm.patchValue({
      nom_commun: 'Camomille',
      nom_scientifique: 'Matricaria chamomilla',
    });

    await component.enregistrer();

    expect(especeServiceMock.getMessageErreurModification).toHaveBeenCalled();
    expect(component.message()).toBe('Une erreur technique est survenue pendant la modification de l’espèce.');
  });
});