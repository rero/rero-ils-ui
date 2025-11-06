/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import { Routes } from '@angular/router';
import { _ } from '@ngx-translate/core';
import { PatronProfileComponent } from 'projects/public-search/src/app/patron-profile/patron-profile.component';
import { PatronProfilePersonalEditorComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-personal-editor/patron-profile-personal-editor.component';
import { PatronProfilePasswordComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-password/patron-profile-password.component';

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
