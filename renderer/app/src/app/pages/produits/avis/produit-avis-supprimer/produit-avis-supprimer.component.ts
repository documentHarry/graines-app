import { Component, input } from '@angular/core';
import { Avis } from '../../../../types/electron';

@Component({
  selector: 'app-produit-avis-supprimer',
  imports: [],
  templateUrl: './produit-avis-supprimer.component.html',
  styleUrl: './produit-avis-supprimer.component.css',
})
export class ProduitAvisSupprimerComponent {
  avis = input.required<Avis>();

  onConfirmer = input.required<(avis: Avis) => void | Promise<void>>();
  onAnnuler = input.required<() => void>();

  confirmerSuppression(): void {
    this.onConfirmer()(this.avis());
  }

  annulerSuppression(): void {
    this.onAnnuler()();
  }
}