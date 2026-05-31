import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateurFiltresComponent } from './utilisateur-filtres.component';

describe('UtilisateurFiltresComponent', () => {
  let component: UtilisateurFiltresComponent;
  let fixture: ComponentFixture<UtilisateurFiltresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateurFiltresComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UtilisateurFiltresComponent);
    fixture.componentRef.setInput('roles', ['ADMIN', 'CLIENT', 'MODERATEUR']);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait recevoir la liste des rôles', () => {
    expect(component.roles()).toEqual(['ADMIN', 'CLIENT', 'MODERATEUR']);
  });

  it('devrait mettre à jour la recherche par nom', () => {
    const event = {
      target: { value: 'Dupont' },
    } as unknown as Event;

    component.changerNomRecherche(event);

    expect(component.nomRecherche()).toBe('Dupont');
  });

  it('devrait mettre à jour la recherche par prénom', () => {
    const event = {
      target: { value: 'Marie' },
    } as unknown as Event;

    component.changerPrenomRecherche(event);

    expect(component.prenomRecherche()).toBe('Marie');
  });

  it('devrait mettre à jour la recherche par email', () => {
    const event = {
      target: { value: 'marie@example.com' },
    } as unknown as Event;

    component.changerEmailRecherche(event);

    expect(component.emailRecherche()).toBe('marie@example.com');
  });

  it('devrait mettre à jour la recherche par statut', () => {
    const event = {
      target: { value: 'actif' },
    } as unknown as Event;

    component.changerStatutRecherche(event);

    expect(component.statutRecherche()).toBe('actif');
  });

  it('devrait mettre à jour la recherche par rôle', () => {
    const event = {
      target: { value: 'ADMIN' },
    } as unknown as Event;

    component.changerRoleRecherche(event);

    expect(component.roleRecherche()).toBe('ADMIN');
  });

  it('devrait mettre à jour la recherche par adresse', () => {
    const event = {
      target: { value: 'avec-adresse' },
    } as unknown as Event;

    component.changerAdresseRecherche(event);

    expect(component.adresseRecherche()).toBe('avec-adresse');
  });

  it('devrait réinitialiser tous les filtres', () => {
    component.nomRecherche.set('Dupont');
    component.prenomRecherche.set('Marie');
    component.emailRecherche.set('marie@example.com');
    component.statutRecherche.set('actif');
    component.roleRecherche.set('ADMIN');
    component.adresseRecherche.set('avec-adresse');

    component.resetFiltres();

    expect(component.nomRecherche()).toBe('');
    expect(component.prenomRecherche()).toBe('');
    expect(component.emailRecherche()).toBe('');
    expect(component.statutRecherche()).toBe('');
    expect(component.roleRecherche()).toBe('');
    expect(component.adresseRecherche()).toBe('');
  });
});