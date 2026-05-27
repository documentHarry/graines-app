import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AvisAjouterComponent } from './avis-ajouter.component';

describe('AvisAjouterComponent', () => {
  let component: AvisAjouterComponent;
  let fixture: ComponentFixture<AvisAjouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvisAjouterComponent],
      providers: [ provideRouter([]) ],
    }).compileComponents();

    fixture = TestBed.createComponent(AvisAjouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});