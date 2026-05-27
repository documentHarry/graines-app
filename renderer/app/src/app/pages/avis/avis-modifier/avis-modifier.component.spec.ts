import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AvisModifierComponent } from './avis-modifier.component';

describe('AvisModifierComponent', () => {
  let component: AvisModifierComponent;
  let fixture: ComponentFixture<AvisModifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvisModifierComponent],
      providers: [ provideRouter([]) ],
    }).compileComponents();

    fixture = TestBed.createComponent(AvisModifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});