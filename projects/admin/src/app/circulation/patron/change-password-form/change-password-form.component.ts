// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from '@openng/optimus-ui/api';
import { Bind } from '@openng/optimus-ui/bind';
import { Button } from '@openng/optimus-ui/button';
import { DynamicDialogConfig, DynamicDialogRef } from '@openng/optimus-ui/dynamicdialog';
import { CONFIG, HttpPendingService } from '@rero/ng-core';
import { User, UserApiService } from '@rero/shared';

@Component({
  selector: 'admin-change-password-form',
  templateUrl: './change-password-form.component.html',
  imports: [FormsModule, ReactiveFormsModule, FormlyModule, Bind, Button, TranslatePipe],
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
          },
        },
      },
    ]);
  }

  /**
   * Submit form
   * @param patron - Object
   * @param model - Object
   */
  submit(patron: any) {
    if (this.httpPending.isPending()) {
      return;
    }
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
          life: CONFIG.MESSAGE_LIFE,
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
          closable: true,
        });
        this.closeModal();
      },
    });
  }

  closeModal() {
    this.dynamicDialogRef.close();
  }
}
