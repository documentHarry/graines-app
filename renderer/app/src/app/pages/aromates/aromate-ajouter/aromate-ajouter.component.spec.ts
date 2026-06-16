import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { AromateAjouterComponent } from './aromate-ajouter.component';
import { AromateService } from '../../../services/aromate.service';
import { ProprieteMedicinaleService } from '../../../services/propriete-medicinale.service';
import { VarieteService } from '../../../services/variete.service';
import { Aromate, AromateCreateInput, ProprieteMedicinale, Variete } from '../../../types/electron';

describe('AromateAjouterComponent', () => {
  let component: AromateAjouterComponent;
  let fixture: ComponentFixture<AromateAjouterComponent>;
  let router: Router;

  let aromateServiceMock: {
    createAromate: ReturnType<typeof vi.fn>;
    construireAromateCreateInput: ReturnType<typeof vi.fn>;
    getMessageErreurCreation: ReturnType<typeof vi.fn>;
  };

  let proprieteMedicinaleServiceMock: {
    getProprietesMedicinales: ReturnType<typeof vi.fn>;
  };

  let varieteServiceMock: {
    getVarietes: ReturnType<typeof vi.fn>;
  };

  const varietesMock: Variete[] = [
    {
      id_variete: 1,
      nom: 'Basilic Genovese',
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
        nom_commun: 'Basilic',
        nom_scientifique: 'Ocimum basilicum',
      },
      _count: {
        produit: 0,
      },
    } as Variete,
  ];

  const proprietesMedicinalesMock: ProprieteMedicinale[] = [
    {
      id_propriete: 1,
      nom_propriete: 'Digestive',
    },
    {
      id_propriete: 2,
      nom_propriete: 'Antioxydante',
    },
  ];

  const aromateMock: Aromate = {
    id_aromate: 1,
    partie_utilisee: 'Feuilles',
    propriete: 'Parfumée',
    usage_culinaire: 'Cuisine',
    variete_id: 1,
    aromate_propriete: [],
  };

  beforeEach(async () => {
    aromateServiceMock = {
      createAromate: vi.fn().mockResolvedValue(aromateMock),

      construireAromateCreateInput: vi.fn().mockImplementation((
        valeurFormulaire: {
          variete_id: number | null;
          partie_utilisee: string | null;
          propriete: string | null;
          usage_culinaire: string | null;
        },
        proprietesIds: number[]
      ): AromateCreateInput => {
        return {
          variete_id: Number(valeurFormulaire.variete_id),
          partie_utilisee: valeurFormulaire.partie_utilisee?.trim() || null,
          propriete: valeurFormulaire.propriete?.trim() || null,
          usage_culinaire: valeurFormulaire.usage_culinaire?.trim() || null,
          proprietes_ids: proprietesIds,
        };
      }),

      getMessageErreurCreation: vi.fn().mockReturnValue(
        'Une erreur est survenue pendant la création de l’aromate.'
      ),
    };

    proprieteMedicinaleServiceMock = {
      getProprietesMedicinales: vi.fn().mockResolvedValue(proprietesMedicinalesMock),
    };

    varieteServiceMock = {
      getVarietes: vi.fn().mockResolvedValue(varietesMock),
    };

    await TestBed.configureTestingModule({
      imports: [AromateAjouterComponent],
      providers: [
        provideRouter([]),
        { provide: AromateService, useValue: aromateServiceMock },
        { provide: ProprieteMedicinaleService, useValue: proprieteMedicinaleServiceMock },
        { provide: VarieteService, useValue: varieteServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AromateAjouterComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger les variétés et les propriétés médicinales', async () => {
    await component.chargerDonnees();

    expect(varieteServiceMock.getVarietes).toHaveBeenCalled();
    expect(proprieteMedicinaleServiceMock.getProprietesMedicinales).toHaveBeenCalled();
    expect(component.varietes()).toEqual(varietesMock);
    expect(component.proprietesMedicinales()).toEqual(proprietesMedicinalesMock);
    expect(component.message()).toBe('');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si le chargement échoue', async () => {
    varieteServiceMock.getVarietes.mockRejectedValue(new Error('Erreur test'));

    await component.chargerDonnees();

    expect(component.message()).toBe('Erreur pendant le chargement des données.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait avoir un formulaire invalide si aucune variété n’est sélectionnée', () => {
    component.aromateForm.patchValue({
      variete_id: 0,
      partie_utilisee: 'Feuilles',
      propriete: 'Parfumée',
      usage_culinaire: 'Cuisine',
    });

    expect(component.aromateForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire valide si la variété est sélectionnée', () => {
    component.aromateForm.patchValue({
      variete_id: 1,
      partie_utilisee: '',
      propriete: '',
      usage_culinaire: '',
    });

    expect(component.aromateForm.valid).toBe(true);
  });

  it('devrait ajouter une propriété sélectionnée', () => {
    const event = {
      target: { checked: true },
    } as unknown as Event;

    component.changerPropriete(event, 1);

    expect(component.proprietesSelectionnees()).toEqual([1]);
  });

  it('devrait retirer une propriété sélectionnée', () => {
    component.proprietesSelectionnees.set([1, 2]);

    const event = {
      target: { checked: false },
    } as unknown as Event;

    component.changerPropriete(event, 1);

    expect(component.proprietesSelectionnees()).toEqual([2]);
  });

  it('ne devrait pas enregistrer si le formulaire est invalide', async () => {
    component.aromateForm.patchValue({
      variete_id: 0,
      partie_utilisee: 'Feuilles',
      propriete: 'Parfumée',
      usage_culinaire: 'Cuisine',
    });

    await component.enregistrer();

    expect(component.message()).toBe('Veuillez remplir les champs obligatoires.');
    expect(aromateServiceMock.construireAromateCreateInput).not.toHaveBeenCalled();
    expect(aromateServiceMock.createAromate).not.toHaveBeenCalled();
  });

  it('devrait créer un aromate et rediriger vers la liste', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.proprietesSelectionnees.set([1, 2]);

    component.aromateForm.patchValue({
      variete_id: 1,
      partie_utilisee: ' Feuilles ',
      propriete: ' Parfumée ',
      usage_culinaire: ' Cuisine ',
    });

    await component.enregistrer();

    expect(aromateServiceMock.construireAromateCreateInput).toHaveBeenCalledWith(
      component.aromateForm.getRawValue(),
      [1, 2]
    );

    expect(aromateServiceMock.createAromate).toHaveBeenCalledWith({
      variete_id: 1,
      partie_utilisee: 'Feuilles',
      propriete: 'Parfumée',
      usage_culinaire: 'Cuisine',
      proprietes_ids: [1, 2],
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/aromates']);
  });

  it('devrait afficher un message si la création échoue', async () => {
    aromateServiceMock.createAromate.mockRejectedValue(new Error('Erreur test'));

    component.aromateForm.patchValue({
      variete_id: 1,
      partie_utilisee: 'Feuilles',
      propriete: 'Parfumée',
      usage_culinaire: 'Cuisine',
    });

    await component.enregistrer();

    expect(aromateServiceMock.getMessageErreurCreation).toHaveBeenCalled();
    expect(component.message()).toBe('Une erreur est survenue pendant la création de l’aromate.');
  });
});