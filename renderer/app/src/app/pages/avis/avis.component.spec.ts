import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { AvisComponent } from './avis.component';
import { AvisService } from '../../services/avis.service';
import { AuthService } from '../../services/auth.service';
import { Avis } from '../../types/electron';

describe('AvisComponent', () => {
  let component: AvisComponent;
  let fixture: ComponentFixture<AvisComponent>;
  let avisServiceMock: {
    getAvis: ReturnType<typeof vi.fn>;
    deleteAvis: ReturnType<typeof vi.fn>;
  };
  let authServiceMock: {
    hasAnyRole: ReturnType<typeof vi.fn>;
    hasRole: ReturnType<typeof vi.fn>;
    isLoggedIn: ReturnType<typeof vi.fn>;
  };

const avisMock = [
  {
    id_avis: 1,
    note: 8,
    titre: 'Très bon produit',
    commentaire: 'Très bonne germination',
    date_depot: '2026-05-31 10:00:00',
    statut: 'nouveau',
    nombre_jaime: 4,
    utilisateur_id: 1,
    produit_id: 10,
    utilisateur: {
      id_utilisateur: 1,
      prenom: 'Marie',
      nom: 'Dupont',
      email: 'marie@example.com',
    },
    produit: {
      id_produit: 10,
      intitule: 'Graines de basilic',
      prix_unitaire: 3.5,
      quantite: 12,
      image_produit: null,
      date_ajout: '2026-05-31 10:00:00',
      categorie_id: 1,
      variete_id: 1,
      categorie: {
        id_categorie: 1,
        nom_categorie: 'Aromates',
        descriptif: null,
      },
      variete: {
        id_variete: 1,
        nom: 'Basilic Genovese',
        descriptif: null,
        bio: 1,
        cycle_jours: null,
        cycle_de_vie: null,
        type_ensoleillement: null,
        type_feuillage: null,
        date_semis_min: null,
        date_semis_max: null,
        duree_avant_recolte: null,
        type_de_sol: null,
        duree_de_germination: null,
        temperature_min_de_germination: null,
        rusticite_plante: null,
        conseil_plantation: null,
        couleur_legume: null,
        taille_fixe_legume: null,
        taille_min_legume: null,
        taille_max_legume: null,
        espacement_entre_les_plants: null,
        espacement_entre_les_lignes: null,
        hauteur_adulte_min: null,
        hauteur_adulte_max: null,
        espece_id: 1,
        espece: {
          id_espece: 1,
          nom_commun: 'Basilic',
          nom_scientifique: 'Ocimum basilicum',
        },
      },
    },
  },
  {
    id_avis: 2,
    note: 3,
    titre: 'Décevant',
    commentaire: 'Le sachet était abîmé',
    date_depot: '2026-05-31 11:00:00',
    statut: 'modifié',
    nombre_jaime: 0,
    utilisateur_id: 2,
    produit_id: 11,
    utilisateur: {
      id_utilisateur: 2,
      prenom: 'Jean',
      nom: 'Martin',
      email: 'jean@example.com',
    },
    produit: {
      id_produit: 11,
      intitule: 'Graines de tomate',
      prix_unitaire: 4.2,
      quantite: 8,
      image_produit: null,
      date_ajout: '2026-05-31 11:00:00',
      categorie_id: 1,
      variete_id: 2,
      categorie: {
        id_categorie: 1,
        nom_categorie: 'Légumes',
        descriptif: null,
      },
      variete: {
        id_variete: 2,
        nom: 'Tomate Roma',
        descriptif: null,
        bio: 0,
        cycle_jours: null,
        cycle_de_vie: null,
        type_ensoleillement: null,
        type_feuillage: null,
        date_semis_min: null,
        date_semis_max: null,
        duree_avant_recolte: null,
        type_de_sol: null,
        duree_de_germination: null,
        temperature_min_de_germination: null,
        rusticite_plante: null,
        conseil_plantation: null,
        couleur_legume: null,
        taille_fixe_legume: null,
        taille_min_legume: null,
        taille_max_legume: null,
        espacement_entre_les_plants: null,
        espacement_entre_les_lignes: null,
        hauteur_adulte_min: null,
        hauteur_adulte_max: null,
        espece_id: 2,
        espece: {
          id_espece: 2,
          nom_commun: 'Tomate',
          nom_scientifique: 'Solanum lycopersicum',
        },
      },
    },
  },
] as Avis[];

  beforeEach(async () => {
    avisServiceMock = {
      getAvis: vi.fn().mockResolvedValue(avisMock),
      deleteAvis: vi.fn().mockResolvedValue(undefined),
    };

    authServiceMock = {
      hasAnyRole: vi.fn().mockReturnValue(true),
      hasRole: vi.fn().mockReturnValue(false),
      isLoggedIn: vi.fn().mockReturnValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [AvisComponent],
      providers: [
        { provide: AvisService, useValue: avisServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AvisComponent);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger les avis à l’initialisation', async () => {
    await component.ngOnInit();

    expect(avisServiceMock.getAvis).toHaveBeenCalled();
    expect(component.avis()).toEqual(avisMock);
    expect(component.isLoading()).toBe(false);
    expect(component.message()).toBe('');
  });

  it('devrait afficher un message si le chargement échoue', async () => {
    avisServiceMock.getAvis.mockRejectedValue(new Error('Erreur test'));

    await component.chargerAvis();

    expect(component.message()).toBe('Erreur pendant le chargement des avis.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait retourner le nom complet de l’auteur', () => {
    const auteur = component.getAuteur(avisMock[0]);

    expect(auteur).toBe('Marie Dupont');
  });

  it('devrait filtrer les avis par titre', () => {
    component.avis.set(avisMock);
    component.titreRecherche.set('décevant');

    expect(component.avisFiltres()).toEqual([avisMock[1]]);
  });

  it('devrait filtrer les avis par commentaire', () => {
    component.avis.set(avisMock);
    component.commentaireRecherche.set('germination');

    expect(component.avisFiltres()).toEqual([avisMock[0]]);
  });

  it('devrait filtrer les avis par produit', () => {
    component.avis.set(avisMock);
    component.produitRecherche.set('tomate');

    expect(component.avisFiltres()).toEqual([avisMock[1]]);
  });

  it('devrait filtrer les avis par auteur', () => {
    component.avis.set(avisMock);
    component.auteurRecherche.set('marie');

    expect(component.avisFiltres()).toEqual([avisMock[0]]);
  });

  it('devrait filtrer les avis par note', () => {
    component.avis.set(avisMock);
    component.noteRecherche.set('3');

    expect(component.avisFiltres()).toEqual([avisMock[1]]);
  });

  it('devrait filtrer les avis par statut', () => {
    component.avis.set(avisMock);
    component.statutRecherche.set('nouveau');

    expect(component.avisFiltres()).toEqual([avisMock[0]]);
  });

  it('devrait filtrer les avis par nombre minimum de j’aime', () => {
    component.avis.set(avisMock);
    component.jaimeMinRecherche.set('2');

    expect(component.avisFiltres()).toEqual([avisMock[0]]);
  });

  it('devrait supprimer un avis après confirmation', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    await component.supprimerAvis(1);

    expect(confirmSpy).toHaveBeenCalledWith('Voulez-vous vraiment supprimer cet avis ?');
    expect(avisServiceMock.deleteAvis).toHaveBeenCalledWith(1);
    expect(avisServiceMock.getAvis).toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('ne devrait pas supprimer un avis si la confirmation est annulée', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    await component.supprimerAvis(1);

    expect(avisServiceMock.deleteAvis).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('devrait afficher un message si la suppression échoue', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    avisServiceMock.deleteAvis.mockRejectedValue(new Error('Erreur suppression'));

    await component.supprimerAvis(1);

    expect(component.message()).toBe('Erreur pendant la suppression de l’avis.');
  });
});