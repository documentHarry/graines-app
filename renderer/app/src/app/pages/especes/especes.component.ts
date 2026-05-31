import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Espece } from '../../types/electron';
import { EspeceService } from '../../services/espece.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-especes',
  imports: [RouterLink],
  templateUrl: './especes.component.html',
  styleUrl: './especes.component.css',
})
export class EspecesComponent {
  private readonly especeService = inject(EspeceService);
  readonly authService = inject(AuthService);

  especes = signal<Espece[]>([]);
  isLoading = signal(true);
  message = signal('');
  rechercheNomScientifique = signal('');
  rechercheNomCommun = signal('');

  constructor() {
    this.chargerEspeces();
  }

  async chargerEspeces(): Promise<void> {
    try {
      const result = await this.especeService.getEspeces();

      this.especes.set(result);
      this.message.set('');
    }
    catch {
      this.message.set('Erreur pendant le chargement des espèces.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  especesFiltrees = computed(() => {
    const rechercheNomScientifique = this.rechercheNomScientifique().toLowerCase().trim();
    const rechercheNomCommun = this.rechercheNomCommun().toLowerCase().trim();

    return this.especes().filter(espece => {
      const correspondNomScientifique =
        rechercheNomScientifique === '' ||
        espece.nom_scientifique.toLowerCase().includes(rechercheNomScientifique);

      const correspondNomCommun =
        rechercheNomCommun === '' ||
        espece.nom_commun.toLowerCase().includes(rechercheNomCommun);

      return correspondNomScientifique && correspondNomCommun;
    });
  });

  changerRechercheNomCommun(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.rechercheNomCommun.set(input.value);
  }

  changerRechercheNomScientifique(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.rechercheNomScientifique.set(input.value);
  }

  getNombreVarietes(espece: Espece): number {
    return espece._count?.variete ?? 0;
  }
}