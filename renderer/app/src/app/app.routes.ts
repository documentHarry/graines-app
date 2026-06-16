import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guards';
import { ConnexionComponent } from './pages/connexion/connexion.component';
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
import { AromatesComponent } from './pages/aromates/aromates.component';
import { AromateDetailComponent } from './pages/aromates/aromate-detail/aromate-detail.component';
import { AromateAjouterComponent } from './pages/aromates/aromate-ajouter/aromate-ajouter.component';
import { AromateModifierComponent } from './pages/aromates/aromate-modifier/aromate-modifier.component';
import { AromateSupprimerComponent } from './pages/aromates/aromate-supprimer/aromate-supprimer.component';
import { ProprietesMedicinalesComponent } from './pages/proprietes-medicinales/proprietes-medicinales.component';
import { ProprieteMedicinaleAjouterComponent } from './pages/proprietes-medicinales/propriete-medicinale-ajouter/propriete-medicinale-ajouter.component';
import { ProprieteMedicinaleModifierComponent } from './pages/proprietes-medicinales/propriete-medicinale-modifier/propriete-medicinale-modifier.component';
import { ProprieteMedicinaleSupprimerComponent } from './pages/proprietes-medicinales/propriete-medicinale-supprimer/propriete-medicinale-supprimer.component';
import { ProduitsComponent } from './pages/produits/produits.component';
import { ProduitAjouterComponent } from './pages/produits/ajouter/produit-ajouter.component';
import { ProduitModifierComponent } from './pages/produits/modifier/produit-modifier.component';
import { ProduitDetailComponent } from './pages/produits/detail/produit-detail.component';
import { UtilisateursComponent } from './pages/utilisateurs/utilisateurs.component';
import { UtilisateurAjouterComponent } from './pages/utilisateurs/utilisateur-ajouter/utilisateur-ajouter.component';
import { UtilisateurDetailComponent } from './pages/utilisateurs/utilisateur-detail/utilisateur-detail.component';
import { UtilisateurModifierComponent } from './pages/utilisateurs/utilisateur-modifier/utilisateur-modifier.component';
import { UtilisateurSupprimerComponent } from './pages/utilisateurs/utilisateur-supprimer/utilisateur-supprimer.component';
import { UtilisateurRolesComponent } from './pages/utilisateurs/utilisateur-roles/utilisateur-roles.component';
import { UtilisateurAdresseAjouterComponent } from './pages/utilisateurs/utilisateur-adresse-ajouter/utilisateur-adresse-ajouter.component';
import { UtilisateurAdresseModifierComponent } from './pages/utilisateurs/utilisateur-adresse-modifier/utilisateur-adresse-modifier.component';
import { UtilisateurAdresseSupprimerComponent } from './pages/utilisateurs/utilisateur-adresse-supprimer/utilisateur-adresse-supprimer.component';
import { RolesComponent } from './pages/roles/roles.component';
import { RoleAjouterComponent } from './pages/roles/role-ajouter/role-ajouter.component'
import { RoleModifierComponent } from './pages/roles/role-modifier/role-modifier.component'
import { RoleSupprimerComponent } from './pages/roles/role-supprimer/role-supprimer.component'

import { NotFoundComponent } from './pages/not-found/not-found.component';

const PATHS = {
  ACCUEIL: '',
  CONNEXION: 'connexion',
  CATEGORIES: 'categories',
  ESPECES: 'especes',
  VARIETES: 'varietes',
  AROMATES: 'aromates',
  PROPRIETES_MEDICINALES: 'proprietes-medicinales',
  PRODUITS: 'produits',
  UTILISATEURS: 'utilisateurs',
  ROLES: 'roles',
} as const;

const SEGMENTS = {
  AJOUTER: 'ajouter',
  ID: ':id',
  MODIFIER_ID: 'modifier/:id',
  SUPPRIMER_ID: 'supprimer/:id',
  CATEGORIE_ID: 'categorie/:categorieId',
  ROLES_ID: 'roles/:id',
  ADRESSE_AJOUTER: ':id/adresses/ajouter',
  ADRESSE_MODIFIER_ID: ':id/adresses/modifier/:adresseId',
  ADRESSE_SUPPRIMER_ID: ':id/adresses/supprimer/:adresseId',
} as const;

const ROLES = {
  CLIENT: 'CLIENT',
  GESTIONNAIRE_CATALOGUE: 'GESTIONNAIRE_CATALOGUE',
  ADMIN: 'ADMIN',
} as const;

export const routes: Routes = [
  { path: PATHS.ACCUEIL, component: CategoriesComponent },
  { path: PATHS.CONNEXION, component: ConnexionComponent },

  { path: PATHS.CATEGORIES, component: CategoriesComponent },
  { path: `${PATHS.CATEGORIES}/${SEGMENTS.AJOUTER}`, component: CategorieAjouterComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.GESTIONNAIRE_CATALOGUE, ROLES.ADMIN] } },
  { path: `${PATHS.CATEGORIES}/${SEGMENTS.MODIFIER_ID}`, component: CategorieModifierComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.GESTIONNAIRE_CATALOGUE, ROLES.ADMIN] } },
  { path: `${PATHS.CATEGORIES}/${SEGMENTS.SUPPRIMER_ID}`, component: CategorieSupprimerComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.GESTIONNAIRE_CATALOGUE, ROLES.ADMIN] } },

  { path: PATHS.ESPECES, component: EspecesComponent },
  { path: `${PATHS.ESPECES}/${SEGMENTS.AJOUTER}`, component: EspeceAjouterComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.GESTIONNAIRE_CATALOGUE, ROLES.ADMIN] } },
  { path: `${PATHS.ESPECES}/${SEGMENTS.MODIFIER_ID}`, component: EspeceModifierComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.GESTIONNAIRE_CATALOGUE, ROLES.ADMIN] } },
  { path: `${PATHS.ESPECES}/${SEGMENTS.SUPPRIMER_ID}`, component: EspeceSupprimerComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.GESTIONNAIRE_CATALOGUE, ROLES.ADMIN] } },

  { path: PATHS.VARIETES, component: VarietesComponent },
  { path: `${PATHS.VARIETES}/${SEGMENTS.AJOUTER}`, component: VarieteAjouterComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.GESTIONNAIRE_CATALOGUE, ROLES.ADMIN] } },
  { path: `${PATHS.VARIETES}/${SEGMENTS.MODIFIER_ID}`, component: VarieteModifierComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.GESTIONNAIRE_CATALOGUE, ROLES.ADMIN] } },
  { path: `${PATHS.VARIETES}/${SEGMENTS.SUPPRIMER_ID}`, component: VarieteSupprimerComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.GESTIONNAIRE_CATALOGUE, ROLES.ADMIN] } },
  { path: `${PATHS.VARIETES}/${SEGMENTS.ID}`, component: VarieteDetailComponent },

  { path: PATHS.AROMATES, component: AromatesComponent },
  { path: `${PATHS.AROMATES}/${SEGMENTS.AJOUTER}`, component: AromateAjouterComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.GESTIONNAIRE_CATALOGUE, ROLES.ADMIN] } },
  { path: `${PATHS.AROMATES}/${SEGMENTS.MODIFIER_ID}`, component: AromateModifierComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.GESTIONNAIRE_CATALOGUE, ROLES.ADMIN] } },
  { path: `${PATHS.AROMATES}/${SEGMENTS.SUPPRIMER_ID}`, component: AromateSupprimerComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.GESTIONNAIRE_CATALOGUE, ROLES.ADMIN] } },
  { path: `${PATHS.AROMATES}/${SEGMENTS.ID}`, component: AromateDetailComponent },

  { path: PATHS.PROPRIETES_MEDICINALES, component: ProprietesMedicinalesComponent, 
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.GESTIONNAIRE_CATALOGUE, ROLES.ADMIN] } },
  { path: `${PATHS.PROPRIETES_MEDICINALES}/${SEGMENTS.AJOUTER}`, component: ProprieteMedicinaleAjouterComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.GESTIONNAIRE_CATALOGUE, ROLES.ADMIN] } },
  { path: `${PATHS.PROPRIETES_MEDICINALES}/${SEGMENTS.MODIFIER_ID}`, component: ProprieteMedicinaleModifierComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.GESTIONNAIRE_CATALOGUE, ROLES.ADMIN] } },
  { path: `${PATHS.PROPRIETES_MEDICINALES}/${SEGMENTS.SUPPRIMER_ID}`, component: ProprieteMedicinaleSupprimerComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.GESTIONNAIRE_CATALOGUE, ROLES.ADMIN] } },

  { path: PATHS.PRODUITS, component: ProduitsComponent },
  { path: `${PATHS.PRODUITS}/${SEGMENTS.AJOUTER}`, component: ProduitAjouterComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.GESTIONNAIRE_CATALOGUE, ROLES.ADMIN] } },
  { path: `${PATHS.PRODUITS}/${SEGMENTS.CATEGORIE_ID}`, component: ProduitsComponent },
  { path: `${PATHS.PRODUITS}/${SEGMENTS.MODIFIER_ID}`, component: ProduitModifierComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.GESTIONNAIRE_CATALOGUE, ROLES.ADMIN] } },
  { path: `${PATHS.PRODUITS}/${SEGMENTS.ID}`, component: ProduitDetailComponent },

  { path: PATHS.UTILISATEURS, component: UtilisateursComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.ADMIN] } },
  { path: `${PATHS.UTILISATEURS}/${SEGMENTS.AJOUTER}`, component: UtilisateurAjouterComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.ADMIN] } },
  { path: `${PATHS.UTILISATEURS}/${SEGMENTS.MODIFIER_ID}`, component: UtilisateurModifierComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.ADMIN] } },
  { path: `${PATHS.UTILISATEURS}/${SEGMENTS.SUPPRIMER_ID}`, component: UtilisateurSupprimerComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.ADMIN] } },
  { path: `${PATHS.UTILISATEURS}/${SEGMENTS.ROLES_ID}`, component: UtilisateurRolesComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.ADMIN] } },
  { path: `${PATHS.UTILISATEURS}/${SEGMENTS.ID}`, component: UtilisateurDetailComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.ADMIN] } },

  { path: `${PATHS.UTILISATEURS}/${SEGMENTS.ADRESSE_AJOUTER}`, component: UtilisateurAdresseAjouterComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.ADMIN] } },
  { path: `${PATHS.UTILISATEURS}/${SEGMENTS.ADRESSE_MODIFIER_ID}`, component: UtilisateurAdresseModifierComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.ADMIN] } },
  { path: `${PATHS.UTILISATEURS}/${SEGMENTS.ADRESSE_SUPPRIMER_ID}`, component: UtilisateurAdresseSupprimerComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.ADMIN] } },

  { path: PATHS.ROLES, component: RolesComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.ADMIN] } },
  { path: `${PATHS.ROLES}/${SEGMENTS.AJOUTER}`, component: RoleAjouterComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.ADMIN] } },
  { path: `${PATHS.ROLES}/${SEGMENTS.MODIFIER_ID}`, component: RoleModifierComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.ADMIN] } },
  { path: `${PATHS.ROLES}/${SEGMENTS.SUPPRIMER_ID}`, component: RoleSupprimerComponent,
    canActivate: [authGuard, roleGuard], data: { roles: [ROLES.ADMIN] } },

  { path: '**', component: NotFoundComponent }
];