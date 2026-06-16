import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProprieteMedicinale } from '../../types/electron';
import { ProprieteMedicinaleService } from '../../services/propriete-medicinale.service';

@Component({
  selector: 'app-proprietes-medicinales',
  imports: [RouterLink],
  templateUrl: './proprietes-medicinales.component.html',
  styleUrl: './proprietes-medicinales.component.css',
})

export class ProprietesMedicinalesComponent {
  private readonly proprieteMedicinaleService = inject(ProprieteMedicinaleService);
  protected readonly authService = inject(AuthService);

  proprietes = signal<ProprieteMedicinale[]>([]);
  recherche = signal('');
  isLoading = signal(true);
  message = signal('');

  async ngOnInit(): Promise<void> {
    await this.chargerProprietes();
  }

  async chargerProprietes(): Promise<void> {
    this.isLoading.set(true);

    try {
      const proprietes = await this.proprieteMedicinaleService.getProprietesMedicinales();

      this.proprietes.set(proprietes);
      this.message.set('');
    }
    catch (error) {
      console.error('Erreur chargement propriétés médicinales', { error });
      this.message.set('Erreur pendant le chargement des propriétés médicinales.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  proprietesFiltrees = computed(() => {
    return this.proprieteMedicinaleService.filtrerProprietesMedicinales(
      this.proprietes(),
      this.recherche()
    );
  });

  changerRecherche(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.recherche.set(input.value);
  }
}