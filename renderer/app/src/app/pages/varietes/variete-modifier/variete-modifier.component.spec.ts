import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { VarieteModifierComponent } from './variete-modifier.component';
import { VarieteService } from '../../../services/variete.service';
import { EspeceService } from '../../../services/espece.service';
import { Espece, Variete } from '../../../types/electron';

describe('VarieteModifierComponent', () => {
  let component: VarieteModifierComponent;
  let fixture: ComponentFixture<VarieteModifierComponent>;
  let router: Router;

  let varieteServiceMock: {
    getVarieteById: ReturnType<typeof vi.fn>;
    updateVariete: ReturnType<typeof vi.fn>;
    construireVarieteUpdateInput: ReturnType<typeof vi.fn>;
    getMessageErreurModification: ReturnType<typeof vi.fn>;
  };

  let especeServiceMock: {
    getEspeces: ReturnType<typeof vi.fn>;
  };

  const especesMock: Espece[] = [
    {
      id_espece: 1,
      nom_commun: 'Basilic',
      nom_scientifique: 'Ocimum basilicum',
    } as Espece,
  ];

  const varieteMock: Variete = {
    id_variete: 1,
    nom: 'Basilic Genovese',
    descriptif: 'Variété parfumée',
    bio: 1,
    cycle_jours: 90,
    couleur_legume: 'Vert',
    taille_fixe_legume: null,
    taille_min_legume: null,
    taille_max_legume: null,
    espacement_entre_les_plants: null,
    espacement_entre_les_lignes: null,
    type_ensoleillement: 'Soleil',
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
      nom_commun: 'Basilic',
      nom_scientifique: 'Ocimum basilicum',
    },
    _count: {
      produit: 0,
    },
  } as Variete;

  beforeEach(async () => {
    varieteServiceMock = {
      getVarieteById: vi.fn().mockResolvedValue(varieteMock),
      updateVariete: vi.fn().mockResolvedValue(varieteMock),
      construireVarieteUpdateInput: vi.fn().mockImplementation((idVariete, valeurFormulaire) => {
        return {
          id_variete: idVariete,
          espece_id: Number(valeurFormulaire.espece_id),
          nom: valeurFormulaire.nom?.trim() ?? '',
          descriptif: valeurFormulaire.descriptif?.trim() || null,
          bio: Number(valeurFormulaire.bio),
          cycle_jours: valeurFormulaire.cycle_jours,
          couleur_legume: valeurFormulaire.couleur_legume?.trim() || null,
          taille_fixe_legume: valeurFormulaire.taille_fixe_legume,
          taille_min_legume: valeurFormulaire.taille_min_legume,
          taille_max_legume: valeurFormulaire.taille_max_legume,
          espacement_entre_les_plants: valeurFormulaire.espacement_entre_les_plants,
          espacement_entre_les_lignes: valeurFormulaire.espacement_entre_les_lignes,
          type_ensoleillement: valeurFormulaire.type_ensoleillement?.trim() || null,
          type_feuillage: valeurFormulaire.type_feuillage?.trim() || null,
          hauteur_adulte_min: valeurFormulaire.hauteur_adulte_min,
          hauteur_adulte_max: valeurFormulaire.hauteur_adulte_max,
          duree_de_germination: valeurFormulaire.duree_de_germination?.trim() || null,
          temperature_min_de_germination: valeurFormulaire.temperature_min_de_germination,
          cycle_de_vie: valeurFormulaire.cycle_de_vie?.trim() || null,
          rusticite_plante: valeurFormulaire.rusticite_plante?.trim() || null,
          date_semis_min: valeurFormulaire.date_semis_min?.trim() || null,
          date_semis_max: valeurFormulaire.date_semis_max?.trim() || null,
          duree_avant_recolte: valeurFormulaire.duree_avant_recolte?.trim() || null,
          type_de_sol: valeurFormulaire.type_de_sol?.trim() || null,
          conseil_plantation: valeurFormulaire.conseil_plantation?.trim() || null,
        };
      }),
      getMessageErreurModification: vi.fn().mockReturnValue(
        'Une erreur est survenue pendant la modification de la variété.'
      ),
    };

    especeServiceMock = {
      getEspeces: vi.fn().mockResolvedValue(especesMock),
    };

    await TestBed.configureTestingModule({
      imports: [VarieteModifierComponent],
      providers: [
        provideRouter([]),
        { provide: VarieteService, useValue: varieteServiceMock },
        { provide: EspeceService, useValue: especeServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(VarieteModifierComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger les données de la variété', async () => {
    fixture.componentRef.setInput('id', '1');

    await component.chargerDonnees();

    expect(varieteServiceMock.getVarieteById).toHaveBeenCalledWith(1);
    expect(especeServiceMock.getEspeces).toHaveBeenCalled();
    expect(component.variete()).toEqual(varieteMock);
    expect(component.especes()).toEqual(especesMock);
    expect(component.message()).toBe('');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait remplir le formulaire avec la variété', async () => {
    fixture.componentRef.setInput('id', '1');

    await component.chargerDonnees();

    expect(component.varieteForm.getRawValue()).toEqual({
      espece_id: 1,
      nom: 'Basilic Genovese',
      descriptif: 'Variété parfumée',
      bio: 1,
      cycle_jours: 90,
      couleur_legume: 'Vert',
      taille_fixe_legume: null,
      taille_min_legume: null,
      taille_max_legume: null,
      espacement_entre_les_plants: null,
      espacement_entre_les_lignes: null,
      type_ensoleillement: 'Soleil',
      type_feuillage: '',
      hauteur_adulte_min: null,
      hauteur_adulte_max: null,
      duree_de_germination: '',
      temperature_min_de_germination: null,
      cycle_de_vie: '',
      rusticite_plante: '',
      date_semis_min: '',
      date_semis_max: '',
      duree_avant_recolte: '',
      type_de_sol: '',
      conseil_plantation: '',
    });
  });

  it('devrait afficher un message si l’identifiant est invalide', async () => {
    fixture.componentRef.setInput('id', 'abc');

    await component.chargerDonnees();

    expect(component.message()).toBe('Identifiant de la variété invalide.');
    expect(component.isLoading()).toBe(false);
    expect(varieteServiceMock.getVarieteById).not.toHaveBeenCalled();
  });

  it('devrait afficher un message si la variété est introuvable', async () => {
    varieteServiceMock.getVarieteById.mockResolvedValue(null);
    fixture.componentRef.setInput('id', '1');

    await component.chargerDonnees();

    expect(component.message()).toBe('Variété introuvable.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si le chargement échoue', async () => {
    varieteServiceMock.getVarieteById.mockRejectedValue(new Error('Erreur test'));
    fixture.componentRef.setInput('id', '1');

    await component.chargerDonnees();

    expect(component.message()).toBe('Erreur pendant le chargement de la variété.');
    expect(component.isLoading()).toBe(false);
  });

  it('ne devrait pas enregistrer si le formulaire est invalide', async () => {
    component.variete.set(varieteMock);

    component.varieteForm.patchValue({
      espece_id: 0,
      nom: '',
      bio: 1,
    });

    await component.enregistrer();

    expect(component.message()).toBe('Veuillez remplir les champs obligatoires.');
    expect(varieteServiceMock.construireVarieteUpdateInput).not.toHaveBeenCalled();
    expect(varieteServiceMock.updateVariete).not.toHaveBeenCalled();
  });

  it('ne devrait pas enregistrer si aucune variété n’est chargée', async () => {
    component.varieteForm.patchValue({
      espece_id: 1,
      nom: 'Basilic Genovese',
      bio: 1,
    });

    await component.enregistrer();

    expect(component.message()).toBe('Veuillez remplir les champs obligatoires.');
    expect(varieteServiceMock.construireVarieteUpdateInput).not.toHaveBeenCalled();
    expect(varieteServiceMock.updateVariete).not.toHaveBeenCalled();
  });

  it('devrait modifier une variété et rediriger vers le détail', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.variete.set(varieteMock);

    component.varieteForm.patchValue({
      espece_id: 1,
      nom: ' Basilic modifié ',
      descriptif: ' Nouveau descriptif ',
      bio: 1,
      cycle_jours: 100,
      couleur_legume: ' Vert foncé ',
      taille_fixe_legume: null,
      taille_min_legume: null,
      taille_max_legume: null,
      espacement_entre_les_plants: null,
      espacement_entre_les_lignes: null,
      type_ensoleillement: ' Soleil ',
      type_feuillage: '',
      hauteur_adulte_min: null,
      hauteur_adulte_max: null,
      duree_de_germination: '',
      temperature_min_de_germination: null,
      cycle_de_vie: '',
      rusticite_plante: '',
      date_semis_min: '',
      date_semis_max: '',
      duree_avant_recolte: '',
      type_de_sol: '',
      conseil_plantation: '',
    });

    await component.enregistrer();

    expect(varieteServiceMock.construireVarieteUpdateInput).toHaveBeenCalledWith(
      1,
      component.varieteForm.getRawValue()
    );

    expect(varieteServiceMock.updateVariete).toHaveBeenCalledWith({
      id_variete: 1,
      espece_id: 1,
      nom: 'Basilic modifié',
      descriptif: 'Nouveau descriptif',
      bio: 1,
      cycle_jours: 100,
      couleur_legume: 'Vert foncé',
      taille_fixe_legume: null,
      taille_min_legume: null,
      taille_max_legume: null,
      espacement_entre_les_plants: null,
      espacement_entre_les_lignes: null,
      type_ensoleillement: 'Soleil',
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
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/varietes', 1]);
  });

  it('devrait afficher un message si la modification échoue', async () => {
    varieteServiceMock.updateVariete.mockRejectedValue(new Error('Erreur'));

    component.variete.set(varieteMock);
    component.varieteForm.patchValue({
      espece_id: 1,
      nom: 'Basilic Genovese',
      bio: 1,
    });

    await component.enregistrer();

    expect(varieteServiceMock.getMessageErreurModification).toHaveBeenCalled();
    expect(component.message()).toBe(
      'Une erreur est survenue pendant la modification de la variété.'
    );
  });

  it('devrait afficher un message si la modification échoue techniquement', async () => {
    varieteServiceMock.updateVariete.mockRejectedValue(new Error('Erreur technique'));

    component.variete.set(varieteMock);
    component.varieteForm.patchValue({
      espece_id: 1,
      nom: 'Basilic Genovese',
      bio: 1,
    });

    await component.enregistrer();

    expect(varieteServiceMock.getMessageErreurModification).toHaveBeenCalled();
    expect(component.message()).toBe(
      'Une erreur est survenue pendant la modification de la variété.'
    );
  });
});