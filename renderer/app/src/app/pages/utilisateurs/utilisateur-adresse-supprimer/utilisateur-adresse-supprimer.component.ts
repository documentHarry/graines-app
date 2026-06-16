import { Component, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AdresseLivraison, Utilisateur } from '../../../types/electron';
import { AdresseLivraisonService } from '../../../services/adresse-livraison.service';
import { UtilisateurService } from '../../../services/utilisateur.service';

@Component({
  selector: 'app-utilisateur-adresse-supprimer',
  imports: [RouterLink],
  templateUrl: './utilisateur-adresse-supprimer.component.html',
  styleUrl: './utilisateur-adresse-supprimer.component.css',
})

export class UtilisateurAdresseSupprimerComponent {
  private readonly adresseLivraisonService = inject(AdresseLivraisonService);
  private readonly utilisateurService = inject(UtilisateurService);
  private readonly router = inject(Router);

  id = input<string>();
  adresseId = input<string>();

  utilisateur = signal<Utilisateur | null>(null);
  adresse = signal<AdresseLivraison | null>(null);
  isLoading = signal(true);
  message = signal('');

  async ngOnInit(): Promise<void> {
    await this.chargerDonnees();
  }

  async chargerDonnees(): Promise<void> {
    const idUtilisateur = Number(this.id());
    const idAdresse = Number(this.adresseId());

    if (!idUtilisateur || !idAdresse) {
      this.message.set('Identifiant de l’utilisateur ou de l’adresse invalide.');
      this.isLoading.set(false);
      return;
    }

    try {
      const utilisateur = await this.utilisateurService.getUtilisateurById(idUtilisateur);

      if (!utilisateur) {
        this.message.set('Utilisateur introuvable.');
        return;
      }

      const adresse = utilisateur.adresse_livraison
        .find(adresse => adresse.id_adresse === idAdresse) ?? null;

      if (!adresse) {
        this.message.set('Adresse introuvable.');
        return;
      }

      this.utilisateur.set(utilisateur);
      this.adresse.set(adresse);
      this.message.set('');
    }
    catch (error) {
      console.error('Erreur chargement adresse livraison', { error, idUtilisateur, idAdresse });
      this.message.set('Erreur pendant le chargement de l’adresse.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  getAdresseComplete(): string {
    const adresse = this.adresse();

    if (!adresse) {
      return '';
    }

    return this.adresseLivraisonService.getAdresseComplete(adresse);
  }

  getLabelAdresseParDefaut(): string {
    const adresse = this.adresse();

    if (!adresse) {
      return '';
    }

    return this.adresseLivraisonService.getLabelAdresseParDefaut(adresse);
  }

  async supprimerAdresse(): Promise<void> {
    const utilisateur = this.utilisateur();
    const adresse = this.adresse();

    if (!utilisateur || !adresse) {
      return;
    }

    const confirmation = confirm('Voulez-vous vraiment supprimer cette adresse ?');

    if (!confirmation) {
      return;
    }

    try {
      await this.adresseLivraisonService.deleteAdresseLivraison(adresse.id_adresse);
      await this.router.navigate(['/utilisateurs', utilisateur.id_utilisateur]);
    }
    catch (error) {
      console.error('Erreur suppression adresse livraison', { error, utilisateur, adresse });
      this.message.set(this.adresseLivraisonService.getMessageErreurSuppression());
    }
  }

  async annuler(): Promise<void> {
    const utilisateur = this.utilisateur();

    if (!utilisateur) {
      await this.router.navigate(['/utilisateurs']);
      return;
    }

    await this.router.navigate(['/utilisateurs', utilisateur.id_utilisateur]);
  }
}