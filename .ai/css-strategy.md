# CSS Strategy

## Two deployment contexts

### Admin app
The admin app is a **standalone Angular application** — it occupies the full page in its Flask/Jinja template with no other CSS framework loaded alongside it. No style isolation is needed.

### Public apps (`public-search`, `public-patron-profile`, `public-holdings-items`, `search-bar`)
These apps are **embedded as web components inside Flask/Jinja templates** that already load Bootstrap. Angular styles must be isolated to avoid conflicts with Bootstrap (especially resets like `preflight` vs Bootstrap's own reboot).

Isolation is enforced by scoping Angular styles under the `.rero-ils-ui` CSS class, which is applied to each Angular root element in the Flask template:

```html
<public-search-root class="rero-ils-ui"></public-search-root>
```

---

## CSS cascade layer ordering

All projects declare an explicit layer ordering so that layer priority is predictable regardless of load order. The declaration lives in a `<style>` tag at the top of each `index.html` `<head>`:

```html
<style>
  @layer bootstrap, theme, base, rero-ils-ui, primeng, utilities;
</style>
```

Order = lowest to highest priority:
| Layer | Contents |
|-------|----------|
| `bootstrap` | Bootstrap CSS (dev only, loaded via `bootstrap_styles.scss`) |
| `theme` | Tailwind theme tokens (`@layer theme`) |
| `base` | Tailwind preflight/base reset |
| `rero-ils-ui` | Application styles, ng-core theme & typography |
| `primeng` | PrimeNG component styles (`tailwindcss-primeui` plugin) |
| `utilities` | Tailwind utility classes (`@layer utilities`) |

> **Admin** uses the same ordering. Because there is no Bootstrap in production, the `bootstrap` layer is simply empty and has no effect.

---

## PrimeNG layer injection anchor

PrimeNG dynamically injects a `@layer` order declaration into the DOM at runtime. To control exactly where it appears (after our own layer declaration, before bundled stylesheets), each public `index.html` includes an empty placeholder that PrimeNG targets:

```html
<style>
  @layer bootstrap, theme, base, rero-ils-ui, primeng, utilities;
</style>
<style type="text/css" data-primeng-style-id="layer-order"></style>
```

This tag is placed in all public apps. Admin does not need it because PrimeNG is configured with a default css order (no runtime layer wrapping).

---

## Stylesheet structure per project

### Shared base (`projects/shared/src/scss/styles.scss`)
Imported by all projects via `@use`. Provides:
- `easymde` styles
- `ng-core-tailwind` (pre-compiled Tailwind `@layer properties`, `@layer theme`, `@layer utilities` with `core:` prefix)
- `tailwindcss/theme.css` → `@layer theme` with `ui:` prefix
- `tailwindcss/utilities.css` → `@layer utilities` with `ui:` prefix
- `tailwindcss-primeui` plugin → `@layer primeng`
- Shared component styles (`files.component`, `contribution.component`)

### Public apps (`projects/public-search/src/app/scss/styles.scss`)
Production stylesheet. Scopes Angular-specific styles under `.rero-ils-ui`:

```scss
@use '../../../../shared/src/scss/styles';

// @theme blocks must be at root level (Tailwind v4 constraint)
@import "@rero/ng-core/assets/scss/colors";

@layer rero-ils-ui {
  .rero-ils-ui {
    @import "tailwindcss/preflight.css" prefix(ui);  // scoped, avoids Bootstrap conflict
    @import "@rero/ng-core/assets/scss/theme";
    @import "@rero/ng-core/assets/scss/typography";
    // component-specific imports...
  }
}
```

Key decisions:
- `colors.scss` at root because it contains `@theme {}` blocks (Tailwind v4 requires root-level)
- `preflight` inside `.rero-ils-ui` selector to avoid conflicting with Bootstrap's reboot outside Angular
- `theme` and `typography` scoped under `.rero-ils-ui` so ng-core styles don't leak to Bootstrap context
- Component SCSS files use `@import` (not `@use`) when they need to be nested inside a selector block

### Dev stylesheet (`projects/public-search/src/app/scss/bootstrap_styles.scss`)
Development-only. Adds Bootstrap inside `@layer bootstrap` so it participates in the cascade:

```scss
@use 'sass:meta';
@use "font-awesome/scss/font-awesome";
@use "./styles.scss";

@layer bootstrap {
  @include meta.load-css('bootstrap/dist/css/bootstrap');
}
```

### Admin (`projects/admin/src/app/scss/styles.scss`)
Uses `ng-core` directly (includes theme, typography and colors in one import) without `.rero-ils-ui` selector scope, since there is no Bootstrap conflict. Component-specific styles are loaded via `@use` at the top level:

```scss
@use "font-awesome/scss/font-awesome";
@use "../../../../shared/src/scss/styles";

@use "../menu/menu-dashboard/menu-dashboard.component";
@use "../menu/menu-app/menu-app.component";
// ... other component styles

@import "@rero/ng-core/assets/scss/ng-core";

:root { font-family: ...; }
body { margin: 0; }
.container { max-width: 1440px; margin: auto; }

@media print { ... }
```

---

## angular.json styles arrays

Each project has two style configurations:

| Config | Stylesheet |
|--------|-----------|
| default (dev) | `bootstrap_styles.scss` (public) or `styles.scss` (admin) |
| production | `styles.scss` |

**Why two stylesheets for public apps:**

- In **development**, `bootstrap_styles.scss` is used. It wraps Bootstrap inside `@layer bootstrap` to simulate the full Flask/Jinja/Bootstrap integration environment locally. This ensures that the layer cascade and style isolation work exactly as in production without having to run Flask.
- In **production**, `styles.scss` is used alone — Bootstrap is intentionally excluded because it is already loaded by the Flask/Jinja template that hosts the Angular app. Including it in the bundle would cause a duplicate load.

Admin always uses `styles.scss` in both environments — no Bootstrap is involved.

There is **no `layers.css` file** — layer ordering is handled exclusively by the `<style>` tag in `index.html`.

---

## Optimization settings in angular.json

Consistent across all projects:

```json
// options (default/dev)
"optimization": false

// configurations.production
"optimization": {
  "styles": {
    "inlineCritical": false
  }
}
```

`inlineCritical: false` is required in production because Angular's critical CSS inlining would embed styles directly into the generated `index.html`. In the Flask/Jinja integration, this would force copying that inlined CSS into each Jinja template manually. Keeping it `false` ensures all styles remain in external files that Flask can reference as static assets.
