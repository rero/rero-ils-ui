// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Routes } from '@angular/router';
import { registerFormlyExtension } from '@app/admin/acquisition/formly/extension';
import { FORMLY_CONFIG, provideFormlyCore } from '@ngx-formly/core';
import { _, TranslateService } from '@ngx-translate/core';
import { registerNgCoreFormlyExtension, withNgCoreFormly } from '@rero/ng-core/editor';

import {
  fieldPasswordMatchValidator,
  PatronProfilePasswordComponent,
} from '../patron-profile/patron-profile-password/patron-profile-password.component';
import { PatronProfilePersonalEditorComponent } from '../patron-profile/patron-profile-personal-editor/patron-profile-personal-editor.component';

// Loaded lazily, so Formly stays out of the initial bundle of the patron profile.
export const patronProfileEditorRoutes: Routes = [
  {
    path: '',
    providers: [
      provideFormlyCore([
        ...(withNgCoreFormly() as any),
        {
          validators: [{ name: 'passwordMatch', validation: fieldPasswordMatchValidator }],
        },
      ]),
      {
        provide: FORMLY_CONFIG,
        multi: true,
        useFactory: registerNgCoreFormlyExtension,
        deps: [TranslateService],
      },
      {
        provide: FORMLY_CONFIG,
        multi: true,
        useFactory: registerFormlyExtension,
        deps: [TranslateService],
      },
    ],
    children: [
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
    ],
  },
];
