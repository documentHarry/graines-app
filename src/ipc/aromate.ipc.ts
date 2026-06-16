import { ipcMain } from 'electron';
import { AromateRepository } from '../repository/aromate.repository';
import { AromateCreateInput, AromateUpdateInput } from '../../renderer/app/src/app/types/electron';

export function enregistrerAromateIpc(aromateRepository: AromateRepository): void {
  ipcMain.handle('aromates:get-all', async () => {
    return aromateRepository.getAll();
  });

  ipcMain.handle('aromates:get-by-id', async (_event, id: number) => {
    return aromateRepository.getById(id);
  });

  ipcMain.handle('aromates:create', async (_event, aromate: AromateCreateInput) => {
    const nouvelAromate = await aromateRepository.create(aromate);

    await aromateRepository.createProprietes(nouvelAromate.id_aromate, aromate.proprietes_ids);

    return aromateRepository.getById(nouvelAromate.id_aromate);
  });

  ipcMain.handle('aromates:update', async (_event, aromate: AromateUpdateInput) => {
    await aromateRepository.update(aromate);
    await aromateRepository.deleteProprietes(aromate.id_aromate);
    await aromateRepository.createProprietes(aromate.id_aromate, aromate.proprietes_ids);

    return aromateRepository.getById(aromate.id_aromate);
  });

  ipcMain.handle('aromates:delete', async (_event, id: number) => {
    return aromateRepository.delete(id);
  });
}