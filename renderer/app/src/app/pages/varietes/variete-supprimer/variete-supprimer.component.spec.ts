import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { VarieteSupprimerComponent } from './variete-supprimer.component';
import { VarieteService } from '../../../services/variete.service';
import { Variete } from '../../../types/electron';

describe('VarieteSupprimerComponent', () => {
  let component: VarieteSupprimerComponent;
  let fixture: ComponentFixture<VarieteSupprimerComponent>;
  let varieteServiceMock: {
    getVarieteById: ReturnType<typeof vi.fn>;
    deleteVariete: ReturnType<typeof vi.fn>;
    getNombreProduits: ReturnType<typeof vi.fn>;
    getMessageErreurSuppression: ReturnType<typeof vi.fn>;
  };
  let router: Router;

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
    conseil_plantation: null,
    espece_id: 1,
    espece: {
      id_espece: 1,
      nom_scientifique: 'Solanum lycopersicum',
      nom_commun: 'Tomate',
    },
    _count: {
      produit: 4,
    },
  } as Variete;



  beforeEach(async () => {
    varieteServiceMock = {
      getVarieteById: vi.fn().mockResolvedValue(varieteMock),
      deleteVariete: vi.fn().mockResolvedValue(undefined),

      getNombreProduits: vi.fn().mockImplementation((variete: Variete | null) => {
        return variete?._count?.produit ?? 0;
      }),

      getMessageErreurSuppression: vi.fn().mockImplementation((error: unknown) => {
        const message = String(error);

        if (message.includes('VARIETE_HAS_PRODUCTS')) {
          return 'Cette variété possède des produits associés. Elle ne peut pas être supprimée.';
        }

        return 'Une erreur est survenue pendant la suppression de la variété.';
      }),
    };

    await TestBed.configureTestingModule({
      imports: [VarieteSupprimerComponent],
      providers: [
        provideRouter([]),
        { provide: VarieteService, useValue: varieteServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(VarieteSupprimerComponent);
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

  it('devrait retourner 0 quand aucune variété n’est chargée', () => {
    expect(component.getNombreProduits()).toBe(0);
  });

  it('devrait retourner le nombre de produits associés à la variété', () => {
    component.variete.set(varieteMock);

    expect(component.getNombreProduits()).toBe(4);
  });

  it('devrait retourner 0 quand la variété ne possède aucun produit associé', () => {
    component.variete.set({
      ...varieteMock,
      _count: {
        produit: 0,
      },
    } as Variete);

    expect(component.getNombreProduits()).toBe(0);
  });

  it('ne devrait pas supprimer si aucune variété n’est chargée', async () => {
    await component.supprimerVariete();

    expect(varieteServiceMock.deleteVariete).not.toHaveBeenCalled();
  });

  it('ne devrait pas supprimer si la confirmation est annulée', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.variete.set(varieteMock);

    await component.supprimerVariete();

    expect(confirmSpy).toHaveBeenCalledWith('Voulez-vous vraiment supprimer cette variété ?');
    expect(varieteServiceMock.deleteVariete).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('devrait supprimer la variété et rediriger vers la liste', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.variete.set(varieteMock);

    await component.supprimerVariete();

    expect(varieteServiceMock.deleteVariete).toHaveBeenCalledWith(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/varietes']);

    confirmSpy.mockRestore();
  });

  it('devrait afficher un message si la variété possède des produits', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    varieteServiceMock.deleteVariete.mockRejectedValue('VARIETE_HAS_PRODUCTS');

    component.variete.set(varieteMock);

    await component.supprimerVariete();

    expect(component.message()).toBe('Cette variété possède des produits associés. Elle ne peut pas être supprimée.');
  });

  it('devrait afficher un message si la suppression échoue techniquement', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    varieteServiceMock.deleteVariete.mockRejectedValue(new Error('Erreur technique'));

    component.variete.set(varieteMock);

    await component.supprimerVariete();

    expect(component.message()).toBe('Une erreur est survenue pendant la suppression de la variété.');
  });

  it('devrait annuler et retourner au détail de la variété', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.variete.set(varieteMock);

    await component.annuler();

    expect(navigateSpy).toHaveBeenCalledWith(['/varietes', 1]);
  });
});