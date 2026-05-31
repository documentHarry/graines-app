import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { VarieteService } from './variete.service';
import { ElectronService } from './electron.service';
import {
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
    aromate: [],
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
      aromate: null,
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
      aromate: null,
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
});