import { Component, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Role } from '../../../types/electron';
import { RoleService } from '../../../services/role.service';

@Component({
  selector: 'app-role-supprimer',
  imports: [RouterLink],
  templateUrl: './role-supprimer.component.html',
  styleUrl: './role-supprimer.component.css',
})

export class RoleSupprimerComponent {
  private readonly roleService = inject(RoleService);
  private readonly router = inject(Router);

  id = input<string>();

  role = signal<Role | null>(null);
  isLoading = signal(true);
  message = signal('');

  async ngOnInit(): Promise<void> {
    await this.chargerRole();
  }

  async chargerRole(): Promise<void> {
    const idRole = Number(this.id());

    if (!idRole) {
      this.message.set('Identifiant du rôle invalide.');
      this.isLoading.set(false);
      return;
    }

    try {
      const roles = await this.roleService.getRoles();
      const role = roles.find(item => item.id_role === idRole) ?? null;

      if (!role) {
        this.message.set('Rôle introuvable.');
        return;
      }

      this.role.set(role);
      this.message.set('');
    }
    catch (error) {
      console.error('Erreur chargement rôle', { error, idRole });
      this.message.set('Erreur pendant le chargement du rôle.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  async supprimerRole(): Promise<void> {
    const role = this.role();

    if (!role) {
      return;
    }

    const confirmation = confirm('Voulez-vous vraiment supprimer ce rôle ?');

    if (!confirmation) {
      return;
    }

    try {
      await this.roleService.deleteRole(role.id_role);
      await this.router.navigate(['/roles']);
    }
    catch (error) {
      console.error('Erreur suppression rôle', { error, role });
      this.message.set(this.roleService.getMessageErreurSuppressionRole());
    }
  }

  async annuler(): Promise<void> {
    await this.router.navigate(['/roles']);
  }
}