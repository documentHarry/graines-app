import { ipcMain } from 'electron';
import { METIER, TECHNIQUES, gererErreurPrisma } from '../errors/prisma-errors';
import { verifierMotDePasse } from '../security/password-utils';
import { AuthRepository } from '../repository/auth.repository';

export function enregistrerAuthIpc(authRepository: AuthRepository): void {
  ipcMain.handle('auth:login', async (_event, identifiants: {
      email: string;
      mot_de_passe: string;
    }) => {
      try {
        const utilisateur = await authRepository.getByEmailWithRoles(identifiants.email);

        if (!utilisateur) {
          throw new Error(METIER.LOGIN_INCORRECT);
        }

        const motDePasseValide = verifierMotDePasse(identifiants.mot_de_passe,
          utilisateur.mot_de_passe_hash, utilisateur.mot_de_passe_salt);

        if (!motDePasseValide) {
          throw new Error(METIER.LOGIN_INCORRECT);
        }

        return {
          id_utilisateur: utilisateur.id_utilisateur,
          nom: utilisateur.nom,
          prenom: utilisateur.prenom,
          email: utilisateur.email,
          roles: utilisateur.utilisateur_role.map(
            utilisateurRole => utilisateurRole.role.nom_role
          ),
        };
      } catch (error) {
        console.error('Erreur connexion IPC', { error, email: identifiants.email });
        gererErreurPrisma(error, [METIER.LOGIN_INCORRECT], TECHNIQUES.AUTH_LOGIN_ERROR);
      }
    }
  );
}