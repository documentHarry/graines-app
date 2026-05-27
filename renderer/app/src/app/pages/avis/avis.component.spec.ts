import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AvisComponent } from './avis.component';

describe('AvisComponent', () => {
  let component: AvisComponent;
  let fixture: ComponentFixture<AvisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvisComponent],
      providers: [
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AvisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});