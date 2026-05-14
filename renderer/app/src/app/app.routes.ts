import { Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { ProduitsComponent } from './pages/produits/produits.component';
import { ProduitDetailComponent } from './pages/produit-detail/produit-detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'produits', component: ProduitsComponent },
  { path: 'produits/:id', component: ProduitDetailComponent },
  { path: '**', component: NotFoundComponent },
];