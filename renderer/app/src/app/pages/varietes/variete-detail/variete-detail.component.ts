import { Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Variete } from '../../../types/electron';
import { VarieteService } from '../../../services/variete.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-variete-detail',
  imports: [RouterLink],
  templateUrl: './variete-detail.component.html',
  styleUrl: './variete-detail.component.css',
})

export class VarieteDetailComponent {
  private readonly varieteService = inject(VarieteService);
  readonly authService = inject(AuthService);

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

  getLabelBio(): string {
    return this.varieteService.getLabelBio(this.variete());
  }

  getNombreProduits(): number {
    return this.varieteService.getNombreProduits(this.variete());
  }

  getConseilsPlantation(): string[] {
    return this.varieteService.getConseilsPlantation(this.variete());
  }
}