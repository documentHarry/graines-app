import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UtilisateurSupprimerComponent } from './utilisateur-supprimer.component';


describe('UtilisateurSupprimerComponent', () => {
  let component: UtilisateurSupprimerComponent;
  let fixture: ComponentFixture<UtilisateurSupprimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateurSupprimerComponent],
      providers: [ provideRouter([]) ],
    }).compileComponents();

    fixture = TestBed.createComponent(UtilisateurSupprimerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
