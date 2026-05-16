import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProduitDetailComponent } from './produit-detail.component';

describe('ProduitDetailComponent', () => {
  let component: ProduitDetailComponent;
  let fixture: ComponentFixture<ProduitDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitDetailComponent],
      providers: [
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProduitDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher En stock quand la quantité est supérieure à 0', () => {
    component.produit.set({
      id_produit: 1,
      intitule: 'Tomate test',
      prix_unitaire: 3.5,
      quantite: 10,
      image_produit: null,
      date_ajout: null,
      categorie_id: 1,
      variete_id: 1,
      categorie: {
        id_categorie: 1,
        nom_categorie: 'Tomate',
        descriptif: null,
      },
      variete: {
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
      },
    });

    expect(component.getStatutProduit()).toBe('En stock');
  });

  it('devrait afficher Rupture de stock quand la quantité est égale à 0', () => {
    component.produit.set({
      id_produit: 1,
      intitule: 'Tomate test',
      prix_unitaire: 3.5,
      quantite: 0,
      image_produit: null,
      date_ajout: null,
      categorie_id: 1,
      variete_id: 1,
      categorie: {
        id_categorie: 1,
        nom_categorie: 'Tomate',
        descriptif: null,
      },
      variete: {
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
      },
    });

    expect(component.getStatutProduit()).toBe('Rupture de stock');
  });
});