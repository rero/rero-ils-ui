// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { _, TranslatePipe, TranslateService } from "@ngx-translate/core";
import { CONFIG, HttpPendingService } from '@rero/ng-core';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { merge, of } from 'rxjs';
import { catchError, debounceTime, map, take } from 'rxjs/operators';
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
  private readonly destroyRef = inject(DestroyRef);
  readonly httpPending = inject(HttpPendingService);

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
  private fieldsMatching: Record<PasswordApiField, PasswordFormField> = {
    password: 'password',
    new_password: 'newPassword',
    new_password_confirm: 'confirmPassword'
  };

  /** Error message for password validator */
  private validatePasswordMessage = '';

  /** Submit form */
  submit() {
    if (this.httpPending.isPending()) { return; }
    this.form.updateValueAndValidity();
    if (this.form.valid === false) {
      this.showFormError();
      return;
    }

    const data = {
      password: this.model.password,
      new_password: this.model.newPassword,
      new_password_confirm: this.model.confirmPassword
    };

    this.userApiService.updatePassword(data).pipe(
      catchError((err: any) =>  of({ success: false, message: err.message, error: err.error?.errors?.at(0) }))
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
        if (!response.error) {
          this.showFormError();
          return;
        }

        // Same-password errors are reported on `password` by the API, but belong to the new password field.
        const isSamePasswordError = response.error.field === 'password'
          && data.password === data.new_password;
        const formField = isSamePasswordError
          ? 'newPassword'
          : this.fieldsMatching[response.error.field];
        const formControl = this.form.get(formField);
        if (!formControl) {
          this.showFormError();
          return;
        }

        formControl.setErrors({
          ...formControl.errors,
          invalid: { message: response.error.message }
        });
        if (isSamePasswordError) {
          this.clearSamePasswordErrorOnChange();
        }
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

  /** Display a generic form-level error. */
  private showFormError(): void {
    this.messageService.add({
      severity: 'error',
      summary: this.translateService.instant('Error'),
      detail: this.translateService.instant('The form contains errors.'),
      closable: true
    });
  }

  /** Remove only the same-password server error when either new password field changes. */
  private clearSamePasswordErrorOnChange(): void {
    const newPasswordControl = this.form.get('newPassword');
    const confirmPasswordControl = this.form.get('confirmPassword');
    if (!newPasswordControl || !confirmPasswordControl) {
      return;
    }

    merge(newPasswordControl.valueChanges, confirmPasswordControl.valueChanges)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const errors = { ...newPasswordControl.errors };
        delete errors.invalid;
        newPasswordControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
      });
  }

  /** Redirect to external project */
  private _redirect(): void {
    this.location.back();
  }
}

type PasswordApiField = 'password' | 'new_password' | 'new_password_confirm';
type PasswordFormField = 'password' | 'newPassword' | 'confirmPassword';

type IPasswordResponse = {
  success?: boolean;
  message: string;
  error?: { field: PasswordApiField, message: string };
}
