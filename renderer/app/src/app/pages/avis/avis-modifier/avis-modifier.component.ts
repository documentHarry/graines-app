import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Avis, AvisUpdateInput } from '../../../types/electron';
import { AvisService } from '../../../services/avis.service';

@Component({
  selector: 'app-avis-modifier',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './avis-modifier.component.html',
  styleUrl: './avis-modifier.component.css',
})

export class AvisModifierComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly avisService = inject(AvisService);
  private readonly router = inject(Router);

  id = input<string>();

  avis = signal<Avis | null>(null);
  isLoading = signal(true);
  message = signal('');

  avisForm = this.formBuilder.group({
    note: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
    titre: [''],
    commentaire: [''],
  });

  async ngOnInit(): Promise<void> {
    await this.chargerAvis();
  }

  async chargerAvis(): Promise<void> {
    const idAvis = Number(this.id());

    if (!idAvis) {
      this.message.set('Identifiant de l’avis invalide.');
      this.isLoading.set(false);
      return;
    }

    try {
      const avis = await this.avisService.getAvisById(idAvis);

      if (!avis) {
        this.message.set('Avis introuvable.');
        return;
      }

      this.avis.set(avis);

      this.avisForm.patchValue({
        note: avis.note ?? 5,
        titre: avis.titre ?? '',
        commentaire: avis.commentaire ?? '',
      });

      this.message.set('');
    }
    catch {
      this.message.set('Erreur pendant le chargement de l’avis.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  async enregistrer(): Promise<void> {
    if (this.avisForm.invalid || !this.avis()) {
      this.avisForm.markAllAsTouched();
      this.message.set('Veuillez remplir les champs obligatoires.');
      return;
    }

    const valeurFormulaire = this.avisForm.getRawValue();

    const avis: AvisUpdateInput = {
      id_avis: this.avis()!.id_avis,
      note: Number(valeurFormulaire.note),
      titre: valeurFormulaire.titre?.trim() || null,
      commentaire: valeurFormulaire.commentaire?.trim() || null,
    };

    try {
      await this.avisService.updateAvis(avis);
      await this.router.navigate(['/avis']);
    }
    catch {
      this.message.set('Une erreur technique est survenue pendant la modification de l’avis.');
    }
  }
}