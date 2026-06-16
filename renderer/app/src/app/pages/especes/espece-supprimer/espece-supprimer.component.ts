import { Component, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Espece } from '../../../types/electron';
import { EspeceService } from '../../../services/espece.service';

@Component({
  selector: 'app-espece-supprimer',
  imports: [RouterLink],
  templateUrl: './espece-supprimer.component.html',
  styleUrl: './espece-supprimer.component.css',
})

export class EspeceSupprimerComponent {
  private readonly especeService = inject(EspeceService);
  private readonly router = inject(Router);

  id = input<string>();

  espece = signal<Espece | null>(null);
  isLoading = signal(true);
  message = signal('');

  async ngOnInit(): Promise<void> {
    await this.chargerEspece();
  }

  async chargerEspece(): Promise<void> {
    const idEspece = Number(this.id());

    if (!idEspece) {
      this.message.set('Identifiant de l’espèce invalide.');
      this.isLoading.set(false);
      return;
    }

    try {
      const espece = await this.especeService.getEspeceById(idEspece);

      if (!espece) {
        this.message.set('Espèce introuvable.');
        return;
      }

      this.espece.set(espece);
      this.message.set('');
    }
    catch (error) {
      console.error('Erreur chargement espèce', { error, idEspece });
      this.message.set('Erreur pendant le chargement de l’espèce.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  getNombreVarietes(): number {
    return this.especeService.getNombreVarietes(this.espece());
  }

  async supprimerEspece(): Promise<void> {
    const espece = this.espece();

    if (!espece) {
      return;
    }

    const confirmation = confirm('Voulez-vous vraiment supprimer cette espèce ?' );

    if (!confirmation) {
      return;
    }

    try {
      await this.especeService.deleteEspece(espece.id_espece);
      await this.router.navigate(['/especes']);
    }
    catch (error) {
      console.error('Erreur suppression espèce', { error, espece });
      this.message.set(this.especeService.getMessageErreurSuppression(error));
    }
  }

  async annuler(): Promise<void> {
    await this.router.navigate(['/especes']);
  }
}