import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { EspeceService } from '../../../services/espece.service';
import { ProprieteMedicinaleService } from '../../../services/propriete-medicinale.service';
import { VarieteService } from '../../../services/variete.service';
import { VarieteAjouterComponent } from './variete-ajouter.component';

describe('VarieteAjouterComponent', () => {
  let component: VarieteAjouterComponent;
  let fixture: ComponentFixture<VarieteAjouterComponent>;

  let especeServiceMock: {
    getEspeces: ReturnType<typeof vi.fn>;
  };

  let proprieteMedicinaleServiceMock: {
    getProprietesMedicinales: ReturnType<typeof vi.fn>;
  };

  let varieteServiceMock: {
    createVariete: ReturnType<typeof vi.fn>;
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

    proprieteMedicinaleServiceMock = {
      getProprietesMedicinales: vi.fn().mockResolvedValue(proprietesMedicinalesMock),
    };

    varieteServiceMock = {
      createVariete: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [VarieteAjouterComponent],
      providers: [
        provideRouter([]),
        { provide: EspeceService, useValue: especeServiceMock },
        { provide: ProprieteMedicinaleService, useValue: proprieteMedicinaleServiceMock },
        { provide: VarieteService, useValue: varieteServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(VarieteAjouterComponent);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger les espèces et les propriétés médicinales', async () => {
    await component.chargerDonnees();

    expect(especeServiceMock.getEspeces).toHaveBeenCalled();
    expect(proprieteMedicinaleServiceMock.getProprietesMedicinales).toHaveBeenCalled();
    expect(component.especes()).toEqual(especesMock);
    expect(component.proprietesMedicinales()).toEqual(proprietesMedicinalesMock);
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

  it('devrait retourner null si aucune information aromatique n’est renseignée', () => {
    component.varieteForm.patchValue({
      partie_utilisee: '',
      propriete_aromate: '',
      usage_culinaire: '',
    });

    component.proprietesSelectionnees.set([]);

    expect(component.getAromateInput()).toBe(null);
  });

  it('devrait construire un AromateInput quand les champs aromate sont renseignés', () => {
    component.varieteForm.patchValue({
      partie_utilisee: ' Feuilles ',
      propriete_aromate: ' Parfumée ',
      usage_culinaire: ' Sauces et salades ',
    });

    component.proprietesSelectionnees.set([1, 2]);

    expect(component.getAromateInput()).toEqual({
      partie_utilisee: 'Feuilles',
      propriete: 'Parfumée',
      usage_culinaire: 'Sauces et salades',
      proprietes_ids: [1, 2],
    });
  });

  it('devrait ajouter une propriété médicinale sélectionnée', () => {
    const event = {
      target: {
        checked: true,
      },
    } as unknown as Event;

    component.changerPropriete(event, 1);

    expect(component.proprietesSelectionnees()).toEqual([1]);
  });

  it('devrait retirer une propriété médicinale décochée', () => {
    component.proprietesSelectionnees.set([1, 2]);

    const event = {
      target: {
        checked: false,
      },
    } as unknown as Event;

    component.changerPropriete(event, 1);

    expect(component.proprietesSelectionnees()).toEqual([2]);
  });

  it('ne devrait pas enregistrer si le formulaire est invalide', async () => {
    component.varieteForm.patchValue({
      espece_id: 0,
      nom: '',
      bio: 0,
    });

    await component.enregistrer();

    expect(component.message()).toBe('Veuillez remplir les champs obligatoires.');
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
      partie_utilisee: 'Feuilles',
      propriete_aromate: 'Parfumée',
      usage_culinaire: 'Cuisine',
    });

    component.proprietesSelectionnees.set([1]);

    await component.enregistrer();

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
      aromate: {
        partie_utilisee: 'Feuilles',
        propriete: 'Parfumée',
        usage_culinaire: 'Cuisine',
        proprietes_ids: [1],
      },
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/varietes']);
  });

  it('devrait afficher un message si la variété existe déjà', async () => {
    varieteServiceMock.createVariete.mockRejectedValue('DUPLICATE_VARIETE');

    component.varieteForm.patchValue({
      espece_id: 1,
      nom: 'Basilic Genovese',
      bio: 1,
    });

    await component.enregistrer();

    expect(component.message()).toBe('Une variété avec ce nom existe déjà pour cette espèce.');
  });

  it('devrait afficher un message si la création échoue techniquement', async () => {
    varieteServiceMock.createVariete.mockRejectedValue(new Error('Erreur technique'));

    component.varieteForm.patchValue({
      espece_id: 1,
      nom: 'Basilic Genovese',
      bio: 1,
    });

    await component.enregistrer();

    expect(component.message()).toBe('Une erreur technique est survenue pendant la création de la variété.');
  });
});