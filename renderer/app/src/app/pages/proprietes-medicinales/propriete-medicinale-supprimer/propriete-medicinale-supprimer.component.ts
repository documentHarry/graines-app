import { Component, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProprieteMedicinale } from '../../../types/electron';
import { ProprieteMedicinaleService } from '../../../services/propriete-medicinale.service';

@Component({
  selector: 'app-propriete-medicinale-supprimer',
  imports: [RouterLink],
  templateUrl: './propriete-medicinale-supprimer.component.html',
  styleUrl: './propriete-medicinale-supprimer.component.css',
})

export class ProprieteMedicinaleSupprimerComponent {
  private readonly proprieteMedicinaleService = inject(ProprieteMedicinaleService);
  private readonly router = inject(Router);

  id = input<string>();

  propriete = signal<ProprieteMedicinale | null>(null);
  isLoading = signal(true);
  message = signal('');

  async ngOnInit(): Promise<void> {
    await this.chargerPropriete();
  }

  async chargerPropriete(): Promise<void> {
    const idPropriete = Number(this.id());

    if (!idPropriete) {
      this.message.set('Identifiant de la propriété médicinale invalide.');
      this.isLoading.set(false);
      return;
    }

    try {
      const proprietes = await this.proprieteMedicinaleService.getProprietesMedicinales();
      const propriete = proprietes.find(item => item.id_propriete === idPropriete) ?? null;

      if (!propriete) {
        this.message.set('Propriété médicinale introuvable.');
        return;
      }

      this.propriete.set(propriete);
      this.message.set('');
    }
    catch (error) {
      console.error('Erreur chargement propriété médicinale', { error, idPropriete });
      this.message.set('Erreur pendant le chargement de la propriété médicinale.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  async supprimerPropriete(): Promise<void> {
    const propriete = this.propriete();

    if (!propriete) {
      return;
    }

    const confirmation = confirm('Voulez-vous vraiment supprimer cette propriété médicinale ? Elle sera aussi retirée des aromates associés.');

    if (!confirmation) {
      return;
    }

    try {
      await this.proprieteMedicinaleService.deleteProprieteMedicinale(propriete.id_propriete);
      await this.router.navigate(['/proprietes-medicinales']);
    }
    catch (error) {
      console.error('Erreur suppression propriété médicinale', { error, propriete });
      this.message.set(this.proprieteMedicinaleService.getMessageErreurSuppression());
    }
  }

  async annuler(): Promise<void> {
    await this.router.navigate(['/proprietes-medicinales']);
  }
}