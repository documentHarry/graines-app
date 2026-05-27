import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UtilisateursComponent } from './utilisateurs.component';

describe('UtilisateursComponent', () => {
  let component: UtilisateursComponent;
  let fixture: ComponentFixture<UtilisateursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateursComponent],
      providers: [ provideRouter([]) ]
    }).compileComponents();

    fixture = TestBed.createComponent(UtilisateursComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
