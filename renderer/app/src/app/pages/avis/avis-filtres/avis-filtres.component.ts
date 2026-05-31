import { Component, model } from '@angular/core';

@Component({
  selector: 'app-avis-filtres',
  imports: [],
  templateUrl: './avis-filtres.component.html',
  styleUrl: './avis-filtres.component.css',
})
export class AvisFiltresComponent {
  titreRecherche = model<string>('');
  commentaireRecherche = model<string>('');
  produitRecherche = model<string>('');
  auteurRecherche = model<string>('');
  noteRecherche = model<string>('');
  statutRecherche = model<string>('');
  jaimeMinRecherche = model<string>('');

  resetFiltres(): void {
    this.titreRecherche.set('');
    this.commentaireRecherche.set('');
    this.produitRecherche.set('');
    this.auteurRecherche.set('');
    this.noteRecherche.set('');
    this.statutRecherche.set('');
    this.jaimeMinRecherche.set('');
  }

  changerTitreRecherche(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.titreRecherche.set(input.value);
  }

  changerCommentaireRecherche(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.commentaireRecherche.set(input.value);
  }

  changerProduitRecherche(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.produitRecherche.set(input.value);
  }

  changerAuteurRecherche(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.auteurRecherche.set(input.value);
  }

  changerNoteRecherche(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.noteRecherche.set(select.value);
  }

  changerStatutRecherche(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.statutRecherche.set(select.value);
  }

  changerJaimeMinRecherche(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.jaimeMinRecherche.set(input.value);
  }

}