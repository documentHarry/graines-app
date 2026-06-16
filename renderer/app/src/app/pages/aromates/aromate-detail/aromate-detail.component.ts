import { Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Aromate } from '../../../types/electron';
import { AromateService } from '../../../services/aromate.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-aromate-detail',
  imports: [RouterLink],
  templateUrl: './aromate-detail.component.html',
  styleUrl: './aromate-detail.component.css',
})

export class AromateDetailComponent {
  private readonly aromateService = inject(AromateService);
  protected readonly authService = inject(AuthService);

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

  getProprietesMedicinales(): string[] {
    const aromate = this.aromate();

    if (!aromate) {
      return [];
    }

    return this.aromateService.getProprietesMedicinales(aromate);
  }
}