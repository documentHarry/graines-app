import { Component, computed, inject, signal } from '@angular/core';
import { Avis } from '../../types/electron';
import { AvisService } from '../../services/avis.service';
import { AuthService } from '../../services/auth.service';
import { AvisFiltresComponent } from './avis-filtres/avis-filtres.component';

@Component({
  selector: 'app-avis',
  imports: [AvisFiltresComponent],
  templateUrl: './avis.component.html',
  styleUrl: './avis.component.css',
})
export class AvisComponent {
  private readonly avisService = inject(AvisService);
  readonly authService = inject(AuthService);

  avis = signal<Avis[]>([]);
  isLoading = signal(true);
  titreRecherche = signal('');
  commentaireRecherche = signal('');
  produitRecherche = signal('');
  auteurRecherche = signal('');
  noteRecherche = signal('');
  statutRecherche = signal('');
  jaimeMinRecherche = signal('');
  message = signal('');

  async ngOnInit(): Promise<void> {
    await this.chargerAvis();
  }

  async chargerAvis(): Promise<void> {
    try {
      const avis = await this.avisService.getAvis();

      this.avis.set(avis);
      this.message.set('');
    }
    catch {
      this.message.set('Erreur pendant le chargement des avis.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  avisFiltres = computed(() => {
    const titreRecherche = this.titreRecherche().toLowerCase().trim();
    const commentaireRecherche = this.commentaireRecherche().toLowerCase().trim();
    const produitRecherche = this.produitRecherche().toLowerCase().trim();
    const auteurRecherche = this.auteurRecherche().toLowerCase().trim();
    const noteRecherche = this.noteRecherche();
    const statutRecherche = this.statutRecherche();
    const jaimeMinRecherche = Number(this.jaimeMinRecherche() || 0);

    return this.avis().filter(avis => {
      const auteur = this.getAuteur(avis).toLowerCase();

      const correspondTitre = titreRecherche === '' || (avis.titre ?? '').toLowerCase().includes(titreRecherche);

      const correspondCommentaire = commentaireRecherche === '' || (avis.commentaire ?? '').toLowerCase().includes(commentaireRecherche);

      const correspondProduit = produitRecherche === '' || avis.produit.intitule.toLowerCase().includes(produitRecherche);

      const correspondAuteur = auteurRecherche === '' || auteur.includes(auteurRecherche);

      const correspondNote = noteRecherche === '' || avis.note === Number(noteRecherche);

      const correspondStatut = statutRecherche === '' || avis.statut === statutRecherche;

      const correspondJaime =
        (avis.nombre_jaime ?? 0) >= jaimeMinRecherche;

      return correspondTitre && correspondCommentaire && correspondProduit && correspondAuteur
        && correspondNote && correspondStatut && correspondJaime;
    });
  });

  getAuteur(avis: Avis): string {
    return `${avis.utilisateur.prenom} ${avis.utilisateur.nom}`;
  }

  async supprimerAvis(idAvis: number): Promise<void> {
    const confirmation = confirm('Voulez-vous vraiment supprimer cet avis ?');

    if (!confirmation) {
      return;
    }

    try {
      await this.avisService.deleteAvis(idAvis);
      await this.chargerAvis();
    }
    catch {
      this.message.set('Erreur pendant la suppression de l’avis.');
    }
  }
}