import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateurFiltresComponent } from './utilisateur-filtres.component';

describe('UtilisateurFiltresComponent', () => {
  let component: UtilisateurFiltresComponent;
  let fixture: ComponentFixture<UtilisateurFiltresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateurFiltresComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UtilisateurFiltresComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
