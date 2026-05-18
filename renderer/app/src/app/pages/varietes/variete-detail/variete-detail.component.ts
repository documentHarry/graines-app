import { Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Variete } from '../../../types/electron';
import { VarieteService } from '../../../services/variete.service';

@Component({
  selector: 'app-variete-detail',
  imports: [RouterLink],
  templateUrl: './variete-detail.component.html',
  styleUrl: './variete-detail.component.css',
})
export class VarieteDetailComponent {
  private readonly varieteService = inject(VarieteService);

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
    catch {
      this.message.set('Erreur pendant le chargement de la variété.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  getLabelBio(): string {
    if (this.variete()?.bio === 1) {
      return 'Bio';
    }

    return 'Non bio';
  }

  getNombreProduits(): number {
    return this.variete()?._count?.produit ?? 0;
  }

  getConseilsPlantation(): string[] {
    const conseil = this.variete()?.conseil_plantation;

    if (!conseil) {
      return [];
    }

    return conseil.split('.').map(phrase => phrase.trim())
      .filter(phrase => phrase.length > 0)
      .map(phrase => phrase + '.');
  }
}