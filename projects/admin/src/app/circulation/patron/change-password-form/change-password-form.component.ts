/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
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

import { Component, inject, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { User, UserApiService } from '@rero/shared';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'admin-change-password-form',
  templateUrl: './change-password-form.component.html'
})
export class ChangePasswordFormComponent implements OnInit {

  private messageService: MessageService = inject(MessageService);
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private dynamicDialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);
  private translateService: TranslateService = inject(TranslateService);
  private userApiService: UserApiService = inject(UserApiService);

  /** patron to change the password */
  patron: User;

  /** form */
  form: UntypedFormGroup = new UntypedFormGroup({});

  /** model */
  model = {};

  /** form fields */
  formFields: FormlyFieldConfig[];

  ngOnInit() {
    this.patron = this.dynamicDialogConfig.data.patron;
    if (!this.patron) {
      this.closeModal();
    }
    this.initForm();
  }

  /**
   * Submit form
   * @param patron - Object
   * @param model - Object
   */
  submit(patron: any, model: any) {
    this.userApiService.changePassword(patron.username, model.password).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('Patron'),
          detail: this.translateService.instant('The patron password has been changed.')
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
          detail: this.translateService.instant('Update Patron Password'),
          sticky: true,
          closable: true
        });
        this.closeModal();
      }
    });
  }

  private initForm() {
    if (this.patron) {
      this.formFields = [
        {
          key: 'password',
          type: 'passwordGenerator',
          focus: true,
          props: {
            api: "/api/user/password/generate",
            label: this.translateService.instant('New password'),
            required: true,
            keydown: (field, event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
              }
            }
          }
        }
      ];
    }
  }

  closeModal() {
    this.dynamicDialogRef.close();
  }
}
