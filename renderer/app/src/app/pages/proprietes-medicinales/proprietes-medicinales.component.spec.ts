import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProprietesMedicinalesComponent } from './proprietes-medicinales.component';
import { ProprieteMedicinaleService } from '../../services/propriete-medicinale.service';
import { ProprieteMedicinale } from '../../types/electron';

describe('ProprietesMedicinalesComponent', () => {
  let component: ProprietesMedicinalesComponent;
  let fixture: ComponentFixture<ProprietesMedicinalesComponent>;

  const proprietesMock: ProprieteMedicinale[] = [
    { id_propriete: 1, nom_propriete: 'Digestive' },
    { id_propriete: 2, nom_propriete: 'Antiseptique' },
  ];

  const proprieteMedicinaleServiceMock = {
    getProprietesMedicinales: vi.fn(),
    filtrerProprietesMedicinales: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ProprietesMedicinalesComponent],
      providers: [
        {
          provide: ProprieteMedicinaleService,
          useValue: proprieteMedicinaleServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProprietesMedicinalesComponent);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger les propriétés médicinales au ngOnInit', async () => {
    proprieteMedicinaleServiceMock.getProprietesMedicinales.mockResolvedValue(proprietesMock);

    await component.ngOnInit();

    expect(proprieteMedicinaleServiceMock.getProprietesMedicinales).toHaveBeenCalledOnce();
    expect(component.proprietes()).toEqual(proprietesMock);
    expect(component.message()).toBe('');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait charger les propriétés médicinales', async () => {
    proprieteMedicinaleServiceMock.getProprietesMedicinales.mockResolvedValue(proprietesMock);

    await component.chargerProprietes();

    expect(component.proprietes()).toEqual(proprietesMock);
    expect(component.message()).toBe('');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message en cas d’erreur pendant le chargement', async () => {
    proprieteMedicinaleServiceMock.getProprietesMedicinales.mockRejectedValue(new Error('Erreur'));

    await component.chargerProprietes();

    expect(component.message()).toBe('Erreur pendant le chargement des propriétés médicinales.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait retourner les propriétés filtrées depuis le service', () => {
    const proprietesFiltrees: ProprieteMedicinale[] = [
      { id_propriete: 2, nom_propriete: 'Antiseptique' },
    ];

    component.proprietes.set(proprietesMock);
    component.recherche.set('anti');
    proprieteMedicinaleServiceMock.filtrerProprietesMedicinales.mockReturnValue(proprietesFiltrees);

    expect(component.proprietesFiltrees()).toEqual(proprietesFiltrees);
    expect(proprieteMedicinaleServiceMock.filtrerProprietesMedicinales).toHaveBeenCalledWith(
      proprietesMock,
      'anti',
    );
  });

  it('devrait changer la recherche depuis un événement input', () => {
    const event = {
      target: {
        value: 'digestive',
      },
    } as unknown as Event;

    component.changerRecherche(event);

    expect(component.recherche()).toBe('digestive');
  });
});