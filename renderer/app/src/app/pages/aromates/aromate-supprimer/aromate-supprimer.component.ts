import { Component, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Aromate } from '../../../types/electron';
import { AromateService } from '../../../services/aromate.service';

@Component({
  selector: 'app-aromate-supprimer',
  imports: [RouterLink],
  templateUrl: './aromate-supprimer.component.html',
  styleUrl: './aromate-supprimer.component.css',
})
export class AromateSupprimerComponent {
  private readonly aromateService = inject(AromateService);
  private readonly router = inject(Router);

  id = input<string>();

  aromate = signal<Aromate | null>(null);
  isLoading = signal(true);
  message = signal('');

  async ngOnInit(): Promise<void> {
    await this.chargerAromate();
  }

  async chargerAromate(): Promise<void> {
    const idAromate = Number(this.id());

    if (!idAromate) {
      this.message.set('Identifiant de l’aromate invalide.');
      this.isLoading.set(false);
      return;
    }

    try {
      const aromate = await this.aromateService.getAromateById(idAromate);

      if (!aromate) {
        this.message.set('Aromate introuvable.');
        return;
      }

      this.aromate.set(aromate);
      this.message.set('');
    }
    catch (error) {
      console.error('Erreur chargement aromate', { error, idAromate });
      this.message.set('Erreur pendant le chargement de l’aromate.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  async supprimerAromate(): Promise<void> {
    const aromate = this.aromate();

    if (!aromate) {
      return;
    }

    const confirmation = confirm('Voulez-vous vraiment supprimer cet aromate ?');

    if (!confirmation) {
      return;
    }

    try {
      await this.aromateService.deleteAromate(aromate.id_aromate);
      await this.router.navigate(['/aromates']);
    }
    catch (error) {
      console.error('Erreur suppression aromate', { error, aromate });
      this.message.set(this.aromateService.getMessageErreurSuppression());
    }
  }

  async annuler(): Promise<void> {
    await this.router.navigate(['/aromates', this.aromate()?.id_aromate]);
  }
}