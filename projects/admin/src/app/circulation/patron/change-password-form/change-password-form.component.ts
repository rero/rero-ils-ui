/*
 * RERO ILS UI
 * Copyright (C) 2020-2025 RERO
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

import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { CONFIG, HttpPendingService } from '@rero/ng-core';
import { User, UserApiService } from '@rero/shared';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';

@Component({
    selector: 'admin-change-password-form',
    templateUrl: './change-password-form.component.html',
    imports: [FormsModule, ReactiveFormsModule, FormlyModule, Bind, Button, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordFormComponent implements OnInit {

  private messageService: MessageService = inject(MessageService);
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private dynamicDialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);
  private translateService: TranslateService = inject(TranslateService);
  private userApiService: UserApiService = inject(UserApiService);
  readonly httpPending = inject(HttpPendingService);

  patron = signal<User | undefined>(undefined);
  form = signal(new UntypedFormGroup({}));
  readonly model = {};
  formFields = signal<FormlyFieldConfig[]>([]);

  ngOnInit() {
    const { patron } = this.dynamicDialogConfig.data;
    if (!patron) {
      this.closeModal();
      return;
    }
    this.patron.set(patron);
    this.formFields.set([
      {
        key: 'password',
        type: 'passwordGenerator',
        props: {
          api: '/api/user/password/generate',
          label: 'New password',
          required: true,
          keydown: (_, event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
            }
          }
        }
      }
    ]);
  }

  /**
   * Submit form
   * @param patron - Object
   * @param model - Object
   */
  submit(patron: any) {
    if (this.httpPending.isPending()) { return; }
    const password = this.form().get('password')?.value;
    if (!password || !this.form().valid) {
      return;
    }
    this.userApiService.changePassword(patron.username, password).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('Patron'),
          detail: this.translateService.instant('The patron password has been changed.'),
          life: CONFIG.MESSAGE_LIFE
        });
        this.closeModal();
      },
      error: (resp) => {
        let error = this.translateService.instant('An error has occurred.');
        if (resp.error && resp.error.message) {
          error = `${error}: (${resp.error.message})`;
        }
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Patron'),
          detail: `${this.translateService.instant('Update Patron Password')}.<br/>${error}`,
          sticky: true,
          closable: true
        });
        this.closeModal();
      }
    });
  }

  closeModal() {
    this.dynamicDialogRef.close();
  }
}
