import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { VarietesComponent } from './varietes.component';
import { VarieteService } from '../../services/variete.service';
import { Variete } from '../../types/electron';

describe('VarietesComponent', () => {
  let component: VarietesComponent;
  let fixture: ComponentFixture<VarietesComponent>;

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
      _count: {
        produit: 3,
      },
    },
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
      espece_id: 2,
      espece: {
        id_espece: 2,
        nom_scientifique: 'Chamaemelum nobile',
        nom_commun: 'Camomille',
      },
      _count: {
        produit: 0,
      },
    },
  ];

  const varieteServiceMock = {
    getVarietes: () => Promise.resolve(varietesTest),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VarietesComponent],
      providers: [
        provideRouter([]),
        {
          provide: VarieteService,
          useValue: varieteServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VarietesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger les variétés depuis le service', async () => {
    await component.chargerVarietes();

    expect(component.varietes().length).toBe(2);
    expect(component.varietes()[0].nom).toBe('Marmande');
    expect(component.isLoading()).toBe(false);
    expect(component.message()).toBe('');
  });

  it('devrait afficher un message d’erreur si le chargement échoue', async () => {
    const service = TestBed.inject(VarieteService);

    service.getVarietes = () => Promise.reject();

    await component.chargerVarietes();

    expect(component.message()).toBe('Erreur pendant le chargement des variétés.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait retourner le nombre de produits associés à une variété', () => {
    const nombreProduits = component.getNombreProduits(varietesTest[0]);

    expect(nombreProduits).toBe(3);
  });

  it('devrait retourner 0 si le compteur de produits est absent', () => {
    const varieteSansCompteur: Variete = {
      id_variete: 3,
      nom: 'Basilic grand vert',
      descriptif: null,
      bio: 0,
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
      espece_id: 3,
      espece: {
        id_espece: 3,
        nom_scientifique: 'Ocimum basilicum',
        nom_commun: 'Basilic',
      },
    };

    const nombreProduits = component.getNombreProduits(varieteSansCompteur);

    expect(nombreProduits).toBe(0);
  });

  it('devrait afficher Bio quand la variété est bio', () => {
    expect(component.getLabelBio(varietesTest[0])).toBe('Bio');
  });

  it('devrait afficher Non bio quand la variété n’est pas bio', () => {
    expect(component.getLabelBio(varietesTest[1])).toBe('Non bio');
  });
});