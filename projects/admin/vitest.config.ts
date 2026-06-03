import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

const root = resolve(__dirname, '../..');

export default defineConfig({
  resolve: {
    alias: {
      '@rero/shared': resolve(root, 'projects/shared/src/public-api.ts'),
      '@app/admin': resolve(root, 'projects/admin/src/app'),
      '@app/public-search': resolve(root, 'projects/public-search/src/app'),
    },
    dedupe: [
      '@angular/core',
      '@angular/common',
      '@ngx-translate/core',
      'primeng',
      'rxjs'
    ],
  },
});
