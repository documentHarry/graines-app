import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-aromate-filtres',
  imports: [],
  templateUrl: './aromate-filtres.component.html',
  styleUrl: './aromate-filtres.component.css',
})

export class AromateFiltresComponent {

  rechercheNom = model<string>('');
  especeRecherche = model<string>('');
  partieUtiliseeRecherche = model<string>('');
  usageCulinaireRecherche = model<string>('');

  especes = input<string[]>([]);
  partiesUtilisees = input<string[]>([]);
  usagesCulinaires = input<string[]>([]);

  resetFiltres(): void {
    this.rechercheNom.set('');
    this.especeRecherche.set('');
    this.partieUtiliseeRecherche.set('');
    this.usageCulinaireRecherche.set('');
  }

  changerRechercheNom(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.rechercheNom.set(input.value);
  }

  changerEspeceRecherche(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.especeRecherche.set(select.value);
  }

  changerPartieUtiliseeRecherche(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.partieUtiliseeRecherche.set(select.value);
  }

  changerUsageCulinaireRecherche(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.usageCulinaireRecherche.set(select.value);
  }

}