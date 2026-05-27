import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AvisSupprimerComponent } from './avis-supprimer.component';

describe('AvisSupprimerComponent', () => {
  let component: AvisSupprimerComponent;
  let fixture: ComponentFixture<AvisSupprimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvisSupprimerComponent],
      providers: [ provideRouter([]) ],
    }).compileComponents();

    fixture = TestBed.createComponent(AvisSupprimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});