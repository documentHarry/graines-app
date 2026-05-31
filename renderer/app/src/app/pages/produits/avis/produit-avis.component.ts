import { Component, effect, inject, input, signal } from '@angular/core';
import { Avis } from '../../../types/electron';
import { AvisService } from '../../../services/avis.service';
import { AuthService } from '../../../services/auth.service';
import { ProduitAvisFormComponent } from './produit-avis-form/produit-avis-form.component';
import { ProduitAvisSupprimerComponent } from './produit-avis-supprimer/produit-avis-supprimer.component';

type AvisFormValue = {
  note: number;
  titre: string | null;
  commentaire: string | null;
};

@Component({
  selector: 'app-produit-avis',
  imports: [ProduitAvisFormComponent, ProduitAvisSupprimerComponent],
  templateUrl: './produit-avis.component.html',
  styleUrl: './produit-avis.component.css',
})

export class ProduitAvisComponent {
  private readonly avisService = inject(AvisService);
  readonly authService = inject(AuthService);

  produitId = input.required<number>();

  avis = signal<Avis[]>([]);
  modeAvis = signal<'aucun' | 'ajout' | 'modification'>('aucun');
  avisSelectionne = signal<Avis | null>(null);
  avisASupprimer = signal<Avis | null>(null);
  message = signal('');

  constructor() {
    effect(() => {
      const idProduit = this.produitId();

      if (idProduit) {
        void this.chargerAvis();
      }
    });
  }

  async chargerAvis(): Promise<void> {
    try {
      const avis = await this.avisService.getAvisByProduit(this.produitId());
      this.avis.set(avis);
      this.message.set('');
    }
    catch (error) {
      console.error(error);
      this.message.set('Erreur pendant le chargement des avis.');
    }
  }

  peutAjouterAvis(): boolean {
    return this.authService.hasAnyRole(['CLIENT', 'ADMIN']);
  }

  peutModifierAvis(avis: Avis): boolean {
    const utilisateur = this.authService.getUtilisateur();

    if (!utilisateur) {
      return false;
    }

    return this.authService.hasRole('ADMIN') ||
      avis.utilisateur_id === utilisateur.id_utilisateur;
  }

  peutSupprimerAvis(avis: Avis): boolean {
    const utilisateur = this.authService.getUtilisateur();

    if (!utilisateur) {
      return false;
    }

    return this.authService.hasAnyRole(['MODERATEUR', 'ADMIN']) ||
      avis.utilisateur_id === utilisateur.id_utilisateur;
  }

  getModeFormulaire(): 'ajout' | 'modification' {
    if (this.modeAvis() === 'modification') {
      return 'modification';
    }

    return 'ajout';
  }

  afficherAjoutAvis(): void {
    this.modeAvis.set('ajout');
    this.avisSelectionne.set(null);
    this.avisASupprimer.set(null);
  }

  afficherModificationAvis(avis: Avis): void {
    this.modeAvis.set('modification');
    this.avisSelectionne.set(avis);
    this.avisASupprimer.set(null);
  }

  demanderSuppressionAvis(avis: Avis): void {
    this.avisASupprimer.set(avis);
    this.modeAvis.set('aucun');
    this.avisSelectionne.set(null);
  }

  annulerActionAvis = (): void => {
    this.modeAvis.set('aucun');
    this.avisSelectionne.set(null);
    this.avisASupprimer.set(null);
  };

  enregistrerAvis = async (valeur: AvisFormValue): Promise<void> => {
    const utilisateur = this.authService.getUtilisateur();

    if (!utilisateur) {
      this.message.set('Vous devez être connecté pour enregistrer un avis.');
      return;
    }

    try {
      if (this.modeAvis() === 'ajout') {
        await this.avisService.createAvis({
          note: valeur.note,
          titre: valeur.titre,
          commentaire: valeur.commentaire,
          utilisateur_id: utilisateur.id_utilisateur,
          produit_id: this.produitId()
        });
      }

      if (this.modeAvis() === 'modification' && this.avisSelectionne()) {
        await this.avisService.updateAvis({
          id_avis: this.avisSelectionne()!.id_avis,
          note: valeur.note,
          titre: valeur.titre,
          commentaire: valeur.commentaire
        });
      }

      this.annulerActionAvis();
      await this.chargerAvis();
    }
    catch (error) {
      console.error(error);
      this.message.set('Erreur pendant l’enregistrement de l’avis.');
    }
  };

  confirmerSuppressionAvis = async (avis: Avis): Promise<void> => {
    try {
      await this.avisService.deleteAvis(avis.id_avis);
      this.annulerActionAvis();
      await this.chargerAvis();
    }
    catch (error) {
      console.error(error);
      this.message.set('Erreur pendant la suppression de l’avis.');
    }
  };

  async aimerAvis(idAvis: number): Promise<void> {
    try {
      await this.avisService.likeAvis(idAvis);
      await this.chargerAvis();
    }
    catch (error) {
      console.error(error);
      this.message.set('Erreur pendant l’ajout du j’aime.');
    }
  }

  getAuteurAvis(avis: Avis): string {
    return `${avis.utilisateur.prenom} ${avis.utilisateur.nom}`;
  }

  getNoteAvis(avis: Avis): string {
    if (avis.note === null) {
      return 'Non noté';
    }

    return `${avis.note}/10`;
  }
}