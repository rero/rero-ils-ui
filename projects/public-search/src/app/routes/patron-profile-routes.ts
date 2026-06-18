// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Routes } from '@angular/router';
import { _ } from '@ngx-translate/core';
import { PatronProfileComponent } from '../patron-profile/patron-profile.component';
import { PatronProfilePersonalEditorComponent } from '../patron-profile/patron-profile-personal-editor/patron-profile-personal-editor.component';
import { PatronProfilePasswordComponent } from '../patron-profile/patron-profile-password/patron-profile-password.component';

export const patronProfileRoutes : Routes = [
  {
    path: '',
    title: _('Patron: my account'),
    component: PatronProfileComponent,
  },
  {
    path: 'user/edit',
    title: _('Patron: edit my profile'),
    component: PatronProfilePersonalEditorComponent,
  },
  {
    path: 'password/edit',
    title: _('Patron: change password'),
    component: PatronProfilePasswordComponent,
  },
];
