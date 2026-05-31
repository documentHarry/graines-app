import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisFiltresComponent } from './avis-filtres.component';

describe('AvisFiltresComponent', () => {
  let component: AvisFiltresComponent;
  let fixture: ComponentFixture<AvisFiltresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvisFiltresComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AvisFiltresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait mettre à jour la recherche par titre', () => {
    const event = {
      target: { value: 'tomate' },
    } as unknown as Event;

    component.changerTitreRecherche(event);

    expect(component.titreRecherche()).toBe('tomate');
  });

  it('devrait mettre à jour la recherche par commentaire', () => {
    const event = {
      target: { value: 'mauvais produit' },
    } as unknown as Event;

    component.changerCommentaireRecherche(event);

    expect(component.commentaireRecherche()).toBe('mauvais produit');
  });

  it('devrait mettre à jour la recherche par produit', () => {
    const event = {
      target: { value: 'basilic' },
    } as unknown as Event;

    component.changerProduitRecherche(event);

    expect(component.produitRecherche()).toBe('basilic');
  });

  it('devrait mettre à jour la recherche par auteur', () => {
    const event = {
      target: { value: 'Marie Dupont' },
    } as unknown as Event;

    component.changerAuteurRecherche(event);

    expect(component.auteurRecherche()).toBe('Marie Dupont');
  });

  it('devrait mettre à jour la recherche par note', () => {
    const event = {
      target: { value: '8' },
    } as unknown as Event;

    component.changerNoteRecherche(event);

    expect(component.noteRecherche()).toBe('8');
  });

  it('devrait mettre à jour la recherche par statut', () => {
    const event = {
      target: { value: 'modifié' },
    } as unknown as Event;

    component.changerStatutRecherche(event);

    expect(component.statutRecherche()).toBe('modifié');
  });

  it('devrait mettre à jour la recherche par minimum de j’aime', () => {
    const event = {
      target: { value: '3' },
    } as unknown as Event;

    component.changerJaimeMinRecherche(event);

    expect(component.jaimeMinRecherche()).toBe('3');
  });

  it('devrait réinitialiser tous les filtres', () => {
    component.titreRecherche.set('titre');
    component.commentaireRecherche.set('commentaire');
    component.produitRecherche.set('produit');
    component.auteurRecherche.set('auteur');
    component.noteRecherche.set('5');
    component.statutRecherche.set('nouveau');
    component.jaimeMinRecherche.set('2');

    component.resetFiltres();

    expect(component.titreRecherche()).toBe('');
    expect(component.commentaireRecherche()).toBe('');
    expect(component.produitRecherche()).toBe('');
    expect(component.auteurRecherche()).toBe('');
    expect(component.noteRecherche()).toBe('');
    expect(component.statutRecherche()).toBe('');
    expect(component.jaimeMinRecherche()).toBe('');
  });
});