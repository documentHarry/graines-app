import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarieteFiltresComponent } from './variete-filtres.component';

describe('VarieteFiltresComponent', () => {
  let component: VarieteFiltresComponent;
  let fixture: ComponentFixture<VarieteFiltresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VarieteFiltresComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VarieteFiltresComponent);
    fixture.componentRef.setInput('especes', ['Tomate', 'Basilic']);
    fixture.componentRef.setInput('ensoleillements', ['Soleil', 'Mi-ombre']);
    fixture.componentRef.setInput('cyclesVie', ['Annuelle', 'Vivace']);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait recevoir les espèces disponibles', () => {
    expect(component.especes()).toEqual(['Tomate', 'Basilic']);
  });

  it('devrait recevoir les ensoleillements disponibles', () => {
    expect(component.ensoleillements()).toEqual(['Soleil', 'Mi-ombre']);
  });

  it('devrait recevoir les cycles de vie disponibles', () => {
    expect(component.cyclesVie()).toEqual(['Annuelle', 'Vivace']);
  });

  it('devrait mettre à jour la recherche par nom', () => {
    const event = {
      target: { value: 'marmande' },
    } as unknown as Event;

    component.changerRechercheNom(event);

    expect(component.rechercheNom()).toBe('marmande');
  });

  it('devrait mettre à jour la recherche bio', () => {
    const event = {
      target: { value: 'bio' },
    } as unknown as Event;

    component.changerBioRecherche(event);

    expect(component.bioRecherche()).toBe('bio');
  });

  it('devrait mettre à jour la recherche par espèce', () => {
    const event = {
      target: { value: 'Tomate' },
    } as unknown as Event;

    component.changerEspeceRecherche(event);

    expect(component.especeRecherche()).toBe('Tomate');
  });

  it('devrait mettre à jour la recherche par ensoleillement', () => {
    const event = {
      target: { value: 'Soleil' },
    } as unknown as Event;

    component.changerEnsoleillementRecherche(event);

    expect(component.ensoleillementRecherche()).toBe('Soleil');
  });

  it('devrait mettre à jour la recherche par cycle de vie', () => {
    const event = {
      target: { value: 'Vivace' },
    } as unknown as Event;

    component.changerCycleVieRecherche(event);

    expect(component.cycleVieRecherche()).toBe('Vivace');
  });

  it('devrait réinitialiser tous les filtres', () => {
    component.rechercheNom.set('marmande');
    component.bioRecherche.set('bio');
    component.especeRecherche.set('Tomate');
    component.ensoleillementRecherche.set('Soleil');
    component.cycleVieRecherche.set('Vivace');

    component.resetFiltres();

    expect(component.rechercheNom()).toBe('');
    expect(component.bioRecherche()).toBe('');
    expect(component.especeRecherche()).toBe('');
    expect(component.ensoleillementRecherche()).toBe('');
    expect(component.cycleVieRecherche()).toBe('');
  });
});