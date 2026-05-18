import { Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CategorieAjouterComponent } from './pages/categories/ajouter/categorie-ajouter.component';
import { CategorieModifierComponent } from './pages/categories/modifier/categorie-modifier.component';
import { CategorieSupprimerComponent } from './pages/categories/supprimer/categorie-supprimer.component';
import { EspecesComponent } from './pages/especes/especes.component';
import { EspeceAjouterComponent } from './pages/especes/espece-ajouter/espece-ajouter.component';
import { EspeceModifierComponent } from './pages/especes/espece-modifier/espece-modifier.component';
import { EspeceSupprimerComponent } from './pages/especes/espece-supprimer/espece-supprimer.component';
import { VarietesComponent } from './pages/varietes/varietes.component';
import { VarieteDetailComponent } from './pages/varietes/variete-detail/variete-detail.component';
import { VarieteAjouterComponent } from './pages/varietes/variete-ajouter/variete-ajouter.component';
import { VarieteModifierComponent } from './pages/varietes/variete-modifier/variete-modifier.component';
import { VarieteSupprimerComponent } from './pages/varietes/variete-supprimer/variete-supprimer.component';
import { ProduitsComponent } from './pages/produits/produits.component';
import { ProduitAjouterComponent } from './pages/produits/ajouter/produit-ajouter.component';
import { ProduitModifierComponent } from './pages/produits/modifier/produit-modifier.component';
import { ProduitDetailComponent } from './pages/produits/detail/produit-detail.component';

import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'categories/ajouter', component: CategorieAjouterComponent },
  { path: 'categories/modifier/:id', component: CategorieModifierComponent },
  { path: 'categories/supprimer/:id', component: CategorieSupprimerComponent },
  { path: 'especes', component: EspecesComponent },
  { path: 'especes/ajouter', component: EspeceAjouterComponent },
  { path: 'especes/modifier/:id', component: EspeceModifierComponent },
  { path: 'especes/supprimer/:id', component: EspeceSupprimerComponent},
  { path: 'varietes', component: VarietesComponent },
  { path: 'varietes/ajouter', component: VarieteAjouterComponent },
  { path: 'varietes/:id', component: VarieteDetailComponent },
  { path: 'varietes/modifier/:id', component: VarieteModifierComponent },
  { path: 'varietes/supprimer/:id', component: VarieteSupprimerComponent },
  { path: 'produits', component: ProduitsComponent },
  { path: 'produits/ajouter', component: ProduitAjouterComponent },
  { path: 'produits/categorie/:categorieId', component: ProduitsComponent },
  { path: 'produits/modifier/:id', component: ProduitModifierComponent },
  { path: 'produits/:id', component: ProduitDetailComponent },
  { path: '**', component: NotFoundComponent },
];