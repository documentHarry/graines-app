import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-variete-filtres',
  imports: [],
  templateUrl: './variete-filtres.component.html',
  styleUrl: './variete-filtres.component.css',
})
export class VarieteFiltresComponent {
  rechercheNom = model<string>('');
  bioRecherche = model<string>('');
  typeRecherche = model<string>('');
  especeRecherche = model<string>('');
  ensoleillementRecherche = model<string>('');
  cycleVieRecherche = model<string>('');

  especes = input<string[]>([]);
  ensoleillements = input<string[]>([]);
  cyclesVie = input<string[]>([]);

  resetFiltres(): void {
    this.rechercheNom.set('');
    this.bioRecherche.set('');
    this.typeRecherche.set('');
    this.especeRecherche.set('');
    this.ensoleillementRecherche.set('');
    this.cycleVieRecherche.set('');
  }

  changerRechercheNom(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.rechercheNom.set(input.value);
  }

  changerBioRecherche(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.bioRecherche.set(select.value);
  }

  changerTypeRecherche(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.typeRecherche.set(select.value);
  }

  changerEspeceRecherche(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.especeRecherche.set(select.value);
  }

  changerEnsoleillementRecherche(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.ensoleillementRecherche.set(select.value);
  }

  changerCycleVieRecherche(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.cycleVieRecherche.set(select.value);
  }
}