import { Injectable, inject } from '@angular/core';
import { Categorie } from '../types/electron';
import { ElectronService } from './electron.service';

@Injectable({
  providedIn: 'root',
})
export class CategorieService {
  private readonly electronService = inject(ElectronService);

  getCategories(): Promise<Categorie[]> {
    return this.electronService.getApi().getCategories();
  }
}