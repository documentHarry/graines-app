import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';

import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let routerMock: {
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    routerMock = {
      navigate: vi.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher le titre de la page 404', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('404');
  });

  it('devrait afficher un bouton de retour à l’accueil', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Retour à l\'accueil');
  });

  it('devrait rediriger vers l’accueil', () => {
    component.goToHome();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});