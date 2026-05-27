import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UtilisateurModifierComponent } from './utilisateur-modifier.component';

describe('UtilisateurModifierComponent', () => {
  let component: UtilisateurModifierComponent;
  let fixture: ComponentFixture<UtilisateurModifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateurModifierComponent],
      providers: [ provideRouter([]) ]
    }).compileComponents();

    fixture = TestBed.createComponent(UtilisateurModifierComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
