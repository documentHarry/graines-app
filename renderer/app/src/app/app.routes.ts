import { Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CategorieAjouterComponent } from './pages/categories/ajouter/categorie-ajouter.component';
import { CategorieModifierComponent } from './pages/categories/modifier/categorie-modifier.component';
import { CategorieSupprimerComponent } from './pages/categories/supprimer/categorie-supprimer.component';
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
  { path: 'produits', component: ProduitsComponent },
  { path: 'produits/categorie/:categorieId', component: ProduitsComponent },
  { path: 'produits/ajouter', component: ProduitAjouterComponent },
  { path: 'produits/modifier/:id', component: ProduitModifierComponent },
  { path: 'produits/:id', component: ProduitDetailComponent },
  { path: '**', component: NotFoundComponent },
];