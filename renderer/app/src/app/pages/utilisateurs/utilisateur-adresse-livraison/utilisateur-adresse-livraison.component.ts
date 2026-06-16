import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdresseLivraison } from '../../../types/electron';
import { AdresseLivraisonService } from '../../../services/adresse-livraison.service';

@Component({
  selector: 'app-utilisateur-adresses',
  imports: [RouterLink],
  templateUrl: './utilisateur-adresse-livraison.component.html',
  styleUrl: './utilisateur-adresse-livraison.component.css',
})

export class UtilisateurAdresseLivraisonComponent {
  private readonly adresseLivraisonService = inject(AdresseLivraisonService);

  utilisateurId = input.required<number>();
  adresses = input<AdresseLivraison[]>([]);

  getAdresseComplete(adresse: AdresseLivraison): string {
    return this.adresseLivraisonService.getAdresseComplete(adresse);
  }

  getLabelAdresseParDefaut(adresse: AdresseLivraison): string {
    return this.adresseLivraisonService.getLabelAdresseParDefaut(adresse);
  }
}