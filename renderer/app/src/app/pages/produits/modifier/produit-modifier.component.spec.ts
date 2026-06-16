import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { ProduitModifierComponent } from './produit-modifier.component';
import { CategorieService } from '../../../services/categorie.service';
import { ProduitService } from '../../../services/produit.service';
import { VarieteService } from '../../../services/variete.service';
import { Produit } from '../../../types/electron';

describe('ProduitModifierComponent', () => {
  let component: ProduitModifierComponent;
  let fixture: ComponentFixture<ProduitModifierComponent>;

  let categorieServiceMock: {
    getCategories: ReturnType<typeof vi.fn>;
  };

  let varieteServiceMock: {
    getVarietes: ReturnType<typeof vi.fn>;
  };

  let produitServiceMock: {
    getProduitById: ReturnType<typeof vi.fn>;
    updateProduit: ReturnType<typeof vi.fn>;
    construireProduitUpdateInput: ReturnType<typeof vi.fn>;
    getMessageErreurModification: ReturnType<typeof vi.fn>;
  };

  let router: Router;

  const produitMock: Produit = {
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
      nom_categorie: 'Légumes',
      descriptif: null,
    },
    variete: {
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
  } as Produit;

  beforeEach(async () => {
    categorieServiceMock = {
      getCategories: vi.fn().mockResolvedValue([
        {
          id_categorie: 1,
          nom_categorie: 'Légumes',
          descriptif: null,
        },
      ]),
    };

    varieteServiceMock = {
      getVarietes: vi.fn().mockResolvedValue([
        produitMock.variete,
      ]),
    };

    produitServiceMock = {
      getProduitById: vi.fn().mockResolvedValue(produitMock),
      updateProduit: vi.fn().mockResolvedValue(undefined),

      construireProduitUpdateInput: vi.fn().mockImplementation((idProduit, valeurFormulaire) => {
        return {
          id_produit: idProduit,
          intitule: valeurFormulaire.intitule?.trim() ?? '',
          prix_unitaire: Number(valeurFormulaire.prix_unitaire),
          quantite: Number(valeurFormulaire.quantite),
          categorie_id: Number(valeurFormulaire.categorie_id),
          variete_id: Number(valeurFormulaire.variete_id),
        };
      }),

      getMessageErreurModification: vi.fn().mockImplementation((error: unknown) => {
        const message = String(error);

        if (message.includes('DUPLICATE_PRODUCT')) {
          return 'Un produit avec cet intitulé et cette variété existe déjà.';
        }

        return 'Une erreur technique est survenue pendant la modification du produit.';
      }),
    };

    await TestBed.configureTestingModule({
      imports: [ProduitModifierComponent],
      providers: [
        provideRouter([]),
        { provide: CategorieService, useValue: categorieServiceMock },
        { provide: VarieteService, useValue: varieteServiceMock },
        { provide: ProduitService, useValue: produitServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ProduitModifierComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger le produit, les catégories et les variétés', async () => {
    fixture.componentRef.setInput('id', '1');

    await component.chargerDonnees();

    expect(categorieServiceMock.getCategories).toHaveBeenCalled();
    expect(varieteServiceMock.getVarietes).toHaveBeenCalled();
    expect(produitServiceMock.getProduitById).toHaveBeenCalledWith(1);

    expect(component.produit()).toEqual(produitMock);
    expect(component.categories().length).toBe(1);
    expect(component.varietes().length).toBe(1);
    expect(component.produitForm.getRawValue()).toEqual({
      intitule: 'Tomate test',
      prix_unitaire: 3.5,
      quantite: 10,
      categorie_id: 1,
      variete_id: 1,
    });
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si l’identifiant du produit est invalide', async () => {
    fixture.componentRef.setInput('id', 'abc');

    await component.chargerDonnees();

    expect(component.message()).toBe('Identifiant du produit invalide.');
    expect(component.isLoading()).toBe(false);
    expect(produitServiceMock.getProduitById).not.toHaveBeenCalled();
  });

  it('devrait afficher un message si le produit est introuvable', async () => {
    produitServiceMock.getProduitById.mockResolvedValue(null);
    fixture.componentRef.setInput('id', '1');

    await component.chargerDonnees();

    expect(component.message()).toBe('Produit introuvable.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si le chargement échoue', async () => {
    categorieServiceMock.getCategories.mockRejectedValue(new Error('Erreur test'));
    fixture.componentRef.setInput('id', '1');

    await component.chargerDonnees();

    expect(component.message()).toBe('Erreur pendant le chargement du produit.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait avoir un formulaire invalide quand le prix est égal à 0', () => {
    component.produitForm.patchValue({
      intitule: 'Tomate test',
      prix_unitaire: 0,
      quantite: 10,
      categorie_id: 1,
      variete_id: 1,
    });

    expect(component.produitForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire invalide quand la quantité est négative', () => {
    component.produitForm.patchValue({
      intitule: 'Tomate test',
      prix_unitaire: 3.5,
      quantite: -1,
      categorie_id: 1,
      variete_id: 1,
    });

    expect(component.produitForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire invalide quand l’intitulé est vide', () => {
    component.produitForm.patchValue({
      intitule: '',
      prix_unitaire: 3.5,
      quantite: 10,
      categorie_id: 1,
      variete_id: 1,
    });

    expect(component.produitForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire valide quand les données sont correctes', () => {
    component.produitForm.patchValue({
      intitule: 'Tomate test',
      prix_unitaire: 3.5,
      quantite: 10,
      categorie_id: 1,
      variete_id: 1,
    });

    expect(component.produitForm.valid).toBe(true);
  });

  it('ne devrait pas enregistrer si le formulaire est invalide', async () => {
    component.produit.set(produitMock);

    component.produitForm.patchValue({
      intitule: '',
      prix_unitaire: 3.5,
      quantite: 10,
      categorie_id: 1,
      variete_id: 1,
    });

    await component.enregistrer();

    expect(component.message()).toBe('Veuillez remplir les champs obligatoires.');
    expect(produitServiceMock.construireProduitUpdateInput).not.toHaveBeenCalled();
    expect(produitServiceMock.updateProduit).not.toHaveBeenCalled();
  });

  it('ne devrait pas enregistrer si aucun produit n’est chargé', async () => {
    component.produitForm.patchValue({
      intitule: 'Tomate test',
      prix_unitaire: 3.5,
      quantite: 10,
      categorie_id: 1,
      variete_id: 1,
    });

    await component.enregistrer();

    expect(component.message()).toBe('Veuillez remplir les champs obligatoires.');
    expect(produitServiceMock.construireProduitUpdateInput).not.toHaveBeenCalled();
    expect(produitServiceMock.updateProduit).not.toHaveBeenCalled();
  });

  it('devrait construire puis enregistrer les modifications et rediriger vers le détail du produit', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.produit.set(produitMock);

    component.produitForm.patchValue({
      intitule: ' Tomate modifiée ',
      prix_unitaire: 4.5,
      quantite: 20,
      categorie_id: 1,
      variete_id: 1,
    });

    await component.enregistrer();

    expect(produitServiceMock.construireProduitUpdateInput).toHaveBeenCalledWith(
      1,
      {
        intitule: ' Tomate modifiée ',
        prix_unitaire: 4.5,
        quantite: 20,
        categorie_id: 1,
        variete_id: 1,
      }
    );

    expect(produitServiceMock.updateProduit).toHaveBeenCalledWith({
      id_produit: 1,
      intitule: 'Tomate modifiée',
      prix_unitaire: 4.5,
      quantite: 20,
      categorie_id: 1,
      variete_id: 1,
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/produits', 1]);
  });

  it('devrait afficher un message si le produit existe déjà', async () => {
    produitServiceMock.updateProduit.mockRejectedValue('DUPLICATE_PRODUCT');

    component.produit.set(produitMock);

    component.produitForm.patchValue({
      intitule: 'Tomate test',
      prix_unitaire: 3.5,
      quantite: 10,
      categorie_id: 1,
      variete_id: 1,
    });

    await component.enregistrer();

    expect(produitServiceMock.getMessageErreurModification).toHaveBeenCalled();
    expect(component.message()).toBe(
      'Une erreur technique est survenue pendant la modification du produit.'
    );
  });

  it('devrait afficher un message si la modification échoue techniquement', async () => {
    const error = new Error('Erreur technique');
    produitServiceMock.updateProduit.mockRejectedValue(error);

    component.produit.set(produitMock);

    component.produitForm.patchValue({
      intitule: 'Tomate test',
      prix_unitaire: 3.5,
      quantite: 10,
      categorie_id: 1,
      variete_id: 1,
    });

    await component.enregistrer();

    expect(produitServiceMock.getMessageErreurModification).toHaveBeenCalled();
    expect(component.message()).toBe(
      'Une erreur technique est survenue pendant la modification du produit.'
    );
  });
});