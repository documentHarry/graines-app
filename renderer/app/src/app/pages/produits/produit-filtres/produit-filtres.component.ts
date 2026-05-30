import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-produit-filtres',
  imports: [],
  templateUrl: './produit-filtres.component.html',
  styleUrl: './produit-filtres.component.css'
})
export class ProduitFiltresComponent {
  recherche = model<string>('');
  stockRecherche = model<string>('');
  aromateRecherche = model<string>('');
  prixMinRecherche = model<string>('');
  prixMaxRecherche = model<string>('');
  categorieRecherche = model<string>('');
  varieteRecherche = model<string>('');
  especeRecherche = model<string>('');

  categories = input<string[]>([]);
  varietes = input<string[]>([]);
  especes = input<string[]>([]);
  prixMinimumDisponible = input<number>(0);
  prixMaximumDisponible = input<number>(0);

  resetFiltres(): void {
    this.recherche.set('');
    this.stockRecherche.set('');
    this.aromateRecherche.set('');
    this.prixMinRecherche.set('');
    this.prixMaxRecherche.set('');
    this.categorieRecherche.set('');
    this.varieteRecherche.set('');
    this.especeRecherche.set('');
  }

  changerRecherche(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.recherche.set(input.value);
  }

  changerStockRecherche(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.stockRecherche.set(select.value);
  }

  changerCategorieRecherche(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.categorieRecherche.set(select.value);
  }

  changerAromateRecherche(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.aromateRecherche.set(select.value);
  }

  changerPrixMinRecherche(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valeur = Number(input.value);

    if (input.value === '') {
      this.prixMinRecherche.set('');
      return;
    }

    if (valeur < this.prixMinimumDisponible()) {
      this.prixMinRecherche.set(String(this.prixMinimumDisponible()));
      return;
    }

    if (valeur > this.prixMaximumDisponible()) {
      this.prixMinRecherche.set(String(this.prixMaximumDisponible()));
      return;
    }

    this.prixMinRecherche.set(input.value);
  }

  changerPrixMaxRecherche(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valeur = Number(input.value);

    if (input.value === '') {
      this.prixMaxRecherche.set('');
      return;
    }

    if (valeur > this.prixMaximumDisponible()) {
      this.prixMaxRecherche.set(String(this.prixMaximumDisponible()));
      return;
    }

    if (valeur < this.prixMinimumDisponible()) {
      this.prixMaxRecherche.set(String(this.prixMinimumDisponible()));
      return;
    }

    this.prixMaxRecherche.set(input.value);
  }

  changerVarieteRecherche(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.varieteRecherche.set(select.value);
  }

  changerEspeceRecherche(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.especeRecherche.set(select.value);
  }

}