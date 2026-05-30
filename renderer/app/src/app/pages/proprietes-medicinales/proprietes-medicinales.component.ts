import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProprieteMedicinale, ProprieteMedicinaleCreateInput, ProprieteMedicinaleUpdateInput } from '../../types/electron';
import { ProprieteMedicinaleService } from '../../services/propriete-medicinale.service';

@Component({
  selector: 'app-proprietes-medicinales',
  imports: [ReactiveFormsModule],
  templateUrl: './proprietes-medicinales.component.html',
  styleUrl: './proprietes-medicinales.component.css',
})
export class ProprietesMedicinalesComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly proprieteMedicinaleService = inject(ProprieteMedicinaleService);

  proprietes = signal<ProprieteMedicinale[]>([]);
  proprieteSelectionnee = signal<ProprieteMedicinale | null>(null);
  mode = signal<'aucun' | 'ajout' | 'modification'>('aucun');
  recherche = signal('');

  isLoading = signal(true);
  message = signal('');

  proprieteForm = this.formBuilder.group({
    nom_propriete: ['', Validators.required]
  });

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
      console.error(error);
      this.message.set('Erreur pendant le chargement des propriétés médicinales.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  proprietesFiltrees = computed(() => {
    const recherche = this.recherche().toLowerCase().trim();

    return this.proprietes().filter(propriete => {
      return recherche === '' || propriete.nom_propriete.toLowerCase().includes(recherche);
    });
  });

  changerRecherche(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.recherche.set(input.value);
  }

  afficherAjout(): void {
    this.mode.set('ajout');
    this.proprieteSelectionnee.set(null);

    this.proprieteForm.reset({ nom_propriete: '' });
  }

  afficherModification(propriete: ProprieteMedicinale): void {
    this.mode.set('modification');
    this.proprieteSelectionnee.set(propriete);

    this.proprieteForm.reset({ nom_propriete: propriete.nom_propriete });
  }

  annuler(): void {
    this.mode.set('aucun');
    this.proprieteSelectionnee.set(null);

    this.proprieteForm.reset({ nom_propriete: '' });
  }

  async enregistrer(): Promise<void> {
    if (this.proprieteForm.invalid) {
      this.proprieteForm.markAllAsTouched();
      this.message.set('Veuillez saisir un nom de propriété médicinale.');
      return;
    }

    const valeurFormulaire = this.proprieteForm.getRawValue();
    const nomPropriete = valeurFormulaire.nom_propriete?.trim() ?? '';

    if (!nomPropriete) {
      this.message.set('Veuillez saisir un nom de propriété médicinale.');
      return;
    }

    try {
      if (this.mode() === 'ajout') {
        const propriete: ProprieteMedicinaleCreateInput = { nom_propriete: nomPropriete };

        await this.proprieteMedicinaleService.createProprieteMedicinale(propriete);
      }

      if (this.mode() === 'modification' && this.proprieteSelectionnee()) {
        const propriete: ProprieteMedicinaleUpdateInput = {
          id_propriete: this.proprieteSelectionnee()!.id_propriete,
          nom_propriete: nomPropriete
        };

        await this.proprieteMedicinaleService.updateProprieteMedicinale(propriete);
      }

      this.annuler();
      await this.chargerProprietes();
      this.message.set('');
    }
    catch (error) {
      console.error(error);
      this.message.set('Erreur pendant l’enregistrement de la propriété médicinale.');
    }
  }

  async supprimer(propriete: ProprieteMedicinale): Promise<void> {
    const confirmation = confirm('Voulez-vous vraiment supprimer cette propriété médicinale ? Elle sera aussi retirée des aromates associés.');

    if (!confirmation) {
      return;
    }

    try {
      await this.proprieteMedicinaleService.deleteProprieteMedicinale(propriete.id_propriete);
      await this.chargerProprietes();
      this.message.set('');
    }
    catch (error) {
      console.error(error);
      this.message.set('Erreur pendant la suppression de la propriété médicinale.');
    }
  }

  getTitreFormulaire(): string {
    if (this.mode() === 'ajout') {
      return 'Ajouter une propriété médicinale';
    }

    return 'Modifier une propriété médicinale';
  }
}