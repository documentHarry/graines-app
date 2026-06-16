import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { CategorieModifierComponent } from './categorie-modifier.component';
import { CategorieService } from '../../../services/categorie.service';
import { Categorie, CategorieUpdateInput } from '../../../types/electron';

describe('CategorieModifierComponent', () => {
  let component: CategorieModifierComponent;
  let fixture: ComponentFixture<CategorieModifierComponent>;

  let categorieServiceMock: {
    getCategorieById: ReturnType<typeof vi.fn>;
    updateCategorie: ReturnType<typeof vi.fn>;
    construireCategorieUpdateInput: ReturnType<typeof vi.fn>;
    getMessageErreurModification: ReturnType<typeof vi.fn>;
  };

  let router: Router;

  const categorieMock: Categorie = {
    id_categorie: 1,
    nom_categorie: 'Boissons',
    descriptif: 'Catégorie des boissons',
  } as Categorie;

  beforeEach(async () => {
    categorieServiceMock = {
      getCategorieById: vi.fn().mockResolvedValue(categorieMock),
      updateCategorie: vi.fn().mockResolvedValue(undefined),
      construireCategorieUpdateInput: vi.fn().mockImplementation((
        idCategorie: number,
        valeurFormulaire
      ) => {
        return {
          id_categorie: idCategorie,
          nom_categorie: valeurFormulaire.nom_categorie?.trim() ?? '',
          descriptif: valeurFormulaire.descriptif?.trim() || null,
        } as CategorieUpdateInput;
      }),
      getMessageErreurModification: vi.fn().mockImplementation((error: unknown) => {
        const message = String(error);

        if (message.includes('DUPLICATE_CATEGORY')) {
          return 'Une catégorie avec ce nom existe déjà.';
        }

        return 'Une erreur technique est survenue pendant la modification de la catégorie.';
      }),
    };

    await TestBed.configureTestingModule({
      imports: [CategorieModifierComponent],
      providers: [
        provideRouter([]),
        { provide: CategorieService, useValue: categorieServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(CategorieModifierComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger la catégorie', async () => {
    fixture.componentRef.setInput('id', '1');

    await component.chargerCategorie();

    expect(categorieServiceMock.getCategorieById).toHaveBeenCalledWith(1);
    expect(component.categorie()).toEqual(categorieMock);
    expect(component.isLoading()).toBe(false);
    expect(component.message()).toBe('');
  });

  it('devrait remplir le formulaire avec la catégorie', async () => {
    fixture.componentRef.setInput('id', '1');

    await component.chargerCategorie();

    expect(component.categorieForm.getRawValue()).toEqual({
      nom_categorie: 'Boissons',
      descriptif: 'Catégorie des boissons',
    });
  });

  it('devrait afficher un message si l’identifiant est invalide', async () => {
    fixture.componentRef.setInput('id', 'abc');

    await component.chargerCategorie();

    expect(component.message()).toBe('Identifiant de la catégorie invalide.');
    expect(component.isLoading()).toBe(false);
    expect(categorieServiceMock.getCategorieById).not.toHaveBeenCalled();
  });

  it('devrait afficher un message si la catégorie est introuvable', async () => {
    categorieServiceMock.getCategorieById.mockResolvedValue(null);
    fixture.componentRef.setInput('id', '1');

    await component.chargerCategorie();

    expect(component.message()).toBe('Catégorie introuvable.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si le chargement échoue', async () => {
    categorieServiceMock.getCategorieById.mockRejectedValue(new Error('Erreur test'));
    fixture.componentRef.setInput('id', '1');

    await component.chargerCategorie();

    expect(component.message()).toBe('Erreur pendant le chargement de la catégorie.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait rendre le formulaire invalide si le nom est vide', () => {
    component.categorieForm.patchValue({
      nom_categorie: '',
      descriptif: 'Description test',
    });

    expect(component.categorieForm.invalid).toBe(true);
  });

  it('devrait rendre le formulaire valide si le nom est rempli', () => {
    component.categorieForm.patchValue({
      nom_categorie: 'Nouvelle catégorie',
      descriptif: 'Nouvelle description',
    });

    expect(component.categorieForm.valid).toBe(true);
  });

  it('ne devrait pas enregistrer si le formulaire est invalide', async () => {
    component.categorie.set(categorieMock);

    component.categorieForm.patchValue({
      nom_categorie: '',
      descriptif: 'Description test',
    });

    await component.enregistrer();

    expect(component.message()).toBe('Veuillez remplir les champs obligatoires.');
    expect(categorieServiceMock.construireCategorieUpdateInput).not.toHaveBeenCalled();
    expect(categorieServiceMock.updateCategorie).not.toHaveBeenCalled();
  });

  it('ne devrait pas enregistrer si aucune catégorie n’est chargée', async () => {
    component.categorieForm.patchValue({
      nom_categorie: 'Boissons',
      descriptif: 'Description test',
    });

    await component.enregistrer();

    expect(component.message()).toBe('Veuillez remplir les champs obligatoires.');
    expect(categorieServiceMock.construireCategorieUpdateInput).not.toHaveBeenCalled();
    expect(categorieServiceMock.updateCategorie).not.toHaveBeenCalled();
  });

  it('devrait construire puis modifier la catégorie et rediriger vers la liste', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.categorie.set(categorieMock);
    component.categorieForm.patchValue({
      nom_categorie: ' Boissons chaudes ',
      descriptif: ' Café et thé ',
    });

    await component.enregistrer();

    expect(categorieServiceMock.construireCategorieUpdateInput).toHaveBeenCalledWith(
      1,
      {
        nom_categorie: ' Boissons chaudes ',
        descriptif: ' Café et thé ',
      }
    );

    expect(categorieServiceMock.updateCategorie).toHaveBeenCalledWith({
      id_categorie: 1,
      nom_categorie: 'Boissons chaudes',
      descriptif: 'Café et thé',
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/categories']);
  });

  it('devrait convertir un descriptif vide en null via le service', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.categorie.set(categorieMock);
    component.categorieForm.patchValue({
      nom_categorie: 'Boissons',
      descriptif: '   ',
    });

    await component.enregistrer();

    expect(categorieServiceMock.construireCategorieUpdateInput).toHaveBeenCalledWith(
      1,
      {
        nom_categorie: 'Boissons',
        descriptif: '   ',
      }
    );

    expect(categorieServiceMock.updateCategorie).toHaveBeenCalledWith({
      id_categorie: 1,
      nom_categorie: 'Boissons',
      descriptif: null,
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/categories']);
  });

  it('devrait afficher un message si la catégorie existe déjà', async () => {
    categorieServiceMock.updateCategorie.mockRejectedValue('DUPLICATE_CATEGORY');

    component.categorie.set(categorieMock);
    component.categorieForm.patchValue({
      nom_categorie: 'Boissons',
      descriptif: '',
    });

    await component.enregistrer();

    expect(categorieServiceMock.getMessageErreurModification).toHaveBeenCalled();
    expect(component.message()).toBe(
      'Une erreur technique est survenue pendant la modification de la catégorie.'
    );
  });

  it('devrait afficher un message si la modification échoue techniquement', async () => {
    const error = new Error('Erreur technique');
    categorieServiceMock.updateCategorie.mockRejectedValue(error);

    component.categorie.set(categorieMock);
    component.categorieForm.patchValue({
      nom_categorie: 'Boissons',
      descriptif: '',
    });

    await component.enregistrer();

    expect(categorieServiceMock.getMessageErreurModification).toHaveBeenCalled();
    expect(component.message()).toBe(
      'Une erreur technique est survenue pendant la modification de la catégorie.'
    );
  });
});