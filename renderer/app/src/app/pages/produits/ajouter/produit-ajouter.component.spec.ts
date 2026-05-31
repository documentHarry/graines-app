import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { ProduitAjouterComponent } from './produit-ajouter.component';
import { CategorieService } from '../../../services/categorie.service';
import { ProduitService } from '../../../services/produit.service';
import { VarieteService } from '../../../services/variete.service';

describe('ProduitAjouterComponent', () => {
  let component: ProduitAjouterComponent;
  let fixture: ComponentFixture<ProduitAjouterComponent>;

  let categorieServiceMock: {
    getCategories: ReturnType<typeof vi.fn>;
  };

  let varieteServiceMock: {
    getVarietes: ReturnType<typeof vi.fn>;
  };

  let produitServiceMock: {
    createProduit: ReturnType<typeof vi.fn>;
  };

  let router: Router;

  beforeEach(async () => {
    categorieServiceMock = {
      getCategories: vi.fn().mockResolvedValue([
        {
          id_categorie: 1,
          nom_categorie: 'Légumes',
          descriptif: null,
          produit: [],
        },
      ]),
    };

    varieteServiceMock = {
      getVarietes: vi.fn().mockResolvedValue([
        {
          id_variete: 1,
          nom: 'Tomate Roma',
          descriptif: null,
          bio: 1,
          cycle_jours: null,
          cycle_de_vie: null,
          type_ensoleillement: null,
          type_feuillage: null,
          date_semis_min: null,
          date_semis_max: null,
          duree_avant_recolte: null,
          type_de_sol: null,
          duree_de_germination: null,
          temperature_min_de_germination: null,
          rusticite_plante: null,
          conseil_plantation: null,
          couleur_legume: null,
          taille_fixe_legume: null,
          taille_min_legume: null,
          taille_max_legume: null,
          espacement_entre_les_plants: null,
          espacement_entre_les_lignes: null,
          hauteur_adulte_min: null,
          hauteur_adulte_max: null,
          espece_id: 1,
          espece: {
            id_espece: 1,
            nom_commun: 'Tomate',
            nom_scientifique: 'Solanum lycopersicum',
          },
        },
      ]),
    };

    produitServiceMock = {
      createProduit: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [ProduitAjouterComponent],
      providers: [
        provideRouter([]),
        { provide: CategorieService, useValue: categorieServiceMock },
        { provide: VarieteService, useValue: varieteServiceMock },
        { provide: ProduitService, useValue: produitServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ProduitAjouterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger les catégories et les variétés', async () => {
    await component.chargerDonneesFormulaire();

    expect(categorieServiceMock.getCategories).toHaveBeenCalled();
    expect(varieteServiceMock.getVarietes).toHaveBeenCalled();
    expect(component.categories().length).toBe(1);
    expect(component.varietes().length).toBe(1);
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si le chargement du formulaire échoue', async () => {
    categorieServiceMock.getCategories.mockRejectedValue(new Error('Erreur test'));

    await component.chargerDonneesFormulaire();

    expect(component.message()).toBe('Erreur pendant le chargement du formulaire.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait avoir un formulaire invalide quand les champs obligatoires sont vides', () => {
    component.produitForm.patchValue({
      intitule: '',
      prix_unitaire: 0,
      quantite: 0,
      categorie_id: 0,
      variete_id: 0,
    });

    expect(component.produitForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire valide quand les champs obligatoires sont remplis', () => {
    component.produitForm.patchValue({
      intitule: 'Tomate test',
      prix_unitaire: 3.5,
      quantite: 10,
      categorie_id: 1,
      variete_id: 1,
    });

    expect(component.produitForm.valid).toBe(true);
  });

  it('ne devrait pas créer de produit si le formulaire est invalide', async () => {
    component.produitForm.patchValue({
      intitule: '',
      prix_unitaire: 0,
      quantite: 0,
      categorie_id: 0,
      variete_id: 0,
    });

    await component.enregistrer();

    expect(component.message()).toBe('Veuillez remplir les champs obligatoires.');
    expect(produitServiceMock.createProduit).not.toHaveBeenCalled();
  });

  it('devrait créer un produit et rediriger vers la liste des produits', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.produitForm.patchValue({
      intitule: ' Tomate test ',
      prix_unitaire: 3.5,
      quantite: 10,
      categorie_id: 1,
      variete_id: 1,
    });

    await component.enregistrer();

    expect(produitServiceMock.createProduit).toHaveBeenCalledWith({
      intitule: 'Tomate test',
      prix_unitaire: 3.5,
      quantite: 10,
      categorie_id: 1,
      variete_id: 1,
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/produits']);
  });

  it('devrait afficher un message si le produit existe déjà', async () => {
    produitServiceMock.createProduit.mockRejectedValue('DUPLICATE_PRODUCT');

    component.produitForm.patchValue({
      intitule: 'Tomate test',
      prix_unitaire: 3.5,
      quantite: 10,
      categorie_id: 1,
      variete_id: 1,
    });

    await component.enregistrer();

    expect(component.message()).toBe('Un produit avec cet intitulé et cette variété existe déjà.');
  });

  it('devrait afficher un message si la création échoue techniquement', async () => {
    produitServiceMock.createProduit.mockRejectedValue(new Error('Erreur technique'));

    component.produitForm.patchValue({
      intitule: 'Tomate test',
      prix_unitaire: 3.5,
      quantite: 10,
      categorie_id: 1,
      variete_id: 1,
    });

    await component.enregistrer();

    expect(component.message()).toBe('Une erreur technique est survenue pendant la création du produit.');
  });
});