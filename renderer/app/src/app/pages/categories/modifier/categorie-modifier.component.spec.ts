import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CategorieModifierComponent } from './categorie-modifier.component';
import { CategorieService } from '../../../services/categorie.service';
import { Categorie } from '../../../types/electron';

describe('CategorieModifierComponent', () => {
  let component: CategorieModifierComponent;
  let fixture: ComponentFixture<CategorieModifierComponent>;

  const categorieMock: Categorie = {
    id_categorie: 1,
    nom_categorie: 'Boissons',
    descriptif: 'Catégorie des boissons',
  } as Categorie;

  const categorieServiceMock = {
    getCategorieById: () => Promise.resolve(categorieMock),
    updateCategorie: () => Promise.resolve(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorieModifierComponent],
      providers: [
        provideRouter([]),
        {
          provide: CategorieService,
          useValue: categorieServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategorieModifierComponent);
    fixture.componentRef.setInput('id', '1');

    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger la catégorie', () => {
    expect(component.categorie()).toEqual(categorieMock);
    expect(component.isLoading()).toBe(false);
    expect(component.message()).toBe('');
  });

  it('devrait remplir le formulaire avec la catégorie', () => {
    expect(component.categorieForm.value.nom_categorie).toBe('Boissons');
    expect(component.categorieForm.value.descriptif).toBe('Catégorie des boissons');
  });

  it('devrait afficher le titre de la page', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Modifier une catégorie');
  });

  it('devrait afficher le lien retour aux catégories', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('← Retour aux catégories');
  });

  it('devrait afficher le bouton enregistrer', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Enregistrer les modifications');
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
});