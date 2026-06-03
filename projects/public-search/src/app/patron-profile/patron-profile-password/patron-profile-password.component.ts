/*
 * RERO ILS UI
 * Copyright (C) 2022-2026 RERO
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
import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { _, TranslatePipe, TranslateService } from "@ngx-translate/core";
import { CONFIG } from '@rero/ng-core';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { of } from 'rxjs';
import { catchError, debounceTime, map } from 'rxjs/operators';
import { UserApiService } from '../../api/user-api.service';

export function fieldPasswordMatchValidator(control: AbstractControl) {
  const { newPassword, confirmPassword } = control.value;

  // avoid displaying the message error when values are empty
  if (!confirmPassword || !newPassword) {
    return null;
  }

  if (confirmPassword === newPassword) {
    return null;
  }

  return { fieldMatch: { message: _('Password Not Matching') } };
}

@Component({
    selector: 'public-search-patron-profile-password',
    templateUrl: './patron-profile-password.component.html',
    imports: [ReactiveFormsModule, FormlyModule, TranslatePipe, LoadingBarModule, Button],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronProfilePasswordComponent {

  private location: Location = inject(Location);
  private translateService: TranslateService = inject(TranslateService);
  private userApiService: UserApiService = inject(UserApiService);
  private el: ElementRef = inject(ElementRef);
  private messageService: MessageService = inject(MessageService);

  /** Request referer */
  referer = input<string | null>(null);

  /** angular form group for ngx-formly */
  form: UntypedFormGroup = new UntypedFormGroup({});

  /** Model */
  model: any = {};

  /** Form fields */
  fields: FormlyFieldConfig[] = [{
    validators: {
      validation: [
        { name: 'passwordMatch', options: { errorPath: 'confirmPassword' } },
      ],
    },
    fieldGroup: [
      {
        key: 'password',
        type: 'input',
        focus: true,
        props: {
          type: 'password',
          label: _('Current password'),
          required: true,
          attributes: { autocomplete: 'current-password' },
        },
      },
      {
        key: 'newPassword',
        type: 'input',
        props: {
          type: 'password',
          label: _('New password'),
          required: true,
          minLength: 8,
          maxLength: 128,
          attributes: { autocomplete: 'new-password' },
        },
        asyncValidators: {
          'validatePassword': this.validatePassword()
        }
      },
      {
        key: 'confirmPassword',
        type: 'input',
        props: {
          type: 'password',
          label: _('Confirm new password'),
          required: true,
          minLength: 8,
          maxLength: 128,
          attributes: { autocomplete: 'new-password' },
        }
      }
    ]
  }];

  /** Matching fields between invenio and Angular */
  private fieldsMatching = {
    password: 'password',
    new_password: 'newPassword',
    new_password_confirm: 'confirmPassword'
  };

  /** Error message for password validator */
  private validatePasswordMessage = '';

  /** Submit form */
  submit() {
    this.form.updateValueAndValidity();
    if (this.form.valid === false) {
      this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant('Error'),
        detail: this.translateService.instant('The form contains errors.'),
        closable: true
      });
      return;
    }

    const data = {
      password: this.model.password,
      new_password: this.model.newPassword,
      new_password_confirm: this.model.confirmPassword
    };

    this.userApiService.updatePassword(data).pipe(
      catchError((err: any) =>  of({ success: false, message: err.message, error: err.error?.errors[0] }))
    ).subscribe((response: IPasswordResponse) => {
      if (!('success' in response)) {
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('Success'),
          detail: this.translateService.instant(response.message),
          life: CONFIG.MESSAGE_LIFE
        });
        // Close password form and show personal data
        this._redirect();
      } else {
        // Set error on field
        const formField = this.fieldsMatching[response.error.field];
        this.form.get(formField).setErrors({ invalid: { message: response.error.message } });
        // Make focus on error field
        this.el.nativeElement.querySelector(`#${formField}`).focus();
      }
    });
  }

  /** Async validator for the password validator */
  validatePassword(): any {
    return {
      expression: (control: UntypedFormControl) => {
        const { value } = control;
        if (value == null || value.length === 0) {
          return of(true);
        }
        return this.userApiService.validatePassword(value).pipe(
          debounceTime(500),
          map(() => of(true)),
          catchError((response) => {
            this.validatePasswordMessage = response.error.message;
            return of(false);
          })
        );
      },
      message: () => this.translateService.instant(this.validatePasswordMessage)
    };
  }

  /** Cancel action on form */
  cancel(): void {
    this._redirect();
  }

  /** Redirect to external project */
  private _redirect(): void {
    this.location.back();
  }
}

type IPasswordResponse = {
  success?: boolean;
  message: string;
  error?: { field: string, message: string };
}
