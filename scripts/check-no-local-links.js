#!/usr/bin/env node
'use strict';

// Fails the build if a dependency in node_modules was installed via
// `pnpm link`/override instead of coming from the pnpm store, so a
// `pnpm run pack` never silently bundles an unpublished local version.
//
// Set ALLOW_LOCAL_LINKS (comma-separated package names, or "*" for any)
// to permit an intentional local install, e.g. CI building against an
// unpublished ng-core ref via `pnpm add ng-core/dist/rero/ng-core`.

const fs = require('fs');
const path = require('path');

const allowed = (process.env.ALLOW_LOCAL_LINKS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).filter(
  (name) => !allowed.includes('*') && !allowed.includes(name)
);

const offenders = deps.filter((name) => {
  const depPath = path.join('node_modules', name);
  if (!fs.existsSync(depPath)) {
    return false;
  }
  const real = fs.realpathSync(depPath);
  return !real.includes(`${path.sep}.pnpm${path.sep}`);
});

if (offenders.length > 0) {
  console.error('Local pnpm link(s) detected, refusing to pack:');
  offenders.forEach((name) => console.error(`  - ${name}`));
  console.error('\nRun "pnpm unlink <package>" (or "pnpm install") first.');
  process.exit(1);
}
