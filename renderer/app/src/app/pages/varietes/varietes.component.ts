import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Variete } from '../../types/electron';
import { VarieteService } from '../../services/variete.service';

@Component({
  selector: 'app-varietes',
  imports: [RouterLink],
  templateUrl: './varietes.component.html',
  styleUrl: './varietes.component.css',
})

export class VarietesComponent {
  private readonly varieteService = inject(VarieteService);

  varietes = signal<Variete[]>([]);
  isLoading = signal(true);
  message = signal('');

  async ngOnInit(): Promise<void> {
    await this.chargerVarietes();
  }

  async chargerVarietes(): Promise<void> {
    try {
      const result = await this.varieteService.getVarietes();

      this.varietes.set(result);
      this.message.set('');
    }
    catch {
      this.message.set('Erreur pendant le chargement des variétés.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  getNombreProduits(variete: Variete): number {
    return variete._count?.produit ?? 0;
  }

  getLabelBio(variete: Variete): string {
    if (variete.bio === 1) {
      return 'Bio';
    }

    return 'Non bio';
  }
}