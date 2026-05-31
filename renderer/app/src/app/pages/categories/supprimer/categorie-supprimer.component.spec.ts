import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { CategorieSupprimerComponent } from './categorie-supprimer.component';
import { CategorieService } from '../../../services/categorie.service';
import { Categorie } from '../../../types/electron';

describe('CategorieSupprimerComponent', () => {
  let component: CategorieSupprimerComponent;
  let fixture: ComponentFixture<CategorieSupprimerComponent>;
  let categorieServiceMock: {
    getCategorieById: ReturnType<typeof vi.fn>;
    getCategories: ReturnType<typeof vi.fn>;
    deleteCategorie: ReturnType<typeof vi.fn>;
    deleteCategorieWithReaffectation: ReturnType<typeof vi.fn>;
  };
  let router: Router;

  const categorieMock: Categorie = {
    id_categorie: 1,
    nom_categorie: 'Boissons',
    descriptif: 'Catégorie des boissons',
    _count: {
      produit: 0,
    },
  } as Categorie;

  const categorieAvecProduitsMock: Categorie = {
    ...categorieMock,
    _count: {
      produit: 3,
    },
  } as Categorie;

  const categoriesMock: Categorie[] = [
    categorieMock,
    {
      id_categorie: 2,
      nom_categorie: 'Snacks',
      descriptif: 'Catégorie snacks',
      _count: {
        produit: 3,
      },
    } as Categorie,
  ];

  beforeEach(async () => {
    categorieServiceMock = {
      getCategorieById: vi.fn().mockResolvedValue(categorieMock),
      getCategories: vi.fn().mockResolvedValue(categoriesMock),
      deleteCategorie: vi.fn().mockResolvedValue(undefined),
      deleteCategorieWithReaffectation: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [CategorieSupprimerComponent],
      providers: [
        provideRouter([]),
        { provide: CategorieService, useValue: categorieServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(CategorieSupprimerComponent);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger la catégorie et exclure la catégorie actuelle de la liste de réaffectation', async () => {
    fixture.componentRef.setInput('id', '1');

    await component.chargerDonnees();

    expect(categorieServiceMock.getCategorieById).toHaveBeenCalledWith(1);
    expect(categorieServiceMock.getCategories).toHaveBeenCalled();
    expect(component.categorie()).toEqual(categorieMock);
    expect(component.categories()).toEqual([categoriesMock[1]]);
    expect(component.isLoading()).toBe(false);
    expect(component.message()).toBe('');
  });

  it('devrait afficher un message si l’identifiant est invalide', async () => {
    fixture.componentRef.setInput('id', 'abc');

    await component.chargerDonnees();

    expect(component.message()).toBe('Identifiant de la catégorie invalide.');
    expect(component.isLoading()).toBe(false);
    expect(categorieServiceMock.getCategorieById).not.toHaveBeenCalled();
  });

  it('devrait afficher un message si la catégorie est introuvable', async () => {
    categorieServiceMock.getCategorieById.mockResolvedValue(null);
    fixture.componentRef.setInput('id', '1');

    await component.chargerDonnees();

    expect(component.message()).toBe('Catégorie introuvable.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si le chargement échoue', async () => {
    categorieServiceMock.getCategorieById.mockRejectedValue(new Error('Erreur test'));
    fixture.componentRef.setInput('id', '1');

    await component.chargerDonnees();

    expect(component.message()).toBe('Erreur pendant le chargement de la catégorie.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait retourner le nombre de produits associés', () => {
    component.categorie.set(categorieAvecProduitsMock);

    expect(component.getNombreProduits()).toBe(3);
  });

  it('devrait retourner 0 si aucune catégorie n’est chargée', () => {
    component.categorie.set(null);

    expect(component.getNombreProduits()).toBe(0);
  });

  it('devrait rendre le formulaire de réaffectation invalide si aucune catégorie n’est sélectionnée', () => {
    component.reaffectationForm.patchValue({
      categorie_destination_id: 0,
    });

    expect(component.reaffectationForm.invalid).toBe(true);
  });

  it('devrait rendre le formulaire de réaffectation valide si une catégorie est sélectionnée', () => {
    component.reaffectationForm.patchValue({
      categorie_destination_id: 2,
    });

    expect(component.reaffectationForm.valid).toBe(true);
  });

  it('ne devrait pas supprimer si aucune catégorie n’est chargée', async () => {
    await component.supprimerCategorie();

    expect(categorieServiceMock.deleteCategorie).not.toHaveBeenCalled();
  });

  it('ne devrait pas supprimer si la confirmation est annulée', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.categorie.set(categorieMock);

    await component.supprimerCategorie();

    expect(confirmSpy).toHaveBeenCalledWith('Voulez-vous vraiment supprimer cette catégorie ?');
    expect(categorieServiceMock.deleteCategorie).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('devrait supprimer la catégorie et rediriger vers la liste', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.categorie.set(categorieMock);

    await component.supprimerCategorie();

    expect(categorieServiceMock.deleteCategorie).toHaveBeenCalledWith(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/categories']);

    confirmSpy.mockRestore();
  });

  it('devrait afficher un message si la catégorie contient des produits', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    categorieServiceMock.deleteCategorie.mockRejectedValue('CATEGORY_HAS_PRODUCTS');

    component.categorie.set(categorieMock);

    await component.supprimerCategorie();

    expect(component.message()).toBe('Cette catégorie contient des produits. Veuillez choisir une catégorie de réaffectation.');
  });

  it('devrait afficher un message si la suppression échoue techniquement', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    categorieServiceMock.deleteCategorie.mockRejectedValue(new Error('Erreur technique'));

    component.categorie.set(categorieMock);

    await component.supprimerCategorie();

    expect(component.message()).toBe('Une erreur est survenue pendant la suppression de la catégorie.');
  });

  it('ne devrait pas réaffecter si aucune catégorie n’est chargée', async () => {
    component.reaffectationForm.patchValue({
      categorie_destination_id: 2,
    });

    await component.supprimerAvecReaffectation();

    expect(categorieServiceMock.deleteCategorieWithReaffectation).not.toHaveBeenCalled();
  });

  it('ne devrait pas réaffecter si le formulaire est invalide', async () => {
    component.categorie.set(categorieAvecProduitsMock);
    component.reaffectationForm.patchValue({
      categorie_destination_id: 0,
    });

    await component.supprimerAvecReaffectation();

    expect(component.message()).toBe('Veuillez choisir une catégorie de réaffectation.');
    expect(categorieServiceMock.deleteCategorieWithReaffectation).not.toHaveBeenCalled();
  });

  it('ne devrait pas réaffecter si la confirmation est annulée', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.categorie.set(categorieAvecProduitsMock);
    component.reaffectationForm.patchValue({
      categorie_destination_id: 2,
    });

    await component.supprimerAvecReaffectation();

    expect(confirmSpy).toHaveBeenCalledWith('Les produits seront réaffectés à la catégorie choisie. Confirmer la suppression ?');
    expect(categorieServiceMock.deleteCategorieWithReaffectation).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('devrait réaffecter les produits, supprimer la catégorie et rediriger', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.categorie.set(categorieAvecProduitsMock);
    component.reaffectationForm.patchValue({
      categorie_destination_id: 2,
    });

    await component.supprimerAvecReaffectation();

    expect(categorieServiceMock.deleteCategorieWithReaffectation).toHaveBeenCalledWith(1, 2);
    expect(navigateSpy).toHaveBeenCalledWith(['/categories']);

    confirmSpy.mockRestore();
  });

  it('devrait afficher un message si la catégorie de destination est identique', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    categorieServiceMock.deleteCategorieWithReaffectation.mockRejectedValue('SAME_CATEGORY');

    component.categorie.set(categorieAvecProduitsMock);
    component.reaffectationForm.patchValue({
      categorie_destination_id: 2,
    });

    await component.supprimerAvecReaffectation();

    expect(component.message()).toBe('La catégorie de destination doit être différente.');
  });

  it('devrait afficher un message si la catégorie de destination est introuvable', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    categorieServiceMock.deleteCategorieWithReaffectation.mockRejectedValue('DESTINATION_CATEGORY_NOT_FOUND');

    component.categorie.set(categorieAvecProduitsMock);
    component.reaffectationForm.patchValue({
      categorie_destination_id: 2,
    });

    await component.supprimerAvecReaffectation();

    expect(component.message()).toBe('La catégorie de destination est introuvable.');
  });

  it('devrait afficher un message si la réaffectation échoue techniquement', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    categorieServiceMock.deleteCategorieWithReaffectation.mockRejectedValue(new Error('Erreur technique'));

    component.categorie.set(categorieAvecProduitsMock);
    component.reaffectationForm.patchValue({
      categorie_destination_id: 2,
    });

    await component.supprimerAvecReaffectation();

    expect(component.message()).toBe('Une erreur est survenue pendant la réaffectation.');
  });

  it('devrait retourner à la liste des catégories lors de l’annulation', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    await component.annuler();

    expect(navigateSpy).toHaveBeenCalledWith(['/categories']);
  });
});