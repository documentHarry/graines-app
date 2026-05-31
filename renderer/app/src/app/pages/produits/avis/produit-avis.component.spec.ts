import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { ProduitAvisComponent } from './produit-avis.component';
import { AvisService } from '../../../services/avis.service';
import { AuthService, UtilisateurConnecte } from '../../../services/auth.service';
import { Avis } from '../../../types/electron';

describe('ProduitAvisComponent', () => {
  let component: ProduitAvisComponent;
  let fixture: ComponentFixture<ProduitAvisComponent>;

  let avisServiceMock: {
    getAvisByProduit: ReturnType<typeof vi.fn>;
    createAvis: ReturnType<typeof vi.fn>;
    updateAvis: ReturnType<typeof vi.fn>;
    deleteAvis: ReturnType<typeof vi.fn>;
    likeAvis: ReturnType<typeof vi.fn>;
  };

  let authServiceMock: {
    getUtilisateur: ReturnType<typeof vi.fn>;
    hasRole: ReturnType<typeof vi.fn>;
    hasAnyRole: ReturnType<typeof vi.fn>;
  };

  const utilisateurConnecte: UtilisateurConnecte = {
    id_utilisateur: 1,
    prenom: 'Marie',
    nom: 'Dupont',
    email: 'marie@example.com',
    roles: ['CLIENT'],
  };

  const avisMock = {
    id_avis: 1,
    note: 8,
    titre: 'Très bon produit',
    commentaire: 'Bonne germination',
    date_depot: '2026-05-31 10:00:00',
    statut: 'nouveau',
    nombre_jaime: 2,
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
    },
  } as Avis;

  beforeEach(async () => {
    avisServiceMock = {
      getAvisByProduit: vi.fn().mockResolvedValue([avisMock]),
      createAvis: vi.fn().mockResolvedValue(undefined),
      updateAvis: vi.fn().mockResolvedValue(undefined),
      deleteAvis: vi.fn().mockResolvedValue(undefined),
      likeAvis: vi.fn().mockResolvedValue(undefined),
    };

    authServiceMock = {
      getUtilisateur: vi.fn().mockReturnValue(utilisateurConnecte),
      hasRole: vi.fn().mockReturnValue(false),
      hasAnyRole: vi.fn().mockReturnValue(false),
    };

    await TestBed.configureTestingModule({
      imports: [ProduitAvisComponent],
      providers: [
        { provide: AvisService, useValue: avisServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProduitAvisComponent);
    fixture.componentRef.setInput('produitId', 10);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('devrait charger les avis du produit', async () => {
    await component.chargerAvis();

    expect(avisServiceMock.getAvisByProduit).toHaveBeenCalledWith(10);
    expect(component.avis()).toEqual([avisMock]);
    expect(component.message()).toBe('');
  });

  it('devrait afficher un message si le chargement des avis échoue', async () => {
    avisServiceMock.getAvisByProduit.mockRejectedValue(new Error('Erreur test'));

    await component.chargerAvis();

    expect(component.message()).toBe('Erreur pendant le chargement des avis.');
  });

  it('devrait autoriser l’ajout pour un client ou un admin', () => {
    authServiceMock.hasAnyRole.mockReturnValue(true);

    expect(component.peutAjouterAvis()).toBe(true);
    expect(authServiceMock.hasAnyRole).toHaveBeenCalledWith(['CLIENT', 'ADMIN']);
  });

  it('devrait autoriser la modification par l’auteur de l’avis', () => {
    expect(component.peutModifierAvis(avisMock)).toBe(true);
  });

  it('devrait autoriser la modification par un admin', () => {
    authServiceMock.getUtilisateur.mockReturnValue({
      ...utilisateurConnecte,
      id_utilisateur: 99,
      roles: ['ADMIN'],
    });
    authServiceMock.hasRole.mockReturnValue(true);

    expect(component.peutModifierAvis(avisMock)).toBe(true);
  });

  it('devrait refuser la modification si l’utilisateur n’est ni auteur ni admin', () => {
    authServiceMock.getUtilisateur.mockReturnValue({
      ...utilisateurConnecte,
      id_utilisateur: 99,
      roles: ['CLIENT'],
    });
    authServiceMock.hasRole.mockReturnValue(false);

    expect(component.peutModifierAvis(avisMock)).toBe(false);
  });

  it('devrait autoriser la suppression par l’auteur', () => {
    expect(component.peutSupprimerAvis(avisMock)).toBe(true);
  });

  it('devrait autoriser la suppression par un modérateur ou admin', () => {
    authServiceMock.getUtilisateur.mockReturnValue({
      ...utilisateurConnecte,
      id_utilisateur: 99,
      roles: ['MODERATEUR'],
    });
    authServiceMock.hasAnyRole.mockReturnValue(true);

    expect(component.peutSupprimerAvis(avisMock)).toBe(true);
  });

  it('devrait passer en mode ajout', () => {
    component.afficherAjoutAvis();

    expect(component.modeAvis()).toBe('ajout');
    expect(component.avisSelectionne()).toBeNull();
    expect(component.avisASupprimer()).toBeNull();
  });

  it('devrait passer en mode modification', () => {
    component.afficherModificationAvis(avisMock);

    expect(component.modeAvis()).toBe('modification');
    expect(component.avisSelectionne()).toEqual(avisMock);
    expect(component.avisASupprimer()).toBeNull();
  });

  it('devrait préparer la suppression d’un avis', () => {
    component.demanderSuppressionAvis(avisMock);

    expect(component.avisASupprimer()).toEqual(avisMock);
    expect(component.modeAvis()).toBe('aucun');
    expect(component.avisSelectionne()).toBeNull();
  });

  it('devrait annuler l’action en cours', () => {
    component.afficherModificationAvis(avisMock);
    component.demanderSuppressionAvis(avisMock);

    component.annulerActionAvis();

    expect(component.modeAvis()).toBe('aucun');
    expect(component.avisSelectionne()).toBeNull();
    expect(component.avisASupprimer()).toBeNull();
  });

  it('devrait créer un avis en mode ajout', async () => {
    component.afficherAjoutAvis();

    await component.enregistrerAvis({
      note: 7,
      titre: 'Bon produit',
      commentaire: 'Correct',
    });

    expect(avisServiceMock.createAvis).toHaveBeenCalledWith({
      note: 7,
      titre: 'Bon produit',
      commentaire: 'Correct',
      utilisateur_id: 1,
      produit_id: 10,
    });

    expect(component.modeAvis()).toBe('aucun');
  });

  it('devrait modifier un avis en mode modification', async () => {
    component.afficherModificationAvis(avisMock);

    await component.enregistrerAvis({
      note: 9,
      titre: 'Très bien',
      commentaire: 'Encore mieux',
    });

    expect(avisServiceMock.updateAvis).toHaveBeenCalledWith({
      id_avis: 1,
      note: 9,
      titre: 'Très bien',
      commentaire: 'Encore mieux',
    });

    expect(component.modeAvis()).toBe('aucun');
  });

  it('devrait afficher un message si aucun utilisateur n’est connecté lors de l’enregistrement', async () => {
    authServiceMock.getUtilisateur.mockReturnValue(null);

    await component.enregistrerAvis({
      note: 7,
      titre: 'Bon produit',
      commentaire: 'Correct',
    });

    expect(component.message()).toBe('Vous devez être connecté pour enregistrer un avis.');
    expect(avisServiceMock.createAvis).not.toHaveBeenCalled();
  });

  it('devrait afficher un message si l’enregistrement échoue', async () => {
    avisServiceMock.createAvis.mockRejectedValue(new Error('Erreur test'));
    component.afficherAjoutAvis();

    await component.enregistrerAvis({
      note: 7,
      titre: 'Bon produit',
      commentaire: 'Correct',
    });

    expect(component.message()).toBe('Erreur pendant l’enregistrement de l’avis.');
  });

  it('devrait confirmer la suppression d’un avis', async () => {
    await component.confirmerSuppressionAvis(avisMock);

    expect(avisServiceMock.deleteAvis).toHaveBeenCalledWith(1);
    expect(component.modeAvis()).toBe('aucun');
  });

  it('devrait afficher un message si la suppression échoue', async () => {
    avisServiceMock.deleteAvis.mockRejectedValue(new Error('Erreur test'));

    await component.confirmerSuppressionAvis(avisMock);

    expect(component.message()).toBe('Erreur pendant la suppression de l’avis.');
  });

  it('devrait aimer un avis', async () => {
    await component.aimerAvis(1);

    expect(avisServiceMock.likeAvis).toHaveBeenCalledWith(1);
  });

  it('devrait afficher un message si le j’aime échoue', async () => {
    avisServiceMock.likeAvis.mockRejectedValue(new Error('Erreur test'));

    await component.aimerAvis(1);

    expect(component.message()).toBe('Erreur pendant l’ajout du j’aime.');
  });

  it('devrait retourner l’auteur de l’avis', () => {
    expect(component.getAuteurAvis(avisMock)).toBe('Marie Dupont');
  });

  it('devrait retourner la note formatée', () => {
    expect(component.getNoteAvis(avisMock)).toBe('8/10');
  });

  it('devrait retourner Non noté si la note est null', () => {
    expect(component.getNoteAvis({ ...avisMock, note: null } as Avis)).toBe('Non noté');
  });
});