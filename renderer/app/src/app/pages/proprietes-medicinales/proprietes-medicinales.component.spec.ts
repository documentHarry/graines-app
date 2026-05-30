import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProprietesMedicinalesComponent } from './proprietes-medicinales.component';

describe('ProprietesMedicinalesComponent', () => {
  let component: ProprietesMedicinalesComponent;
  let fixture: ComponentFixture<ProprietesMedicinalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProprietesMedicinalesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProprietesMedicinalesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
