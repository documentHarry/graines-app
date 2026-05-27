import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { VarieteDetailComponent } from './variete-detail.component';

describe('VarieteDetailComponent', () => {
  let component: VarieteDetailComponent;
  let fixture: ComponentFixture<VarieteDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VarieteDetailComponent],
      providers: [
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VarieteDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher Bio quand la variété est bio', () => {
    component.variete.set({
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
        produit: 0,
      },
    });

    expect(component.getLabelBio()).toBe('Bio');
  });

  it('devrait afficher Non bio quand la variété n’est pas bio', () => {
    component.variete.set({
      id_variete: 1,
      nom: 'Marmande',
      descriptif: null,
      bio: 0,
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
        produit: 0,
      },
    });

    expect(component.getLabelBio()).toBe('Non bio');
  });

  it('devrait retourner le nombre de produits associés à la variété', () => {
    component.variete.set({
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
    });

    expect(component.getNombreProduits()).toBe(4);
  });

  it('devrait retourner 0 si aucun compteur de produits n’est disponible', () => {
    expect(component.getNombreProduits()).toBe(0);
  });

  it('devrait découper les conseils de plantation en plusieurs phrases', () => {
    component.variete.set({
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
      conseil_plantation: 'Semer en godet. Repiquer après les gelées.',
      espece_id: 1,
      espece: {
        id_espece: 1,
        nom_scientifique: 'Solanum lycopersicum',
        nom_commun: 'Tomate',
      },
      _count: {
        produit: 0,
      },
    });

    expect(component.getConseilsPlantation()).toEqual([
      'Semer en godet.',
      'Repiquer après les gelées.',
    ]);
  });

  it('devrait retourner une liste vide quand aucun conseil de plantation n’est renseigné', () => {
    expect(component.getConseilsPlantation()).toEqual([]);
  });

  it('devrait retourner une liste vide quand aucune information aromatique n’est disponible', () => {
    expect(component.getAromates()).toEqual([]);
    expect(component.estAromate()).toBe(false);
  });

  it('devrait détecter une variété aromate', () => {
    component.variete.set({
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
          aromate_propriete: [],
        },
      ],
    });

    expect(component.getAromates().length).toBe(1);
    expect(component.estAromate()).toBe(true);
  });

  it('devrait retourner les propriétés médicinales d’un aromate', () => {
    const aromate = {
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
        {
          aromate_id: 1,
          propriete_id: 2,
          propriete_medicinale: {
            id_propriete: 2,
            nom_propriete: 'Antioxydante',
          },
        },
      ],
    };

    expect(component.getProprietesMedicinales(aromate)).toEqual([
      'Digestive',
      'Antioxydante',
    ]);
  });

  it('devrait retourner une liste vide si un aromate n’a aucune propriété médicinale', () => {
    const aromate = {
      id_aromate: 1,
      partie_utilisee: 'Feuilles',
      propriete: 'Parfumée',
      usage_culinaire: 'Sauces et salades',
      variete_id: 1,
      aromate_propriete: [],
    };

    expect(component.getProprietesMedicinales(aromate)).toEqual([]);
  });
});