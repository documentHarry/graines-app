import { Component, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Variete } from '../../../types/electron';
import { VarieteService } from '../../../services/variete.service';

@Component({
  selector: 'app-variete-supprimer',
  imports: [RouterLink],
  templateUrl: './variete-supprimer.component.html',
  styleUrl: './variete-supprimer.component.css',
})

export class VarieteSupprimerComponent {
  private readonly varieteService = inject(VarieteService);
  private readonly router = inject(Router);

  id = input<string>();

  variete = signal<Variete | null>(null);
  isLoading = signal(true);
  message = signal('');

  async ngOnInit(): Promise<void> {
    await this.chargerVariete();
  }

  async chargerVariete(): Promise<void> {
    const idVariete = Number(this.id());

    if (!idVariete) {
      this.message.set('Identifiant de la variété invalide.');
      this.isLoading.set(false);
      return;
    }

    try {
      const variete = await this.varieteService.getVarieteById(idVariete);

      if (!variete) {
        this.message.set('Variété introuvable.');
        return;
      }

      this.variete.set(variete);
      this.message.set('');
    }
    catch (error) {
      console.error('Erreur chargement variété', { error, idVariete });
      this.message.set('Erreur pendant le chargement de la variété.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  getNombreProduits(): number {
    return this.varieteService.getNombreProduits(this.variete());
  }

  async supprimerVariete(): Promise<void> {
    const variete = this.variete();

    if (!variete) {
      return;
    }

    const confirmation = confirm('Voulez-vous vraiment supprimer cette variété ?');

    if (!confirmation) {
      return;
    }

    try {
      await this.varieteService.deleteVariete(variete.id_variete);
      await this.router.navigate(['/varietes']);
    }
    catch (error) {
      console.error('Erreur suppression variété', { error, variete });
      this.message.set(this.varieteService.getMessageErreurSuppression(error));
    }
  }

  async annuler(): Promise<void> {
    await this.router.navigate(['/varietes', this.variete()?.id_variete]);
  }
}