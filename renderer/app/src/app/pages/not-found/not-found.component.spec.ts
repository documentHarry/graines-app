import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [ provideRouter([]) ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
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
});