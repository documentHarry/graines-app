import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { CategorieAjouterComponent } from './categorie-ajouter.component';
import { CategorieService } from '../../../services/categorie.service';
import { CategorieCreateInput } from '../../../types/electron';

describe('CategorieAjouterComponent', () => {
  let component: CategorieAjouterComponent;
  let fixture: ComponentFixture<CategorieAjouterComponent>;

  let categorieServiceMock: {
    createCategorie: ReturnType<typeof vi.fn>;
    construireCategorieCreateInput: ReturnType<typeof vi.fn>;
    getMessageErreurCreation: ReturnType<typeof vi.fn>;
  };

  let router: Router;

  beforeEach(async () => {
    categorieServiceMock = {
      createCategorie: vi.fn().mockResolvedValue(undefined),
      construireCategorieCreateInput: vi.fn().mockImplementation((valeurFormulaire) => {
        return {
          nom_categorie: valeurFormulaire.nom_categorie?.trim() ?? '',
          descriptif: valeurFormulaire.descriptif?.trim() || null,
        } as CategorieCreateInput;
      }),
      getMessageErreurCreation: vi.fn().mockImplementation((error: unknown) => {
        const message = String(error);

        if (message.includes('DUPLICATE_CATEGORY')) {
          return 'Une catégorie avec ce nom existe déjà.';
        }

        return 'Une erreur technique est survenue pendant la création de la catégorie.';
      }),
    };

    await TestBed.configureTestingModule({
      imports: [CategorieAjouterComponent],
      providers: [
        provideRouter([]),
        { provide: CategorieService, useValue: categorieServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(CategorieAjouterComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait avoir un formulaire invalide quand le nom de catégorie est vide', () => {
    component.categorieForm.patchValue({
      nom_categorie: '',
      descriptif: 'Description de test',
    });

    expect(component.categorieForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire valide quand le nom de catégorie est renseigné', () => {
    component.categorieForm.patchValue({
      nom_categorie: 'Camomille',
      descriptif: 'Plantes aromatiques et médicinales',
    });

    expect(component.categorieForm.valid).toBe(true);
  });

  it('devrait accepter un descriptif vide si le nom de catégorie est renseigné', () => {
    component.categorieForm.patchValue({
      nom_categorie: 'Basilic',
      descriptif: '',
    });

    expect(component.categorieForm.valid).toBe(true);
  });

  it('ne devrait pas enregistrer si le formulaire est invalide', async () => {
    component.categorieForm.patchValue({
      nom_categorie: '',
      descriptif: 'Description',
    });

    await component.enregistrer();

    expect(component.message()).toBe('Veuillez remplir les champs obligatoires.');
    expect(categorieServiceMock.construireCategorieCreateInput).not.toHaveBeenCalled();
    expect(categorieServiceMock.createCategorie).not.toHaveBeenCalled();
  });

  it('devrait construire puis créer une catégorie et rediriger vers la liste', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.categorieForm.patchValue({
      nom_categorie: ' Aromates ',
      descriptif: ' Plantes aromatiques ',
    });

    await component.enregistrer();

    expect(categorieServiceMock.construireCategorieCreateInput).toHaveBeenCalledWith({
      nom_categorie: ' Aromates ',
      descriptif: ' Plantes aromatiques ',
    });

    expect(categorieServiceMock.createCategorie).toHaveBeenCalledWith({
      nom_categorie: 'Aromates',
      descriptif: 'Plantes aromatiques',
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/categories']);
  });

  it('devrait convertir un descriptif vide en null via le service', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.categorieForm.patchValue({
      nom_categorie: 'Aromates',
      descriptif: '   ',
    });

    await component.enregistrer();

    expect(categorieServiceMock.construireCategorieCreateInput).toHaveBeenCalledWith({
      nom_categorie: 'Aromates',
      descriptif: '   ',
    });

    expect(categorieServiceMock.createCategorie).toHaveBeenCalledWith({
      nom_categorie: 'Aromates',
      descriptif: null,
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/categories']);
  });

  it('devrait afficher un message si la catégorie existe déjà', async () => {
    categorieServiceMock.createCategorie.mockRejectedValue('DUPLICATE_CATEGORY');

    component.categorieForm.patchValue({
      nom_categorie: 'Aromates',
      descriptif: '',
    });

    await component.enregistrer();

    expect(categorieServiceMock.getMessageErreurCreation).toHaveBeenCalled();
    expect(component.message()).toBe(
      'Une erreur technique est survenue pendant la création de la catégorie.'
    );
  });

  it('devrait afficher un message si la création échoue techniquement', async () => {
    const error = new Error('Erreur technique');
    categorieServiceMock.createCategorie.mockRejectedValue(error);

    component.categorieForm.patchValue({
      nom_categorie: 'Aromates',
      descriptif: '',
    });

    await component.enregistrer();

    expect(categorieServiceMock.getMessageErreurCreation).toHaveBeenCalled();
    expect(component.message()).toBe(
      'Une erreur technique est survenue pendant la création de la catégorie.'
    );
  });
});