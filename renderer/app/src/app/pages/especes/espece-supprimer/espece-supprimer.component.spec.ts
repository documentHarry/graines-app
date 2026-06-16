import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { EspeceSupprimerComponent } from './espece-supprimer.component';
import { EspeceService } from '../../../services/espece.service';
import { Espece } from '../../../types/electron';

describe('EspeceSupprimerComponent', () => {
  let component: EspeceSupprimerComponent;
  let fixture: ComponentFixture<EspeceSupprimerComponent>;

  let especeServiceMock: {
    getEspeceById: ReturnType<typeof vi.fn>;
    deleteEspece: ReturnType<typeof vi.fn>;
    getNombreVarietes: ReturnType<typeof vi.fn>;
    getMessageErreurSuppression: ReturnType<typeof vi.fn>;
  };

  let router: Router;

  const especeMock: Espece = {
    id_espece: 1,
    nom_scientifique: 'Matricaria chamomilla',
    nom_commun: 'Camomille',
    _count: {
      variete: 3,
    },
  } as Espece;

  beforeEach(async () => {
    especeServiceMock = {
      getEspeceById: vi.fn().mockResolvedValue(especeMock),
      deleteEspece: vi.fn().mockResolvedValue(undefined),

      getNombreVarietes: vi.fn().mockImplementation((espece: Espece | null) => {
        return espece?._count?.variete ?? 0;
      }),

      getMessageErreurSuppression: vi.fn().mockImplementation((error: unknown) => {
        const message = String(error);

        if (message.includes('ESPECE_HAS_VARIETES')) {
          return 'Cette espèce possède des variétés associées. Elle ne peut pas être supprimée.';
        }

        return 'Une erreur est survenue pendant la suppression de l’espèce.';
      }),
    };

    await TestBed.configureTestingModule({
      imports: [EspeceSupprimerComponent],
      providers: [
        provideRouter([]),
        { provide: EspeceService, useValue: especeServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(EspeceSupprimerComponent);
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

  it('devrait retourner 0 quand aucune espèce n’est chargée', () => {
    expect(component.getNombreVarietes()).toBe(0);
    expect(especeServiceMock.getNombreVarietes).toHaveBeenCalledWith(null);
  });

  it('devrait retourner le nombre de variétés associées à l’espèce', () => {
    component.espece.set(especeMock);

    expect(component.getNombreVarietes()).toBe(3);
    expect(especeServiceMock.getNombreVarietes).toHaveBeenCalledWith(especeMock);
  });

  it('devrait retourner 0 quand l’espèce ne possède aucune variété associée', () => {
    const especeSansVarietes = {
      ...especeMock,
      _count: {
        variete: 0,
      },
    } as Espece;

    component.espece.set(especeSansVarietes);

    expect(component.getNombreVarietes()).toBe(0);
    expect(especeServiceMock.getNombreVarietes).toHaveBeenCalledWith(especeSansVarietes);
  });

  it('ne devrait pas supprimer si aucune espèce n’est chargée', async () => {
    await component.supprimerEspece();

    expect(especeServiceMock.deleteEspece).not.toHaveBeenCalled();
  });

  it('ne devrait pas supprimer si la confirmation est annulée', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.espece.set(especeMock);

    await component.supprimerEspece();

    expect(confirmSpy).toHaveBeenCalledWith('Voulez-vous vraiment supprimer cette espèce ?');
    expect(especeServiceMock.deleteEspece).not.toHaveBeenCalled();
  });

  it('devrait supprimer l’espèce et rediriger vers la liste', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.espece.set(especeMock);

    await component.supprimerEspece();

    expect(confirmSpy).toHaveBeenCalledWith('Voulez-vous vraiment supprimer cette espèce ?');
    expect(especeServiceMock.deleteEspece).toHaveBeenCalledWith(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/especes']);
  });

  it('devrait afficher un message si l’espèce possède des variétés', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    especeServiceMock.deleteEspece.mockRejectedValue('ESPECE_HAS_VARIETES');

    component.espece.set(especeMock);

    await component.supprimerEspece();

    expect(especeServiceMock.getMessageErreurSuppression).toHaveBeenCalledWith('ESPECE_HAS_VARIETES');
    expect(component.message()).toBe(
      'Cette espèce possède des variétés associées. Elle ne peut pas être supprimée.'
    );
  });

  it('devrait afficher un message si la suppression échoue techniquement', async () => {
    const error = new Error('Erreur technique');
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    especeServiceMock.deleteEspece.mockRejectedValue(error);

    component.espece.set(especeMock);

    await component.supprimerEspece();

    expect(especeServiceMock.getMessageErreurSuppression).toHaveBeenCalledWith(error);
    expect(component.message()).toBe('Une erreur est survenue pendant la suppression de l’espèce.');
  });

  it('devrait annuler et retourner à la liste des espèces', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    await component.annuler();

    expect(navigateSpy).toHaveBeenCalledWith(['/especes']);
  });
});