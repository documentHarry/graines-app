import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { NavigationComponent } from './navigation.component';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher le lien Accueil', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('Accueil');
  });

  it('devrait afficher le lien Catégories', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('Catégories');
  });

  it('devrait afficher le lien Produits', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('Produits');
  });
});