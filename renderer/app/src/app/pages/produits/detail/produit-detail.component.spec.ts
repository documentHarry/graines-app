import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { ProduitDetailComponent } from './produit-detail.component';
import { ProduitService } from '../../../services/produit.service';
import { AuthService } from '../../../services/auth.service';
import { Produit } from '../../../types/electron';

describe('ProduitDetailComponent', () => {
  let component: ProduitDetailComponent;
  let fixture: ComponentFixture<ProduitDetailComponent>;

  let produitServiceMock: {
    getProduitById: ReturnType<typeof vi.fn>;
    deleteProduit: ReturnType<typeof vi.fn>;
    getLabelBio: ReturnType<typeof vi.fn>;
    getImageProduit: ReturnType<typeof vi.fn>;
    getStatutProduit: ReturnType<typeof vi.fn>;
    getConseilsPlantation: ReturnType<typeof vi.fn>;
    getMessageErreurSuppression: ReturnType<typeof vi.fn>;
  };

  let authServiceMock: {
    hasAnyRole: ReturnType<typeof vi.fn>;
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
      },
    },
  } as Produit;

  beforeEach(async () => {
    produitServiceMock = {
      getProduitById: vi.fn().mockResolvedValue(produitMock),
      deleteProduit: vi.fn().mockResolvedValue(undefined),

      getLabelBio: vi.fn().mockImplementation((produit: Produit | null) => {
        if (produit?.variete?.bio === 1) {
          return 'Oui';
        }

        return 'Non';
      }),

      getImageProduit: vi.fn().mockImplementation((produit: Produit | null) => {
        return produit?.image_produit ?? null;
      }),

      getStatutProduit: vi.fn().mockImplementation((produit: Produit | null) => {
        if (produit?.quantite && produit.quantite > 0) {
          return 'En stock';
        }

        return 'Rupture de stock';
      }),

      getConseilsPlantation: vi.fn().mockImplementation((produit: Produit | null) => {
        const conseil = produit?.variete?.conseil_plantation;

        if (!conseil) {
          return [];
        }

        return conseil
          .split('.')
          .map(phrase => phrase.trim())
          .filter(phrase => phrase.length > 0)
          .map(phrase => phrase + '.');
      }),

      getMessageErreurSuppression: vi.fn().mockReturnValue(
        'Une erreur est survenue pendant la suppression du produit.'
      ),
    };

    authServiceMock = {
      hasAnyRole: vi.fn().mockReturnValue(false),
    };

    await TestBed.configureTestingModule({
      imports: [ProduitDetailComponent],
      providers: [
        provideRouter([]),
        { provide: ProduitService, useValue: produitServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ProduitDetailComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher un message si l’identifiant du produit est invalide', async () => {
    fixture.componentRef.setInput('id', 'abc');

    await component.chargerProduit();

    expect(component.message()).toBe('Identifiant du produit invalide.');
    expect(component.isLoading()).toBe(false);
    expect(produitServiceMock.getProduitById).not.toHaveBeenCalled();
  });

  it('devrait afficher un message si le produit est introuvable', async () => {
    produitServiceMock.getProduitById.mockResolvedValue(null);
    fixture.componentRef.setInput('id', '1');

    await component.chargerProduit();

    expect(component.message()).toBe('Produit introuvable.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si le chargement du produit échoue', async () => {
    produitServiceMock.getProduitById.mockRejectedValue(new Error('Erreur test'));
    fixture.componentRef.setInput('id', '1');

    await component.chargerProduit();

    expect(component.message()).toBe('Erreur pendant le chargement du produit.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher Oui quand la variété est bio via le service', () => {
    component.produit.set(produitMock);

    expect(component.getLabelBio()).toBe('Oui');
    expect(produitServiceMock.getLabelBio).toHaveBeenCalledWith(produitMock);
  });

  it('devrait afficher Non quand la variété n’est pas bio via le service', () => {
    const produitNonBio = {
      ...produitMock,
      variete: {
        ...produitMock.variete,
        bio: 0,
      },
    } as Produit;

    component.produit.set(produitNonBio);

    expect(component.getLabelBio()).toBe('Non');
    expect(produitServiceMock.getLabelBio).toHaveBeenCalledWith(produitNonBio);
  });

  it('devrait retourner null quand le produit n’a pas d’image via le service', () => {
    component.produit.set(produitMock);

    expect(component.getImageProduit()).toBe(null);
    expect(produitServiceMock.getImageProduit).toHaveBeenCalledWith(produitMock);
  });

  it('devrait retourner l’image du produit quand elle existe via le service', () => {
    const produitAvecImage = {
      ...produitMock,
      image_produit: 'image-test.jpg',
    } as Produit;

    component.produit.set(produitAvecImage);

    expect(component.getImageProduit()).toBe('image-test.jpg');
    expect(produitServiceMock.getImageProduit).toHaveBeenCalledWith(produitAvecImage);
  });

  it('devrait afficher En stock quand la quantité est supérieure à 0 via le service', () => {
    component.produit.set(produitMock);

    expect(component.getStatutProduit()).toBe('En stock');
    expect(produitServiceMock.getStatutProduit).toHaveBeenCalledWith(produitMock);
  });

  it('devrait afficher Rupture de stock quand la quantité est égale à 0 via le service', () => {
    const produitRupture = {
      ...produitMock,
      quantite: 0,
    } as Produit;

    component.produit.set(produitRupture);

    expect(component.getStatutProduit()).toBe('Rupture de stock');
    expect(produitServiceMock.getStatutProduit).toHaveBeenCalledWith(produitRupture);
  });

  it('ne devrait pas supprimer si aucun produit n’est chargé', async () => {
    await component.supprimerProduit();

    expect(produitServiceMock.deleteProduit).not.toHaveBeenCalled();
  });

  it('ne devrait pas supprimer si la confirmation est annulée', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.produit.set(produitMock);

    await component.supprimerProduit();

    expect(confirmSpy).toHaveBeenCalledWith('Voulez-vous vraiment supprimer ce produit ?');
    expect(produitServiceMock.deleteProduit).not.toHaveBeenCalled();
  });

  it('devrait supprimer le produit et rediriger vers la liste', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.produit.set(produitMock);

    await component.supprimerProduit();

    expect(confirmSpy).toHaveBeenCalledWith('Voulez-vous vraiment supprimer ce produit ?');
    expect(produitServiceMock.deleteProduit).toHaveBeenCalledWith(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/produits']);
  });

  it('devrait afficher un message si la suppression échoue', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    produitServiceMock.deleteProduit.mockRejectedValue(new Error('Erreur suppression'));

    component.produit.set(produitMock);

    await component.supprimerProduit();

    expect(produitServiceMock.getMessageErreurSuppression).toHaveBeenCalled();
    expect(component.message()).toBe('Une erreur est survenue pendant la suppression du produit.');
  });
});