import { ipcMain } from 'electron';
import { RoleRepository } from '../repository/role.repository';
import { RoleCreateInput, RoleUpdateInput } from '../../renderer/app/src/app/types/electron';

export function enregistrerRoleIpc(roleRepository: RoleRepository): void {
  ipcMain.handle('roles:get-all', async () => {
    return roleRepository.getAll();
  });

  ipcMain.handle('roles:create', async (_event, role: RoleCreateInput) => {
    return roleRepository.create(role);
  });

  ipcMain.handle('roles:update', async (_event, role: RoleUpdateInput) => {
    return roleRepository.update(role);
  });

  ipcMain.handle('roles:delete', async (_event, id: number) => {
    return roleRepository.delete(id);
  });
}