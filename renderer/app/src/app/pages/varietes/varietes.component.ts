import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Variete } from '../../types/electron';
import { VarieteService } from '../../services/variete.service';
import { VarieteFiltresComponent } from './variete-filtres/variete-filtres.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-varietes',
  imports: [RouterLink, VarieteFiltresComponent],
  templateUrl: './varietes.component.html',
  styleUrl: './varietes.component.css',
})

export class VarietesComponent {
  private readonly varieteService = inject(VarieteService);
  readonly authService = inject(AuthService);

  varietes = signal<Variete[]>([]);
  isLoading = signal(true);
  message = signal('');
  rechercheNom = signal('');
  bioRecherche = signal('');
  especeRecherche = signal('');
  ensoleillementRecherche = signal('');
  cycleVieRecherche = signal('');

  async ngOnInit(): Promise<void> {
    await this.chargerVarietes();
  }

  async chargerVarietes(): Promise<void> {
    try {
      const result = await this.varieteService.getVarietes();

      this.varietes.set(result);
      this.message.set('');
    }
    catch (error) {
      console.error('Erreur chargement variétés', { error });
      this.message.set('Erreur pendant le chargement des variétés.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  varietesFiltrees = computed(() => {
    return this.varieteService.filtrerVarietes(
      this.varietes(),
      this.rechercheNom(),
      this.bioRecherche(),
      this.especeRecherche(),
      this.ensoleillementRecherche(),
      this.cycleVieRecherche()
    );
  });

  especesDisponibles = computed(() => {
    const especes = this.varietes().map(variete => variete.espece.nom_commun);

    return [...new Set(especes)].sort();
  });

  ensoleillementsDisponibles = computed(() => {
    const ensoleillements = this.varietes()
      .map(variete => variete.type_ensoleillement)
      .filter(ensoleillement => ensoleillement !== null);

    return [...new Set(ensoleillements)].sort();
  });

  cyclesVieDisponibles = computed(() => {
    const cycles = this.varietes()
      .map(variete => variete.cycle_de_vie)
      .filter(cycle => cycle !== null);

    return [...new Set(cycles)].sort();
  });

  getNombreProduits(variete: Variete): number {
    return this.varieteService.getNombreProduits(variete);
  }

  getLabelBio(variete: Variete): string {
    return this.varieteService.getLabelBio(variete);
  }
}