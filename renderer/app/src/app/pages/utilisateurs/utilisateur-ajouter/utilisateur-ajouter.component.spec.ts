import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UtilisateurAjouterComponent } from './utilisateur-ajouter.component';

describe('UtilisateurAjouterComponent', () => {
  let component: UtilisateurAjouterComponent;
  let fixture: ComponentFixture<UtilisateurAjouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateurAjouterComponent],
      providers: [ provideRouter([]) ],
    }).compileComponents();

    fixture = TestBed.createComponent(UtilisateurAjouterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
