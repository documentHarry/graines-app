import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Aromate } from '../../types/electron';
import { AromateService } from '../../services/aromate.service';
import { AromateFiltresComponent } from './aromate-filtres/aromate-filtres.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-aromates',
  imports: [RouterLink, AromateFiltresComponent],
  templateUrl: './aromates.component.html',
  styleUrl: './aromates.component.css',
})

export class AromatesComponent {
  private readonly aromateService = inject(AromateService);
  protected readonly authService = inject(AuthService);

  aromates = signal<Aromate[]>([]);
  isLoading = signal(true);
  message = signal('');

  rechercheNom = signal('');
  especeRecherche = signal('');
  partieUtiliseeRecherche = signal('');
  usageCulinaireRecherche = signal('');

  async ngOnInit(): Promise<void> {
    await this.chargerAromates();
  }

  async chargerAromates(): Promise<void> {
    try {
      const aromates = await this.aromateService.getAromates();

      this.aromates.set(aromates);
      this.message.set('');
    }
    catch (error) {
      console.error('Erreur chargement aromates', { error });
      this.message.set('Erreur pendant le chargement des aromates.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  aromatesFiltres = computed(() => {
    return this.aromateService.filtrerAromates(
      this.aromates(),
      this.rechercheNom(),
      this.especeRecherche(),
      this.partieUtiliseeRecherche(),
      this.usageCulinaireRecherche()
    );
  });

  especesDisponibles = computed(() => {
    const especes = this.aromates()
      .map(aromate => aromate.variete?.espece?.nom_commun)
      .filter(espece => espece !== undefined);

    return [...new Set(especes)].sort();
  });

  partiesUtiliseesDisponibles = computed(() => {
    const parties = this.aromates()
      .map(aromate => aromate.partie_utilisee)
      .filter(partie => partie !== null);

    return [...new Set(parties)].sort();
  });

  usagesCulinairesDisponibles = computed(() => {
    const usages = this.aromates()
      .map(aromate => aromate.usage_culinaire)
      .filter(usage => usage !== null);

    return [...new Set(usages)].sort();
  });

  getProprietesMedicinales(aromate: Aromate): string[] {
    return this.aromateService.getProprietesMedicinales(aromate);
  }
}