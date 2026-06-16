import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { EspeceService } from '../../../services/espece.service';
import { VarieteService } from '../../../services/variete.service';
import { VarieteAjouterComponent } from './variete-ajouter.component';

describe('VarieteAjouterComponent', () => {
  let component: VarieteAjouterComponent;
  let fixture: ComponentFixture<VarieteAjouterComponent>;

  let especeServiceMock: {
    getEspeces: ReturnType<typeof vi.fn>;
  };

  let varieteServiceMock: {
    createVariete: ReturnType<typeof vi.fn>;
    construireVarieteCreateInput: ReturnType<typeof vi.fn>;
    construireAromateInput: ReturnType<typeof vi.fn>;
    getMessageErreurCreation: ReturnType<typeof vi.fn>;
  };

  let router: Router;

  const especesMock = [
    {
      id_espece: 1,
      nom_scientifique: 'Ocimum basilicum',
      nom_commun: 'Basilic',
    },
  ];

  const proprietesMedicinalesMock = [
    {
      id_propriete: 1,
      nom_propriete: 'Digestive',
    },
    {
      id_propriete: 2,
      nom_propriete: 'Antioxydante',
    },
  ];

  beforeEach(async () => {
    especeServiceMock = {
      getEspeces: vi.fn().mockResolvedValue(especesMock),
    };

    varieteServiceMock = {
      createVariete: vi.fn().mockResolvedValue(undefined),

      construireAromateInput: vi.fn().mockImplementation((valeurFormulaire, proprietesIds) => {
        const partieUtilisee = valeurFormulaire.partie_utilisee?.trim() || null;
        const propriete = valeurFormulaire.propriete_aromate?.trim() || null;
        const usageCulinaire = valeurFormulaire.usage_culinaire?.trim() || null;

        if (!partieUtilisee && !propriete && !usageCulinaire && proprietesIds.length === 0) {
          return null;
        }

        return {
          partie_utilisee: partieUtilisee,
          propriete,
          usage_culinaire: usageCulinaire,
          proprietes_ids: proprietesIds,
        };
      }),

      construireVarieteCreateInput: vi.fn().mockImplementation((valeurFormulaire, proprietesIds) => {
        return {
          espece_id: Number(valeurFormulaire.espece_id),
          nom: valeurFormulaire.nom?.trim() ?? '',
          descriptif: valeurFormulaire.descriptif?.trim() || null,
          bio: Number(valeurFormulaire.bio),
          cycle_jours: valeurFormulaire.cycle_jours,
          couleur_legume: valeurFormulaire.couleur_legume?.trim() || null,
          taille_fixe_legume: valeurFormulaire.taille_fixe_legume,
          taille_min_legume: valeurFormulaire.taille_min_legume,
          taille_max_legume: valeurFormulaire.taille_max_legume,
          espacement_entre_les_plants: valeurFormulaire.espacement_entre_les_plants,
          espacement_entre_les_lignes: valeurFormulaire.espacement_entre_les_lignes,
          type_ensoleillement: valeurFormulaire.type_ensoleillement?.trim() || null,
          type_feuillage: valeurFormulaire.type_feuillage?.trim() || null,
          hauteur_adulte_min: valeurFormulaire.hauteur_adulte_min,
          hauteur_adulte_max: valeurFormulaire.hauteur_adulte_max,
          duree_de_germination: valeurFormulaire.duree_de_germination?.trim() || null,
          temperature_min_de_germination: valeurFormulaire.temperature_min_de_germination,
          cycle_de_vie: valeurFormulaire.cycle_de_vie?.trim() || null,
          rusticite_plante: valeurFormulaire.rusticite_plante?.trim() || null,
          date_semis_min: valeurFormulaire.date_semis_min?.trim() || null,
          date_semis_max: valeurFormulaire.date_semis_max?.trim() || null,
          duree_avant_recolte: valeurFormulaire.duree_avant_recolte?.trim() || null,
          type_de_sol: valeurFormulaire.type_de_sol?.trim() || null,
          conseil_plantation: valeurFormulaire.conseil_plantation?.trim() || null,
        };
      }),

      getMessageErreurCreation: vi.fn().mockImplementation((error: unknown) => {
        const message = String(error);

        if (message.includes('DUPLICATE_VARIETE')) {
          return 'Une variété avec ce nom existe déjà pour cette espèce.';
        }

        return 'Une erreur technique est survenue pendant la création de la variété.';
      }),
    };

    await TestBed.configureTestingModule({
      imports: [VarieteAjouterComponent],
      providers: [
        provideRouter([]),
        { provide: EspeceService, useValue: especeServiceMock },
        { provide: VarieteService, useValue: varieteServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(VarieteAjouterComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger les espèces et les propriétés médicinales', async () => {
    await component.chargerDonnees();

    expect(especeServiceMock.getEspeces).toHaveBeenCalled();
    expect(component.especes()).toEqual(especesMock);
    expect(component.isLoading()).toBe(false);
    expect(component.message()).toBe('');
  });

  it('devrait afficher un message si le chargement échoue', async () => {
    especeServiceMock.getEspeces.mockRejectedValue(new Error('Erreur test'));

    await component.chargerDonnees();

    expect(component.message()).toBe('Erreur pendant le chargement des données.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait avoir un formulaire invalide quand les champs obligatoires sont vides', () => {
    component.varieteForm.patchValue({
      espece_id: 0,
      nom: '',
      bio: 0,
    });

    expect(component.varieteForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire invalide quand aucune espèce n’est sélectionnée', () => {
    component.varieteForm.patchValue({
      espece_id: 0,
      nom: 'Marmande',
      bio: 1,
    });

    expect(component.varieteForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire invalide quand le nom est vide', () => {
    component.varieteForm.patchValue({
      espece_id: 1,
      nom: '',
      bio: 1,
    });

    expect(component.varieteForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire valide avec les champs obligatoires renseignés', () => {
    component.varieteForm.patchValue({
      espece_id: 1,
      nom: 'Marmande',
      bio: 1,
    });

    expect(component.varieteForm.valid).toBe(true);
  });

  it('devrait accepter les champs optionnels vides', () => {
    component.varieteForm.patchValue({
      espece_id: 1,
      nom: 'Marmande',
      descriptif: '',
      couleur_legume: '',
      type_ensoleillement: '',
      conseil_plantation: '',
      bio: 0,
    });

    expect(component.varieteForm.valid).toBe(true);
  });

  it('ne devrait pas enregistrer si le formulaire est invalide', async () => {
    component.varieteForm.patchValue({
      espece_id: 0,
      nom: '',
      bio: 0,
    });

    await component.enregistrer();

    expect(component.message()).toBe('Veuillez remplir les champs obligatoires.');
    expect(varieteServiceMock.construireVarieteCreateInput).not.toHaveBeenCalled();
    expect(varieteServiceMock.createVariete).not.toHaveBeenCalled();
  });

  it('devrait créer une variété et rediriger vers la liste', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.varieteForm.patchValue({
      espece_id: 1,
      nom: ' Basilic Genovese ',
      descriptif: ' Variété parfumée ',
      bio: 1,
      cycle_jours: 90,
      couleur_legume: ' Vert ',
      taille_fixe_legume: null,
      taille_min_legume: null,
      taille_max_legume: null,
      espacement_entre_les_plants: null,
      espacement_entre_les_lignes: null,
      type_ensoleillement: ' Soleil ',
      type_feuillage: '',
      hauteur_adulte_min: null,
      hauteur_adulte_max: null,
      duree_de_germination: '',
      temperature_min_de_germination: null,
      cycle_de_vie: '',
      rusticite_plante: '',
      date_semis_min: '',
      date_semis_max: '',
      duree_avant_recolte: '',
      type_de_sol: '',
      conseil_plantation: '',
    });


    await component.enregistrer();

    expect(varieteServiceMock.construireVarieteCreateInput).toHaveBeenCalledWith(
      component.varieteForm.getRawValue()
    );

    expect(varieteServiceMock.createVariete).toHaveBeenCalledWith({
      espece_id: 1,
      nom: 'Basilic Genovese',
      descriptif: 'Variété parfumée',
      bio: 1,
      cycle_jours: 90,
      couleur_legume: 'Vert',
      taille_fixe_legume: null,
      taille_min_legume: null,
      taille_max_legume: null,
      espacement_entre_les_plants: null,
      espacement_entre_les_lignes: null,
      type_ensoleillement: 'Soleil',
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
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/varietes']);
  });

  it('devrait afficher un message si la variété existe déjà', async () => {
    varieteServiceMock.createVariete.mockRejectedValue('DUPLICATE_VARIETE');
    varieteServiceMock.getMessageErreurCreation.mockReturnValueOnce(
      'Une variété avec ce nom existe déjà pour cette espèce.'
    );

    component.varieteForm.patchValue({
      espece_id: 1,
      nom: 'Basilic Genovese',
      bio: 1,
    });

    await component.enregistrer();

    expect(varieteServiceMock.getMessageErreurCreation).toHaveBeenCalled();
    expect(component.message()).toBe('Une variété avec ce nom existe déjà pour cette espèce.');
  });

  it('devrait afficher un message si la création échoue techniquement', async () => {
    const error = new Error('Erreur technique');
    varieteServiceMock.createVariete.mockRejectedValue(error);

    component.varieteForm.patchValue({
      espece_id: 1,
      nom: 'Basilic Genovese',
      bio: 1,
    });

    await component.enregistrer();

    expect(varieteServiceMock.getMessageErreurCreation).toHaveBeenCalled();
    expect(component.message()).toBe('Une erreur technique est survenue pendant la création de la variété.');
  });
});