import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Avis } from '../../types/electron';
import { AvisService } from '../../services/avis.service';

@Component({
  selector: 'app-avis',
  imports: [RouterLink],
  templateUrl: './avis.component.html',
  styleUrl: './avis.component.css',
})

export class AvisComponent {
  private readonly avisService = inject(AvisService);

  avis = signal<Avis[]>([]);
  isLoading = signal(true);
  message = signal('');

  async ngOnInit(): Promise<void> {
    await this.chargerAvis();
  }

  async chargerAvis(): Promise<void> {
    try {
      const avis = await this.avisService.getAvis();

      this.avis.set(avis);
      this.message.set('');
    }
    catch {
      this.message.set('Erreur pendant le chargement des avis.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  getAuteur(avis: Avis): string {
    return `${avis.utilisateur.prenom} ${avis.utilisateur.nom}`;
  }

  async aimerAvis(idAvis: number): Promise<void> {
    try {
      await this.avisService.likeAvis(idAvis);
      await this.chargerAvis();
    }
    catch {
      this.message.set('Erreur pendant l’ajout du j’aime.');
    }
  }
}