import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Espece } from '../../types/electron';
import { EspeceService } from '../../services/espece.service';

@Component({
  selector: 'app-especes',
  imports: [RouterLink],
  templateUrl: './especes.component.html',
  styleUrl: './especes.component.css',
})
export class EspecesComponent {
  private readonly especeService = inject(EspeceService);

  especes = signal<Espece[]>([]);
  isLoading = signal(true);
  message = signal('');

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

  getNombreVarietes(espece: Espece): number {
    return espece._count?.variete ?? 0;
  }
}