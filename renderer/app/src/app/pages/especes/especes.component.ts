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
    catch (error) {
      console.error('Erreur chargement espèces', { error });
      this.message.set('Erreur pendant le chargement des espèces.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  especesFiltrees = computed(() => {
    return this.especeService.filtrerEspeces(
      this.especes(),
      this.rechercheNomCommun(),
      this.rechercheNomScientifique()
    );
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
    return this.especeService.getNombreVarietes(espece);
  }
}