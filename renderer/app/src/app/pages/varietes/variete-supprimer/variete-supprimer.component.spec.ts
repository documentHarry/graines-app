import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { VarieteSupprimerComponent } from './variete-supprimer.component';

describe('VarieteSupprimerComponent', () => {
  let component: VarieteSupprimerComponent;
  let fixture: ComponentFixture<VarieteSupprimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VarieteSupprimerComponent],
      providers: [
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VarieteSupprimerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait retourner 0 quand aucune variété n’est chargée', () => {
    expect(component.getNombreProduits()).toBe(0);
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

  it('devrait retourner 0 quand la variété ne possède aucun produit associé', () => {
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

    expect(component.getNombreProduits()).toBe(0);
  });
});