import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { VarieteService } from './variete.service';
import { ElectronService } from './electron.service';
import {
  Aromate,
  Variete,
  VarieteCreateInput,
  VarieteUpdateInput,
} from '../types/electron';

describe('VarieteService', () => {
  let service: VarieteService;

  let apiMock: {
    getVarietes: ReturnType<typeof vi.fn>;
    getVarieteById: ReturnType<typeof vi.fn>;
    createVariete: ReturnType<typeof vi.fn>;
    updateVariete: ReturnType<typeof vi.fn>;
    deleteVariete: ReturnType<typeof vi.fn>;
  };

  let electronServiceMock: {
    getApi: ReturnType<typeof vi.fn>;
  };

  const aromateMock: Aromate = {
    id_aromate: 1,
    partie_utilisee: 'Feuilles',
    propriete: 'Parfumée',
    usage_culinaire: 'Cuisine',
    variete_id: 1,
    aromate_propriete: [
      {
        aromate_id: 1,
        propriete_id: 1,
        propriete_medicinale: {
          id_propriete: 1,
          nom_propriete: 'Digestive',
        },
      },
      {
        aromate_id: 1,
        propriete_id: 2,
        propriete_medicinale: {
          id_propriete: 2,
          nom_propriete: 'Antioxydante',
        },
      },
    ],
  };

  const varieteMock: Variete = {
    id_variete: 1,
    nom: 'Basilic Genovese',
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
    conseil_plantation: 'Semer au chaud. Arroser régulièrement.',
    espece_id: 1,
    espece: {
      id_espece: 1,
      nom_commun: 'Basilic',
      nom_scientifique: 'Ocimum basilicum',
    },
    _count: {
      produit: 2,
    },
    aromate: [aromateMock],
  } as Variete;

  beforeEach(() => {
    apiMock = {
      getVarietes: vi.fn().mockResolvedValue([varieteMock]),
      getVarieteById: vi.fn().mockResolvedValue(varieteMock),
      createVariete: vi.fn().mockResolvedValue(varieteMock),
      updateVariete: vi.fn().mockResolvedValue(varieteMock),
      deleteVariete: vi.fn().mockResolvedValue(varieteMock),
    };

    electronServiceMock = {
      getApi: vi.fn().mockReturnValue(apiMock),
    };

    TestBed.configureTestingModule({
      providers: [
        VarieteService,
        { provide: ElectronService, useValue: electronServiceMock },
      ],
    });

    service = TestBed.inject(VarieteService);
  });

  it('devrait créer le service', () => {
    expect(service).toBeTruthy();
  });

  it('devrait récupérer toutes les variétés', async () => {
    const result = await service.getVarietes();

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.getVarietes).toHaveBeenCalled();
    expect(result).toEqual([varieteMock]);
  });

  it('devrait récupérer une variété par id', async () => {
    const result = await service.getVarieteById(1);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.getVarieteById).toHaveBeenCalledWith(1);
    expect(result).toEqual(varieteMock);
  });

  it('devrait créer une variété', async () => {
    const input: VarieteCreateInput = {
      espece_id: 1,
      nom: 'Basilic Genovese',
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
    };

    const result = await service.createVariete(input);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.createVariete).toHaveBeenCalledWith(input);
    expect(result).toEqual(varieteMock);
  });

  it('devrait modifier une variété', async () => {
    const input: VarieteUpdateInput = {
      id_variete: 1,
      espece_id: 1,
      nom: 'Basilic modifié',
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
    };

    const result = await service.updateVariete(input);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.updateVariete).toHaveBeenCalledWith(input);
    expect(result).toEqual(varieteMock);
  });

  it('devrait supprimer une variété', async () => {
    const result = await service.deleteVariete(1);

    expect(electronServiceMock.getApi).toHaveBeenCalled();
    expect(apiMock.deleteVariete).toHaveBeenCalledWith(1);
    expect(result).toEqual(varieteMock);
  });

  it('devrait retourner le nombre de produits', () => {
    expect(service.getNombreProduits(varieteMock)).toBe(2);
  });

  it('devrait retourner 0 si la variété est null', () => {
    expect(service.getNombreProduits(null)).toBe(0);
  });

  it('devrait retourner le label bio', () => {
    expect(service.getLabelBio(varieteMock)).toBe('Bio');
  });

  it('devrait retourner le label non bio', () => {
    expect(service.getLabelBio({ ...varieteMock, bio: 0 } as Variete)).toBe('Non bio');
  });

  it('devrait retourner les conseils de plantation sous forme de phrases', () => {
    expect(service.getConseilsPlantation(varieteMock)).toEqual([
      'Semer au chaud.',
      'Arroser régulièrement.',
    ]);
  });

  it('devrait retourner une liste vide si aucun conseil de plantation', () => {
    expect(service.getConseilsPlantation({ ...varieteMock, conseil_plantation: null } as Variete)).toEqual([]);
  });

  it('devrait retourner le message si la variété possède des produits', () => {
    expect(service.getMessageErreurSuppression('VARIETE_HAS_PRODUCTS')).toBe(
      'Cette variété possède des produits associés. Elle ne peut pas être supprimée.'
    );
  });

  it('devrait retourner le message technique de suppression', () => {
    expect(service.getMessageErreurSuppression(new Error('Erreur test'))).toBe(
      'Une erreur est survenue pendant la suppression de la variété.'
    );
  });

  it('devrait construire un VarieteCreateInput', () => {
    const result = service.construireVarieteCreateInput(
      {
        espece_id: 1,
        nom: ' Basilic Genovese ',
        descriptif: ' Variété parfumée ',
        bio: 1,
        cycle_jours: 90,
        couleur_legume: ' Vert ',
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
      }
    );

    expect(result).toEqual({
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
  });

it('devrait retourner le message d’erreur à la création', () => {
  expect(service.getMessageErreurCreation()).toBe(
    'Une erreur est survenue pendant la création de la variété.'
  );
});

});