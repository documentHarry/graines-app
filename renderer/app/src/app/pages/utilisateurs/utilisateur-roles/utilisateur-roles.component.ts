import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Role, Utilisateur, UtilisateurRole } from '../../../types/electron';
import { RoleService } from '../../../services/role.service';
import { UtilisateurService } from '../../../services/utilisateur.service';

@Component({
  selector: 'app-utilisateur-roles',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './utilisateur-roles.component.html',
  styleUrl: './utilisateur-roles.component.css',
})

export class UtilisateurRolesComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly utilisateurService = inject(UtilisateurService);
  private readonly roleService = inject(RoleService);
  private readonly router = inject(Router);

  id = input<string>();

  utilisateur = signal<Utilisateur | null>(null);
  roles = signal<Role[]>([]);
  utilisateurRoles = signal<UtilisateurRole[]>([]);
  isLoading = signal(true);
  message = signal('');

  rolesForm = this.formBuilder.group({
    roles_ids: this.formBuilder.control<number[]>([]),
  });

  async ngOnInit(): Promise<void> {
    await this.chargerDonnees();
  }

  async chargerDonnees(): Promise<void> {
    const idUtilisateur = Number(this.id());

    if (!idUtilisateur) {
      this.message.set('Identifiant de l’utilisateur invalide.');
      this.isLoading.set(false);
      return;
    }

    try {
      const utilisateur = await this.utilisateurService.getUtilisateurById(idUtilisateur);
      const roles = await this.roleService.getRoles();
      const utilisateurRoles = await this.roleService.getUtilisateurRoles(idUtilisateur);

      if (!utilisateur) {
        this.message.set('Utilisateur introuvable.');
        return;
      }

      this.utilisateur.set(utilisateur);
      this.roles.set(roles);
      this.utilisateurRoles.set(utilisateurRoles);

      this.rolesForm.patchValue({
        roles_ids: utilisateurRoles.map(utilisateurRole => utilisateurRole.role_id),
      });

      this.message.set('');
    }
    catch (error) {
      console.error(error);
      this.message.set('Erreur pendant le chargement des rôles de l’utilisateur.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  getNomComplet(): string {
    const utilisateur = this.utilisateur();

    if (!utilisateur) {
      return '';
    }

    return `${utilisateur.prenom} ${utilisateur.nom}`;
  }

  isRoleCoche(role: Role): boolean {
    const rolesIds = this.rolesForm.controls.roles_ids.value ?? [];

    return rolesIds.includes(role.id_role);
  }

  modifierRole(role: Role, event: Event): void {
    const input = event.target as HTMLInputElement;
    const rolesIds = this.rolesForm.controls.roles_ids.value ?? [];

    if (input.checked) {
      this.rolesForm.controls.roles_ids.setValue([ ...rolesIds, role.id_role ]);
      return;
    }

    this.rolesForm.controls.roles_ids.setValue(
      rolesIds.filter(roleId => roleId !== role.id_role)
    );
  }

  async enregistrer(): Promise<void> {
    if (!this.utilisateur()) {
      this.message.set('Utilisateur introuvable.');
      return;
    }

    const rolesIds = this.rolesForm.controls.roles_ids.value ?? [];

    if (rolesIds.length === 0) {
      this.message.set('Un utilisateur doit avoir au moins un rôle.');
      return;
    }

    try {
      await this.roleService.updateUtilisateurRoles({
        utilisateur_id: this.utilisateur()!.id_utilisateur,
        roles_ids: rolesIds,
      });

      await this.router.navigate(['/utilisateurs', this.utilisateur()!.id_utilisateur]);
    }
    catch (error) {
      console.error(error);
      this.message.set('Une erreur technique est survenue pendant la modification des rôles.');
    }
  }
}