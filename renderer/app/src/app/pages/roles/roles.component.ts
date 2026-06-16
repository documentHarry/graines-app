import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Role } from '../../types/electron';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-roles',
  imports: [RouterLink],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css',
})

export class RolesComponent {
  private readonly roleService = inject(RoleService);

  roles = signal<Role[]>([]);
  recherche = signal('');
  isLoading = signal(true);
  message = signal('');

  async ngOnInit(): Promise<void> {
    await this.chargerRoles();
  }

  async chargerRoles(): Promise<void> {
    try {
      const roles = await this.roleService.getRoles();

      this.roles.set(roles);
      this.message.set('');
    }
    catch (error) {
      console.error('Erreur chargement rôles', { error });
      this.message.set('Erreur pendant le chargement des rôles.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  rolesFiltres = computed(() => {
    return this.roleService.filtrerRoles(this.roles(), this.recherche());
  });

  changerRecherche(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.recherche.set(input.value);
  }
}