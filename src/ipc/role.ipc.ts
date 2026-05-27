import { ipcMain } from 'electron';
import { RoleRepository } from '../repository/role.repository';

export function enregistrerRoleIpc(roleRepository: RoleRepository): void {
  ipcMain.handle('roles:get-all', async () => {
    return roleRepository.getAll();
  });
}