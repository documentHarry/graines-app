import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Role, Utilisateur, UtilisateurRole } from '../../../types/electron';
import { RoleService } from '../../../services/role.service';
import { UtilisateurService } from '../../../services/utilisateur.service';
import { UtilisateurRoleService } from '../../../services/utilisateur-role.service';

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
  private readonly utilisateurRoleService = inject(UtilisateurRoleService);
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
      const utilisateurRoles = await this.utilisateurRoleService.getUtilisateurRoles(idUtilisateur);

      if (!utilisateur) {
        this.message.set('Utilisateur introuvable.');
        return;
      }

      this.utilisateur.set(utilisateur);
      this.roles.set(roles);
      this.utilisateurRoles.set(utilisateurRoles);

      this.rolesForm.patchValue({
        roles_ids: this.utilisateurRoleService.getRoleIdsDepuisUtilisateurRoles(utilisateurRoles),
      });

      this.message.set('');
    }
    catch (error) {
      console.error('Erreur chargement rôles utilisateur', { error, idUtilisateur });
      this.message.set('Erreur pendant le chargement des rôles de l’utilisateur.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  getNomComplet(): string {
    return this.utilisateurRoleService.getNomComplet(this.utilisateur());
  }

  isRoleCoche(role: Role): boolean {
    const rolesIds = this.rolesForm.controls.roles_ids.value ?? [];

    return this.utilisateurRoleService.isRoleCoche(role, rolesIds);
  }

  modifierRole(role: Role, event: Event): void {
    const input = event.target as HTMLInputElement;
    const rolesIds = this.rolesForm.controls.roles_ids.value ?? [];

    if (input.checked) {
      this.rolesForm.controls.roles_ids.setValue(
        this.utilisateurRoleService.ajouterRoleId(rolesIds, role)
      );
      return;
    }

    this.rolesForm.controls.roles_ids.setValue(
      this.utilisateurRoleService.retirerRoleId(rolesIds, role)
    );
  }

  async enregistrer(): Promise<void> {
    const utilisateur = this.utilisateur();

    if (!utilisateur) {
      this.message.set('Utilisateur introuvable.');
      return;
    }

    const rolesIds = this.rolesForm.controls.roles_ids.value ?? [];

    if (rolesIds.length === 0) {
      this.message.set(this.utilisateurRoleService.getMessageErreurAucunRole());
      return;
    }

    try {
      const donnees = this.utilisateurRoleService.construireUtilisateurRoleUpdateInput(
        utilisateur.id_utilisateur,
        rolesIds
      );

      await this.utilisateurRoleService.updateUtilisateurRoles(donnees);

      await this.router.navigate(['/utilisateurs', utilisateur.id_utilisateur]);
    }
    catch (error) {
      console.error('Erreur modification rôles utilisateur', { error, utilisateur, rolesIds });
      this.message.set(this.utilisateurRoleService.getMessageErreurModification());
    }
  }
}