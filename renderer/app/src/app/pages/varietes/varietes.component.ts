import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Variete } from '../../types/electron';
import { VarieteService } from '../../services/variete.service';
import { VarieteFiltresComponent } from './variete-filtres/variete-filtres.component';

@Component({
  selector: 'app-varietes',
  imports: [RouterLink, VarieteFiltresComponent],
  templateUrl: './varietes.component.html',
  styleUrl: './varietes.component.css',
})

export class VarietesComponent {
  private readonly varieteService = inject(VarieteService);

  varietes = signal<Variete[]>([]);
  isLoading = signal(true);
  message = signal('');
  rechercheNom = signal('');
  bioRecherche = signal('');
  especeRecherche = signal('');
  ensoleillementRecherche = signal('');
  cycleVieRecherche = signal('');
  typeRecherche = signal('');

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

  varietesFiltrees = computed(() => {
    const rechercheNom = this.rechercheNom().toLowerCase().trim();
    const bioRecherche = this.bioRecherche();
    const typeRecherche = this.typeRecherche();
    const especeRecherche = this.especeRecherche();
    const ensoleillementRecherche = this.ensoleillementRecherche();
    const cycleVieRecherche = this.cycleVieRecherche();

    return this.varietes().filter(variete => {
      const correspondNom = rechercheNom === '' || variete.nom.toLowerCase().includes(rechercheNom);

      const correspondBio =
        bioRecherche === '' ||
        bioRecherche === 'bio' && variete.bio === 1 ||
        bioRecherche === 'non-bio' && variete.bio !== 1;

      const correspondType =
        typeRecherche === '' ||
        typeRecherche === 'aromate' && this.estAromate(variete) ||
        typeRecherche === 'legume' && !this.estAromate(variete);

      const correspondEspece = especeRecherche === '' || variete.espece.nom_commun === especeRecherche;

      const correspondEnsoleillement = ensoleillementRecherche === '' || variete.type_ensoleillement === ensoleillementRecherche;

      const correspondCycleVie = cycleVieRecherche === '' || variete.cycle_de_vie === cycleVieRecherche;

      return correspondNom
        && correspondBio
        && correspondType
        && correspondEspece
        && correspondEnsoleillement
        && correspondCycleVie;
    });
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
    return variete._count?.produit ?? 0;
  }

  getLabelBio(variete: Variete): string {
    if (variete.bio === 1) {
      return 'Bio';
    }

    return 'Non bio';
  }

  estAromate(variete: Variete): boolean {
    return (variete.aromate?.length ?? 0) > 0;
  }

}