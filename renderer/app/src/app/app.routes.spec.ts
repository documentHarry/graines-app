import { Route } from '@angular/router';
import { routes } from './app.routes';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guards';

function trouverRoute(path: string): Route | undefined {
  return routes.find(route => route.path === path);
}

describe('app.routes', () => {
  const rolesCatalogue = ['GESTIONNAIRE_CATALOGUE', 'ADMIN'];
  const rolesAdmin = ['ADMIN'];
  const rolesUtilisateurDetail = ['ADMIN', 'SUPPORT_CLIENT'];
  const rolesAvisAjout = ['CLIENT', 'ADMIN'];
  const rolesAvisModification = ['CLIENT', 'MODERATEUR', 'ADMIN'];
  const rolesAvisSuppression = ['MODERATEUR', 'ADMIN'];

  function verifierRouteProtegee(path: string, rolesAttendus: string[]): void {
    const route = trouverRoute(path);

    expect(route).toBeDefined();
    expect(route?.canActivate).toEqual([authGuard, roleGuard]);
    expect(route?.data?.['roles']).toEqual(rolesAttendus);
  }

  function verifierRoutePublique(path: string): void {
    const route = trouverRoute(path);

    expect(route).toBeDefined();
    expect(route?.canActivate).toBeUndefined();
    expect(route?.data?.['roles']).toBeUndefined();
  }

  it('devrait déclarer les routes publiques', () => {
    verifierRoutePublique('');
    verifierRoutePublique('connexion');

    verifierRoutePublique('categories');
    verifierRoutePublique('especes');
    verifierRoutePublique('varietes');
    verifierRoutePublique('varietes/:id');

    verifierRoutePublique('produits');
    verifierRoutePublique('produits/categorie/:categorieId');
    verifierRoutePublique('produits/:id');

    verifierRoutePublique('avis');
  });

  it('devrait protéger les routes catalogue avec GESTIONNAIRE_CATALOGUE et ADMIN', () => {
    verifierRouteProtegee('categories/ajouter', rolesCatalogue);
    verifierRouteProtegee('categories/modifier/:id', rolesCatalogue);
    verifierRouteProtegee('categories/supprimer/:id', rolesCatalogue);

    verifierRouteProtegee('especes/ajouter', rolesCatalogue);
    verifierRouteProtegee('especes/modifier/:id', rolesCatalogue);
    verifierRouteProtegee('especes/supprimer/:id', rolesCatalogue);

    verifierRouteProtegee('varietes/ajouter', rolesCatalogue);
    verifierRouteProtegee('varietes/modifier/:id', rolesCatalogue);
    verifierRouteProtegee('varietes/supprimer/:id', rolesCatalogue);

    verifierRouteProtegee('produits/ajouter', rolesCatalogue);
    verifierRouteProtegee('produits/modifier/:id', rolesCatalogue);
  });

  it('devrait protéger les routes utilisateurs selon les rôles attendus', () => {
    verifierRouteProtegee('utilisateurs', rolesAdmin);
    verifierRouteProtegee('utilisateurs/ajouter', rolesAdmin);
    verifierRouteProtegee('utilisateurs/modifier/:id', rolesAdmin);
    verifierRouteProtegee('utilisateurs/supprimer/:id', rolesAdmin);
    verifierRouteProtegee('utilisateurs/roles/:id', rolesAdmin);
    verifierRouteProtegee('utilisateurs/:id', rolesUtilisateurDetail);
  });

  it('devrait placer la route wildcard en dernier', () => {
    const derniereRoute = routes[routes.length - 1];

    expect(derniereRoute.path).toBe('**');
  });

  it('devrait déclarer les routes spécifiques avant les routes génériques :id', () => {
    const paths = routes.map(route => route.path);

    expect(paths.indexOf('varietes/modifier/:id'))
      .toBeLessThan(paths.indexOf('varietes/:id'));

    expect(paths.indexOf('varietes/supprimer/:id'))
      .toBeLessThan(paths.indexOf('varietes/:id'));

    expect(paths.indexOf('utilisateurs/roles/:id'))
      .toBeLessThan(paths.indexOf('utilisateurs/:id'));

    expect(paths.indexOf('utilisateurs/modifier/:id'))
      .toBeLessThan(paths.indexOf('utilisateurs/:id'));

    expect(paths.indexOf('utilisateurs/supprimer/:id'))
      .toBeLessThan(paths.indexOf('utilisateurs/:id'));

    expect(paths.indexOf('produits/modifier/:id'))
      .toBeLessThan(paths.indexOf('produits/:id'));

    expect(paths.indexOf('produits/categorie/:categorieId'))
      .toBeLessThan(paths.indexOf('produits/:id'));
  });

  it('devrait protéger les routes avis selon les rôles attendus', () => {
    verifierRouteProtegee('avis/ajouter', rolesAvisAjout);
    verifierRouteProtegee('avis/modifier/:id', rolesAvisModification);
    verifierRouteProtegee('avis/supprimer/:id', rolesAvisSuppression);
  });

});