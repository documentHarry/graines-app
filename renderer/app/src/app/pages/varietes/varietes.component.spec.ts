import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { VarietesComponent } from './varietes.component';
import { VarieteService } from '../../services/variete.service';
import { AuthService } from '../../services/auth.service';
import { Variete } from '../../types/electron';

describe('VarietesComponent', () => {
  let component: VarietesComponent;
  let fixture: ComponentFixture<VarietesComponent>;

  let varieteServiceMock: {
    getVarietes: ReturnType<typeof vi.fn>;
  };

  let authServiceMock: {
    hasAnyRole: ReturnType<typeof vi.fn>;
  };

  const varietesTest: Variete[] = [
    {
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
      type_ensoleillement: 'Soleil',
      type_feuillage: null,
      hauteur_adulte_min: null,
      hauteur_adulte_max: null,
      duree_de_germination: null,
      temperature_min_de_germination: null,
      cycle_de_vie: 'Annuelle',
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
      _count: {
        produit: 3,
      },
      aromate: [],
    } as Variete,
    {
      id_variete: 2,
      nom: 'Camomille romaine',
      descriptif: null,
      bio: 0,
      cycle_jours: null,
      couleur_legume: null,
      taille_fixe_legume: null,
      taille_min_legume: null,
      taille_max_legume: null,
      espacement_entre_les_plants: null,
      espacement_entre_les_lignes: null,
      type_ensoleillement: 'Mi-ombre',
      type_feuillage: null,
      hauteur_adulte_min: null,
      hauteur_adulte_max: null,
      duree_de_germination: null,
      temperature_min_de_germination: null,
      cycle_de_vie: 'Vivace',
      rusticite_plante: null,
      date_semis_min: null,
      date_semis_max: null,
      duree_avant_recolte: null,
      type_de_sol: null,
      conseil_plantation: null,
      espece_id: 2,
      espece: {
        id_espece: 2,
        nom_scientifique: 'Chamaemelum nobile',
        nom_commun: 'Camomille',
      },
      _count: {
        produit: 0,
      },
      aromate: [
        {
          id_aromate: 1,
          partie_utilisee: 'Fleurs',
          propriete: 'Apaisante',
          usage_culinaire: 'Infusion',
          variete_id: 2,
          aromate_propriete: [],
        },
      ],
    } as Variete,
  ];

  beforeEach(async () => {
    varieteServiceMock = {
      getVarietes: vi.fn().mockResolvedValue(varietesTest),
    };

    authServiceMock = {
      hasAnyRole: vi.fn().mockReturnValue(false),
    };

    await TestBed.configureTestingModule({
      imports: [VarietesComponent],
      providers: [
        provideRouter([]),
        { provide: VarieteService, useValue: varieteServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VarietesComponent);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger les variétés depuis le service', async () => {
    await component.chargerVarietes();

    expect(varieteServiceMock.getVarietes).toHaveBeenCalled();
    expect(component.varietes()).toEqual(varietesTest);
    expect(component.isLoading()).toBe(false);
    expect(component.message()).toBe('');
  });

  it('devrait afficher un message d’erreur si le chargement échoue', async () => {
    varieteServiceMock.getVarietes.mockRejectedValue(new Error('Erreur test'));

    await component.chargerVarietes();

    expect(component.message()).toBe('Erreur pendant le chargement des variétés.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait retourner le nombre de produits associés à une variété', () => {
    expect(component.getNombreProduits(varietesTest[0])).toBe(3);
  });

  it('devrait retourner 0 si le compteur de produits est absent', () => {
    const varieteSansCompteur = {
      ...varietesTest[0],
      _count: undefined,
    } as Variete;

    expect(component.getNombreProduits(varieteSansCompteur)).toBe(0);
  });

  it('devrait afficher Bio quand la variété est bio', () => {
    expect(component.getLabelBio(varietesTest[0])).toBe('Bio');
  });

  it('devrait afficher Non bio quand la variété n’est pas bio', () => {
    expect(component.getLabelBio(varietesTest[1])).toBe('Non bio');
  });

  it('devrait détecter une variété aromate', () => {
    expect(component.estAromate(varietesTest[1])).toBe(true);
  });

  it('devrait détecter une variété non aromate', () => {
    expect(component.estAromate(varietesTest[0])).toBe(false);
  });

  it('devrait filtrer les variétés par nom', () => {
    component.varietes.set(varietesTest);
    component.rechercheNom.set('marmande');

    expect(component.varietesFiltrees()).toEqual([varietesTest[0]]);
  });

  it('devrait filtrer les variétés bio', () => {
    component.varietes.set(varietesTest);
    component.bioRecherche.set('bio');

    expect(component.varietesFiltrees()).toEqual([varietesTest[0]]);
  });

  it('devrait filtrer les variétés non bio', () => {
    component.varietes.set(varietesTest);
    component.bioRecherche.set('non-bio');

    expect(component.varietesFiltrees()).toEqual([varietesTest[1]]);
  });

  it('devrait filtrer les aromates', () => {
    component.varietes.set(varietesTest);
    component.typeRecherche.set('aromate');

    expect(component.varietesFiltrees()).toEqual([varietesTest[1]]);
  });

  it('devrait filtrer les légumes', () => {
    component.varietes.set(varietesTest);
    component.typeRecherche.set('legume');

    expect(component.varietesFiltrees()).toEqual([varietesTest[0]]);
  });

  it('devrait filtrer par espèce', () => {
    component.varietes.set(varietesTest);
    component.especeRecherche.set('Tomate');

    expect(component.varietesFiltrees()).toEqual([varietesTest[0]]);
  });

  it('devrait filtrer par ensoleillement', () => {
    component.varietes.set(varietesTest);
    component.ensoleillementRecherche.set('Mi-ombre');

    expect(component.varietesFiltrees()).toEqual([varietesTest[1]]);
  });

  it('devrait filtrer par cycle de vie', () => {
    component.varietes.set(varietesTest);
    component.cycleVieRecherche.set('Vivace');

    expect(component.varietesFiltrees()).toEqual([varietesTest[1]]);
  });

  it('devrait retourner les espèces disponibles triées', () => {
    component.varietes.set(varietesTest);

    expect(component.especesDisponibles()).toEqual(['Camomille', 'Tomate']);
  });

  it('devrait retourner les ensoleillements disponibles triés', () => {
    component.varietes.set(varietesTest);

    expect(component.ensoleillementsDisponibles()).toEqual(['Mi-ombre', 'Soleil']);
  });

  it('devrait retourner les cycles de vie disponibles triés', () => {
    component.varietes.set(varietesTest);

    expect(component.cyclesVieDisponibles()).toEqual(['Annuelle', 'Vivace']);
  });
});