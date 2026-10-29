import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    // An ng-core linked via pnpm-workspace.yaml must not bring its own copies.
    dedupe: [
      '@angular/core',
      '@angular/common',
      '@ngx-translate/core',
      'primeng',
      'rxjs'
    ],
  },
});
