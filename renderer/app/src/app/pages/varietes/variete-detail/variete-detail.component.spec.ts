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
        type_plante: 'Légume fruit',
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
        type_plante: 'Légume fruit',
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
        type_plante: 'Légume fruit',
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
        type_plante: 'Légume fruit',
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
});