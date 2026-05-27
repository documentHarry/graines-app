import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EspeceService } from '../../../services/espece.service';
import { ProprieteMedicinaleService } from '../../../services/propriete-medicinale.service';
import { VarieteService } from '../../../services/variete.service';
import { VarieteAjouterComponent } from './variete-ajouter.component';

describe('VarieteAjouterComponent', () => {
  let component: VarieteAjouterComponent;
  let fixture: ComponentFixture<VarieteAjouterComponent>;

  const especeServiceMock = {
    getEspeces: () => Promise.resolve([
      {
        id_espece: 1,
        nom_scientifique: 'Ocimum basilicum',
        nom_commun: 'Basilic',
      },
    ]),
  };

  const proprieteMedicinaleServiceMock = {
    getProprietesMedicinales: () => Promise.resolve([
      {
        id_propriete: 1,
        nom_propriete: 'Digestive',
      },
      {
        id_propriete: 2,
        nom_propriete: 'Antioxydante',
      },
    ]),
  };

  const varieteServiceMock = {
    createVariete: () => Promise.resolve(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VarieteAjouterComponent],
      providers: [
        provideRouter([]),
        { provide: EspeceService, useValue: especeServiceMock },
        { provide: ProprieteMedicinaleService, useValue: proprieteMedicinaleServiceMock },
        { provide: VarieteService, useValue: varieteServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VarieteAjouterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait avoir un formulaire invalide quand les champs obligatoires sont vides', () => {
    component.varieteForm.patchValue({
      espece_id: 0,
      nom: '',
      bio: 0,
    });

    expect(component.varieteForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire invalide quand aucune espèce n’est sélectionnée', () => {
    component.varieteForm.patchValue({
      espece_id: 0,
      nom: 'Marmande',
      bio: 1,
    });

    expect(component.varieteForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire invalide quand le nom est vide', () => {
    component.varieteForm.patchValue({
      espece_id: 1,
      nom: '',
      bio: 1,
    });

    expect(component.varieteForm.invalid).toBe(true);
  });

  it('devrait avoir un formulaire valide avec les champs obligatoires renseignés', () => {
    component.varieteForm.patchValue({
      espece_id: 1,
      nom: 'Marmande',
      bio: 1,
    });

    expect(component.varieteForm.valid).toBe(true);
  });

  it('devrait accepter les champs optionnels vides', () => {
    component.varieteForm.patchValue({
      espece_id: 1,
      nom: 'Marmande',
      descriptif: '',
      couleur_legume: '',
      type_ensoleillement: '',
      conseil_plantation: '',
      bio: 0,
    });

    expect(component.varieteForm.valid).toBe(true);
  });

  it('devrait charger les espèces et les propriétés médicinales', () => {
    expect(component.especes().length).toBe(1);
    expect(component.proprietesMedicinales().length).toBe(2);
    expect(component.isLoading()).toBe(false);
  });

  it('devrait retourner null si aucune information aromatique n’est renseignée', () => {
    component.varieteForm.patchValue({
      partie_utilisee: '',
      propriete_aromate: '',
      usage_culinaire: '',
    });

    component.proprietesSelectionnees.set([]);

    expect(component.getAromateInput()).toBe(null);
  });

  it('devrait construire un AromateInput quand les champs aromate sont renseignés', () => {
    component.varieteForm.patchValue({
      partie_utilisee: 'Feuilles',
      propriete_aromate: 'Parfumée',
      usage_culinaire: 'Sauces et salades',
    });

    component.proprietesSelectionnees.set([1, 2]);

    expect(component.getAromateInput()).toEqual({
      partie_utilisee: 'Feuilles',
      propriete: 'Parfumée',
      usage_culinaire: 'Sauces et salades',
      proprietes_ids: [1, 2],
    });
  });

  it('devrait ajouter une propriété médicinale sélectionnée', () => {
    const event = {
      target: {
        checked: true,
      },
    } as unknown as Event;

    component.changerPropriete(event, 1);

    expect(component.proprietesSelectionnees()).toEqual([1]);
  });

  it('devrait retirer une propriété médicinale décochée', () => {
    component.proprietesSelectionnees.set([1, 2]);

    const event = {
      target: {
        checked: false,
      },
    } as unknown as Event;

    component.changerPropriete(event, 1);

    expect(component.proprietesSelectionnees()).toEqual([2]);
  });

});