import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AromatesComponent } from './aromates.component';

describe('AromatesComponent', () => {
  let component: AromatesComponent;
  let fixture: ComponentFixture<AromatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AromatesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AromatesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
