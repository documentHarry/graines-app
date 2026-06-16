import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AromateFiltresComponent } from './aromate-filtres.component';

describe('AromateFiltresComponent', () => {
  let component: AromateFiltresComponent;
  let fixture: ComponentFixture<AromateFiltresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AromateFiltresComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AromateFiltresComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
