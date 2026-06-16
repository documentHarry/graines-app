import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-utilisateur-filtres',
  imports: [],
  templateUrl: './utilisateur-filtres.component.html',
  styleUrl: './utilisateur-filtres.component.css',
})

export class UtilisateurFiltresComponent {
  nomRecherche = model<string>('');
  prenomRecherche = model<string>('');
  emailRecherche = model<string>('');
  statutRecherche = model<string>('');
  roleRecherche = model<string>('');
  adresseRecherche = model<string>('');

  roles = input<string[]>([]);

  resetFiltres(): void {
    this.nomRecherche.set('');
    this.prenomRecherche.set('');
    this.emailRecherche.set('');
    this.statutRecherche.set('');
    this.roleRecherche.set('');
    this.adresseRecherche.set('');
  }

  changerNomRecherche(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.nomRecherche.set(input.value);
  }

  changerPrenomRecherche(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.prenomRecherche.set(input.value);
  }

  changerEmailRecherche(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.emailRecherche.set(input.value);
  }

  changerStatutRecherche(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.statutRecherche.set(select.value);
  }

  changerRoleRecherche(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.roleRecherche.set(select.value);
  }

  changerAdresseRecherche(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.adresseRecherche.set(select.value);
  }
}