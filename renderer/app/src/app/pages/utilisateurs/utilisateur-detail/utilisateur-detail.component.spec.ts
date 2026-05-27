import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UtilisateurDetailComponent } from './utilisateur-detail.component';

describe('UtilisateurDetailComponent', () => {
  let component: UtilisateurDetailComponent;
  let fixture: ComponentFixture<UtilisateurDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateurDetailComponent],
      providers: [ provideRouter([]) ],
    }).compileComponents();

    fixture = TestBed.createComponent(UtilisateurDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
