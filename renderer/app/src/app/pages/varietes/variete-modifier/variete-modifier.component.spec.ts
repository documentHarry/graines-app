import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { VarieteModifierComponent } from './variete-modifier.component';
import { EspeceService } from '../../../services/espece.service';
import { ProprieteMedicinaleService } from '../../../services/propriete-medicinale.service';
import { VarieteService } from '../../../services/variete.service';
import { Variete } from '../../../types/electron';

describe('VarieteModifierComponent', () => {
  let component: VarieteModifierComponent;
  let fixture: ComponentFixture<VarieteModifierComponent>;

  let especeServiceMock: {
    getEspeces: ReturnType<typeof vi.fn>;
  };

  let proprieteMedicinaleServiceMock: {
    getProprietesMedicinales: ReturnType<typeof vi.fn>;
  };

  let varieteServiceMock: {
    getVarieteById: ReturnType<typeof vi.fn>;
    updateVariete: ReturnType<typeof vi.fn>;
  };

  let router: Router;

  const varieteTest = {
    id_variete: 1,
    nom: 'Basilic grand vert',
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
      nom_scientifique: 'Ocimum basilicum',
      nom_commun: 'Basilic',
    },
    _count: {
      produit: 0,
    },
    aromate: [
      {
        id_aromate: 1,
        partie_utilisee: 'Feuilles',
        propriete: 'Parfumée',
        usage_culinaire: 'Sauces et salades',
        variete_id: 1,
        aromate_propriete: [
          {
            aromate_id: 1,
            propriete_id: 1,
            propriete_medicinale: {
              id_propriete: 1,
              nom_propriete: 'Digestive',
            },
          },
        ],
      },
    ],
  } as Variete;

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
      getVarieteById: vi.fn().mockResolvedValue(varieteTest),
      updateVariete: vi.fn().mockResolvedValue(varieteTest),
    };

    await TestBed.configureTestingModule({
      imports: [VarieteModifierComponent],
      providers: [
        provideRouter([]),
        { provide: EspeceService, useValue: especeServiceMock },
        { provide: ProprieteMedicinaleService, useValue: proprieteMedicinaleServiceMock },
        { provide: VarieteService, useValue: varieteServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(VarieteModifierComponent);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger la variété, les espèces et les propriétés médicinales', async () => {
    fixture.componentRef.setInput('id', '1');

    await component.chargerDonnees();

    expect(varieteServiceMock.getVarieteById).toHaveBeenCalledWith(1);
    expect(especeServiceMock.getEspeces).toHaveBeenCalled();
    expect(proprieteMedicinaleServiceMock.getProprietesMedicinales).toHaveBeenCalled();

    expect(component.variete()).toEqual(varieteTest);
    expect(component.especes()).toEqual(especesMock);
    expect(component.proprietesMedicinales()).toEqual(proprietesMedicinalesMock);
    expect(component.isLoading()).toBe(false);
    expect(component.message()).toBe('');
  });

  it('devrait afficher un message si l’identifiant est invalide', async () => {
    fixture.componentRef.setInput('id', 'abc');

    await component.chargerDonnees();

    expect(component.message()).toBe('Identifiant de la variété invalide.');
    expect(component.isLoading()).toBe(false);
    expect(varieteServiceMock.getVarieteById).not.toHaveBeenCalled();
  });

  it('devrait afficher un message si la variété est introuvable', async () => {
    varieteServiceMock.getVarieteById.mockResolvedValue(null);
    fixture.componentRef.setInput('id', '1');

    await component.chargerDonnees();

    expect(component.message()).toBe('Variété introuvable.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si le chargement échoue', async () => {
    varieteServiceMock.getVarieteById.mockRejectedValue(new Error('Erreur test'));
    fixture.componentRef.setInput('id', '1');

    await component.chargerDonnees();

    expect(component.message()).toBe('Erreur pendant le chargement de la variété.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait préremplir le formulaire avec la variété', async () => {
    fixture.componentRef.setInput('id', '1');

    await component.chargerDonnees();

    expect(component.varieteForm.value.nom).toBe('Basilic grand vert');
    expect(component.varieteForm.value.espece_id).toBe(1);
    expect(component.varieteForm.value.bio).toBe(1);
  });

  it('devrait préremplir les informations aromatiques existantes', async () => {
    fixture.componentRef.setInput('id', '1');

    await component.chargerDonnees();

    expect(component.varieteForm.value.partie_utilisee).toBe('Feuilles');
    expect(component.varieteForm.value.propriete_aromate).toBe('Parfumée');
    expect(component.varieteForm.value.usage_culinaire).toBe('Sauces et salades');
    expect(component.proprietesSelectionnees()).toEqual([1]);
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

  it('devrait retourner le premier aromate de la variété', () => {
    const aromate = component.getPremierAromate(varieteTest);

    expect(aromate?.partie_utilisee).toBe('Feuilles');
  });

  it('devrait détecter une propriété médicinale sélectionnée', () => {
    component.proprietesSelectionnees.set([1]);

    expect(component.estProprieteSelectionnee(1)).toBe(true);
    expect(component.estProprieteSelectionnee(2)).toBe(false);
  });

  it('devrait ajouter une propriété médicinale sélectionnée', () => {
    component.proprietesSelectionnees.set([]);

    const event = {
      target: {
        checked: true,
      },
    } as unknown as Event;

    component.changerPropriete(event, 2);

    expect(component.proprietesSelectionnees()).toEqual([2]);
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

  it('devrait retourner null si aucune information aromatique n’est renseignée', () => {
    component.varieteForm.patchValue({
      partie_utilisee: '',
      propriete_aromate: '',
      usage_culinaire: '',
    });

    component.proprietesSelectionnees.set([]);

    expect(component.getAromateInput()).toBe(null);
  });

  it('devrait vider les informations aromatiques', () => {
    component.supprimerAromate();

    expect(component.varieteForm.value.partie_utilisee).toBe('');
    expect(component.varieteForm.value.propriete_aromate).toBe('');
    expect(component.varieteForm.value.usage_culinaire).toBe('');
    expect(component.proprietesSelectionnees()).toEqual([]);
  });

  it('ne devrait pas enregistrer si le formulaire est invalide', async () => {
    component.variete.set(varieteTest);

    component.varieteForm.patchValue({
      espece_id: 0,
      nom: '',
      bio: 0,
    });

    await component.enregistrer();

    expect(component.message()).toBe('Veuillez remplir les champs obligatoires.');
    expect(varieteServiceMock.updateVariete).not.toHaveBeenCalled();
  });

  it('ne devrait pas enregistrer si aucune variété n’est chargée', async () => {
    component.varieteForm.patchValue({
      espece_id: 1,
      nom: 'Basilic grand vert',
      bio: 1,
    });

    await component.enregistrer();

    expect(component.message()).toBe('Veuillez remplir les champs obligatoires.');
    expect(varieteServiceMock.updateVariete).not.toHaveBeenCalled();
  });

  it('devrait modifier une variété et rediriger vers son détail', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.variete.set(varieteTest);
    component.varieteForm.patchValue({
      espece_id: 1,
      nom: ' Basilic modifié ',
      descriptif: ' Description modifiée ',
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

    expect(varieteServiceMock.updateVariete).toHaveBeenCalledWith({
      id_variete: 1,
      espece_id: 1,
      nom: 'Basilic modifié',
      descriptif: 'Description modifiée',
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

    expect(navigateSpy).toHaveBeenCalledWith(['/varietes', 1]);
  });

  it('devrait afficher un message si la variété existe déjà', async () => {
    varieteServiceMock.updateVariete.mockRejectedValue('DUPLICATE_VARIETE');

    component.variete.set(varieteTest);
    component.varieteForm.patchValue({
      espece_id: 1,
      nom: 'Basilic grand vert',
      bio: 1,
    });

    await component.enregistrer();

    expect(component.message()).toBe('Une variété avec ce nom existe déjà pour cette espèce.');
  });

  it('devrait afficher un message si la modification échoue techniquement', async () => {
    varieteServiceMock.updateVariete.mockRejectedValue(new Error('Erreur technique'));

    component.variete.set(varieteTest);
    component.varieteForm.patchValue({
      espece_id: 1,
      nom: 'Basilic grand vert',
      bio: 1,
    });

    await component.enregistrer();

    expect(component.message()).toBe('Une erreur technique est survenue pendant la modification de la variété.');
  });
});