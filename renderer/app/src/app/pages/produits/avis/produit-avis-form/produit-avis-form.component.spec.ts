import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { ProduitAvisFormComponent } from './produit-avis-form.component';
import { Avis } from '../../../../types/electron';

describe('ProduitAvisFormComponent', () => {
  let component: ProduitAvisFormComponent;
  let fixture: ComponentFixture<ProduitAvisFormComponent>;
  let onEnregistrerMock: ReturnType<typeof vi.fn>;
  let onAnnulerMock: ReturnType<typeof vi.fn>;

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
    onEnregistrerMock = vi.fn();
    onAnnulerMock = vi.fn();

    await TestBed.configureTestingModule({
      imports: [ProduitAvisFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProduitAvisFormComponent);
    fixture.componentRef.setInput('mode', 'ajout');
    fixture.componentRef.setInput('avis', null);
    fixture.componentRef.setInput('onEnregistrer', onEnregistrerMock);
    fixture.componentRef.setInput('onAnnuler', onAnnulerMock);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait initialiser le formulaire en mode ajout', () => {
    expect(component.avisForm.getRawValue()).toEqual({
      note: 5,
      titre: '',
      commentaire: '',
    });
  });

  it('devrait retourner le titre du formulaire en mode ajout', () => {
    expect(component.getTitreFormulaire()).toBe('Ajouter un avis');
  });

  it('devrait initialiser le formulaire avec l’avis en mode modification', () => {
    fixture.componentRef.setInput('mode', 'modification');
    fixture.componentRef.setInput('avis', avisMock);
    fixture.detectChanges();

    expect(component.avisForm.getRawValue()).toEqual({
      note: 8,
      titre: 'Très bon produit',
      commentaire: 'Bonne germination',
    });
  });

  it('devrait retourner le titre du formulaire en mode modification', () => {
    fixture.componentRef.setInput('mode', 'modification');
    fixture.componentRef.setInput('avis', avisMock);
    fixture.detectChanges();

    expect(component.getTitreFormulaire()).toBe('Modifier un avis');
  });

  it('devrait invalider une note inférieure à 1', () => {
    component.avisForm.patchValue({
      note: 0,
      titre: 'Test',
      commentaire: 'Commentaire',
    });

    expect(component.avisForm.invalid).toBe(true);
  });

  it('devrait invalider une note supérieure à 10', () => {
    component.avisForm.patchValue({
      note: 11,
      titre: 'Test',
      commentaire: 'Commentaire',
    });

    expect(component.avisForm.invalid).toBe(true);
  });

  it('devrait envoyer le formulaire avec les valeurs nettoyées', () => {
    component.avisForm.patchValue({
      note: 7,
      titre: ' Bon avis ',
      commentaire: ' Correct ',
    });

    component.envoyerFormulaire();

    expect(onEnregistrerMock).toHaveBeenCalledWith({
      note: 7,
      titre: 'Bon avis',
      commentaire: 'Correct',
    });
  });

  it('devrait convertir les champs texte vides en null', () => {
    component.avisForm.patchValue({
      note: 6,
      titre: '   ',
      commentaire: '',
    });

    component.envoyerFormulaire();

    expect(onEnregistrerMock).toHaveBeenCalledWith({
      note: 6,
      titre: null,
      commentaire: null,
    });
  });

  it('ne devrait pas envoyer le formulaire s’il est invalide', () => {
    component.avisForm.patchValue({
      note: 0,
      titre: 'Test',
      commentaire: 'Commentaire',
    });

    component.envoyerFormulaire();

    expect(onEnregistrerMock).not.toHaveBeenCalled();
    expect(component.avisForm.controls.note.touched).toBe(true);
  });

  it('devrait annuler le formulaire', () => {
    component.annulerFormulaire();

    expect(onAnnulerMock).toHaveBeenCalled();
  });
});