import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';
import path from 'node:path';
import fs from 'node:fs';

function copyDir(src: string, dest: string) {
  if (!fs.existsSync(src)) {
    throw new Error(`Missing dependency folder: ${src}`);
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
}

const config: ForgeConfig = {
  packagerConfig: {
    asar: false,
  },

  rebuildConfig: {},

  hooks: {
    packageAfterCopy: async (_config, buildPath) => {
      const projectRoot = process.cwd();

      copyDir(
        path.join(projectRoot, 'database'),
        path.join(buildPath, 'database')
      );

      copyDir(
        path.join(projectRoot, 'node_modules', 'better-sqlite3'),
        path.join(buildPath, 'node_modules', 'better-sqlite3')
      );

      copyDir(
        path.join(projectRoot, 'node_modules', 'bindings'),
        path.join(buildPath, 'node_modules', 'bindings')
      );

      copyDir(
        path.join(projectRoot, 'node_modules', 'file-uri-to-path'),
        path.join(buildPath, 'node_modules', 'file-uri-to-path')
      );

      copyDir(
        path.join(projectRoot, 'node_modules', '@prisma'),
        path.join(buildPath, 'node_modules', '@prisma')
      );
    },
  },
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main/main.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/preload/preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),

 ],
};

export default config;
