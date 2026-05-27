import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { VarieteModifierComponent } from './variete-modifier.component';
import { EspeceService } from '../../../services/espece.service';
import { ProprieteMedicinaleService } from '../../../services/propriete-medicinale.service';
import { VarieteService } from '../../../services/variete.service';

describe('VarieteModifierComponent', () => {
  let component: VarieteModifierComponent;
  let fixture: ComponentFixture<VarieteModifierComponent>;

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
  };

  const especeServiceMock = {
    getEspeces: () => Promise.resolve([
      {
        id_espece: 1,
        nom_scientifique: 'Ocimum basilicum',
        nom_commun: 'Basilic',
      },
    ]),
  };

  const proprieteMedicinaleServiceMock = {
    getProprietesMedicinales: () => Promise.resolve([
      {
        id_propriete: 1,
        nom_propriete: 'Digestive',
      },
      {
        id_propriete: 2,
        nom_propriete: 'Antioxydante',
      },
    ]),
  };

  const varieteServiceMock = {
    getVarieteById: () => Promise.resolve(varieteTest),
    updateVariete: () => Promise.resolve(varieteTest),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VarieteModifierComponent],
      providers: [
        provideRouter([]),
        {
          provide: EspeceService,
          useValue: especeServiceMock,
        },
        {
          provide: ProprieteMedicinaleService,
          useValue: proprieteMedicinaleServiceMock,
        },
        {
          provide: VarieteService,
          useValue: varieteServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VarieteModifierComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', '1');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger la variété, les espèces et les propriétés médicinales', () => {
    expect(component.variete()?.nom).toBe('Basilic grand vert');
    expect(component.especes().length).toBe(1);
    expect(component.proprietesMedicinales().length).toBe(2);
    expect(component.isLoading()).toBe(false);
  });

  it('devrait préremplir les informations aromatiques existantes', () => {
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
      partie_utilisee: 'Feuilles',
      propriete_aromate: 'Parfumée',
      usage_culinaire: 'Sauces et salades',
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
});