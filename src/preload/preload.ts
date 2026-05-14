import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  getCategories: () =>
    ipcRenderer.invoke('categories:get-all'),

  getProduits: () =>
    ipcRenderer.invoke('produits:get-all'),

  getProduitById: (id: number) =>
    ipcRenderer.invoke('produits:get-by-id', id),
});