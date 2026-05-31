import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitFiltresComponent } from './produit-filtres.component';

describe('ProduitFiltresComponent', () => {
  let component: ProduitFiltresComponent;
  let fixture: ComponentFixture<ProduitFiltresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitFiltresComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProduitFiltresComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('categories', ['Légumes', 'Aromates']);
    fixture.componentRef.setInput('varietes', ['Tomate Roma', 'Basilic']);
    fixture.componentRef.setInput('especes', ['Tomate', 'Basilic']);
    fixture.componentRef.setInput('prixMinimumDisponible', 2);
    fixture.componentRef.setInput('prixMaximumDisponible', 10);

    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait mettre à jour la recherche texte', () => {
    const event = {
      target: { value: 'tomate' },
    } as unknown as Event;

    component.changerRecherche(event);

    expect(component.recherche()).toBe('tomate');
  });

  it('devrait mettre à jour le filtre de stock', () => {
    const event = {
      target: { value: 'en-stock' },
    } as unknown as Event;

    component.changerStockRecherche(event);

    expect(component.stockRecherche()).toBe('en-stock');
  });

  it('devrait mettre à jour le filtre aromate', () => {
    const event = {
      target: { value: 'aromate' },
    } as unknown as Event;

    component.changerAromateRecherche(event);

    expect(component.aromateRecherche()).toBe('aromate');
  });

  it('devrait mettre à jour le filtre catégorie', () => {
    const event = {
      target: { value: 'Légumes' },
    } as unknown as Event;

    component.changerCategorieRecherche(event);

    expect(component.categorieRecherche()).toBe('Légumes');
  });

  it('devrait mettre à jour le filtre variété', () => {
    const event = {
      target: { value: 'Tomate Roma' },
    } as unknown as Event;

    component.changerVarieteRecherche(event);

    expect(component.varieteRecherche()).toBe('Tomate Roma');
  });

  it('devrait mettre à jour le filtre espèce', () => {
    const event = {
      target: { value: 'Tomate' },
    } as unknown as Event;

    component.changerEspeceRecherche(event);

    expect(component.especeRecherche()).toBe('Tomate');
  });

  it('devrait mettre à jour le prix minimum', () => {
    const event = {
      target: { value: '5' },
    } as unknown as Event;

    component.changerPrixMinRecherche(event);

    expect(component.prixMinRecherche()).toBe('5');
  });

  it('devrait vider le prix minimum si le champ est vide', () => {
    component.prixMinRecherche.set('5');

    const event = {
      target: { value: '' },
    } as unknown as Event;

    component.changerPrixMinRecherche(event);

    expect(component.prixMinRecherche()).toBe('');
  });

  it('devrait ramener le prix minimum au minimum disponible si la valeur est trop basse', () => {
    const event = {
      target: { value: '1' },
    } as unknown as Event;

    component.changerPrixMinRecherche(event);

    expect(component.prixMinRecherche()).toBe('2');
  });

  it('devrait ramener le prix minimum au maximum disponible si la valeur est trop haute', () => {
    const event = {
      target: { value: '15' },
    } as unknown as Event;

    component.changerPrixMinRecherche(event);

    expect(component.prixMinRecherche()).toBe('10');
  });

  it('devrait mettre à jour le prix maximum', () => {
    const event = {
      target: { value: '8' },
    } as unknown as Event;

    component.changerPrixMaxRecherche(event);

    expect(component.prixMaxRecherche()).toBe('8');
  });

  it('devrait vider le prix maximum si le champ est vide', () => {
    component.prixMaxRecherche.set('8');

    const event = {
      target: { value: '' },
    } as unknown as Event;

    component.changerPrixMaxRecherche(event);

    expect(component.prixMaxRecherche()).toBe('');
  });

  it('devrait ramener le prix maximum au maximum disponible si la valeur est trop haute', () => {
    const event = {
      target: { value: '15' },
    } as unknown as Event;

    component.changerPrixMaxRecherche(event);

    expect(component.prixMaxRecherche()).toBe('10');
  });

  it('devrait ramener le prix maximum au minimum disponible si la valeur est trop basse', () => {
    const event = {
      target: { value: '1' },
    } as unknown as Event;

    component.changerPrixMaxRecherche(event);

    expect(component.prixMaxRecherche()).toBe('2');
  });

  it('devrait réinitialiser tous les filtres', () => {
    component.recherche.set('tomate');
    component.stockRecherche.set('en-stock');
    component.aromateRecherche.set('aromate');
    component.prixMinRecherche.set('3');
    component.prixMaxRecherche.set('8');
    component.categorieRecherche.set('Légumes');
    component.varieteRecherche.set('Tomate Roma');
    component.especeRecherche.set('Tomate');

    component.resetFiltres();

    expect(component.recherche()).toBe('');
    expect(component.stockRecherche()).toBe('');
    expect(component.aromateRecherche()).toBe('');
    expect(component.prixMinRecherche()).toBe('');
    expect(component.prixMaxRecherche()).toBe('');
    expect(component.categorieRecherche()).toBe('');
    expect(component.varieteRecherche()).toBe('');
    expect(component.especeRecherche()).toBe('');
  });
});