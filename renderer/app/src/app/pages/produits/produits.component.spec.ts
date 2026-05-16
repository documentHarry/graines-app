import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProduitsComponent } from './produits.component';
import { ProduitService } from '../../services/produit.service';
import { Produit } from '../../types/electron';

describe('ProduitsComponent', () => {
  let component: ProduitsComponent;
  let fixture: ComponentFixture<ProduitsComponent>;

  const produitTest: Produit = {
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
  };

  const produitServiceMock = {
    getProduits: () => Promise.resolve([produitTest]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitsComponent],
      providers: [
        provideRouter([]),
        {
          provide: ProduitService,
          useValue: produitServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProduitsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher En stock quand la quantité est supérieure à 0', () => {
    const statut = component.getStatutProduit(produitTest);

    expect(statut).toBe('En stock');
  });

  it('devrait afficher Rupture de stock quand la quantité est égale à 0', () => {
    const produitSansStock: Produit = {
      ...produitTest,
      quantite: 0,
    };

    const statut = component.getStatutProduit(produitSansStock);

    expect(statut).toBe('Rupture de stock');
  });

  it('devrait charger les produits depuis le service', async () => {
    await component.chargerProduits();

    expect(component.produits().length).toBe(1);
    expect(component.produits()[0].intitule).toBe('Tomate test');
    expect(component.isLoading()).toBe(false);
    expect(component.message()).toBe('');
  });
});