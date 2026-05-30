import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarieteFiltresComponent } from './variete-filtres.component';

describe('VarieteFiltresComponent', () => {
  let component: VarieteFiltresComponent;
  let fixture: ComponentFixture<VarieteFiltresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VarieteFiltresComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VarieteFiltresComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
