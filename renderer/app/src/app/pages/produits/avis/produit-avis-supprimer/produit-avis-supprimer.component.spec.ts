import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { ProduitAvisSupprimerComponent } from './produit-avis-supprimer.component';
import { Avis } from '../../../../types/electron';

describe('ProduitAvisSupprimerComponent', () => {
  let component: ProduitAvisSupprimerComponent;
  let fixture: ComponentFixture<ProduitAvisSupprimerComponent>;
  let onConfirmerMock: ReturnType<typeof vi.fn>;
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
    onConfirmerMock = vi.fn();
    onAnnulerMock = vi.fn();

    await TestBed.configureTestingModule({
      imports: [ProduitAvisSupprimerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProduitAvisSupprimerComponent);
    fixture.componentRef.setInput('avis', avisMock);
    fixture.componentRef.setInput('onConfirmer', onConfirmerMock);
    fixture.componentRef.setInput('onAnnuler', onAnnulerMock);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait appeler la fonction de confirmation avec l’avis', () => {
    component.confirmerSuppression();

    expect(onConfirmerMock).toHaveBeenCalledWith(avisMock);
  });

  it('devrait appeler la fonction d’annulation', () => {
    component.annulerSuppression();

    expect(onAnnulerMock).toHaveBeenCalled();
  });
});