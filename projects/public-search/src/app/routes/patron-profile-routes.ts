// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Routes } from '@angular/router';
import { _ } from '@ngx-translate/core';

import { PatronProfileComponent } from '../patron-profile/patron-profile.component';

export const patronProfileRoutes: Routes = [
  {
    path: '',
    title: _('Patron: my account'),
    component: PatronProfileComponent,
  },
  {
    path: '',
    loadChildren: () => import('./patron-profile-editor-routes').then((m) => m.patronProfileEditorRoutes),
  },
];
