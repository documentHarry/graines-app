import { Component, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Avis } from '../../../types/electron';
import { AvisService } from '../../../services/avis.service';

@Component({
  selector: 'app-avis-supprimer',
  imports: [RouterLink],
  templateUrl: './avis-supprimer.component.html',
  styleUrl: './avis-supprimer.component.css',
})

export class AvisSupprimerComponent {
  private readonly avisService = inject(AvisService);
  private readonly router = inject(Router);

  id = input<string>();

  avis = signal<Avis | null>(null);
  isLoading = signal(true);
  message = signal('');

  async ngOnInit(): Promise<void> {
    await this.chargerAvis();
  }

  async chargerAvis(): Promise<void> {
    const idAvis = Number(this.id());

    if (!idAvis) {
      this.message.set('Identifiant de l’avis invalide.');
      this.isLoading.set(false);
      return;
    }

    try {
      const avis = await this.avisService.getAvisById(idAvis);

      if (!avis) {
        this.message.set('Avis introuvable.');
        return;
      }

      this.avis.set(avis);
      this.message.set('');
    }
    catch {
      this.message.set('Erreur pendant le chargement de l’avis.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  async supprimer(): Promise<void> {
    if (!this.avis()) {
      return;
    }

    try {
      await this.avisService.deleteAvis(this.avis()!.id_avis);
      await this.router.navigate(['/avis']);
    }
    catch {
      this.message.set('Une erreur technique est survenue pendant la suppression de l’avis.');
    }
  }
}