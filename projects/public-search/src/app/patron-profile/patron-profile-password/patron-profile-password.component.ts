/*
 * RERO ILS UI
 * Copyright (C) 2022 RERO
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
import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Input } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from '@rero/shared';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
  templateUrl: './patron-profile-password.component.html'
})
export class PatronProfilePasswordComponent {

  /** Request referer */
  @Input() referer: string | null;

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
        templateOptions: {
          type: 'password',
          label: 'Current password',
          required: true,
        },
      },
      {
        key: 'newPassword',
        type: 'input',
        templateOptions: {
          type: 'password',
          label: 'New password',
          required: true,
          minLength: 6,
          maxLength: 128
        },
      },
      {
        key: 'confirmPassword',
        type: 'input',
        templateOptions: {
          type: 'password',
          label: 'Confirm new password',
          required: true,
          minLength: 6,
          maxLength: 128,
        }
      }
    ]
  }];

  /** Matching fields between invenio and Angular */
  private _fieldsMatching = {
    password: 'password',
    new_password: 'newPassword',
    new_password_confirm: 'confirmPassword'
  };

  /**
   * Constructor
   *
   * @param _toastrService - ToastrService
   * @param _translateService - TranslateService
   * @param _userApiService - UserApiService
   * @param _appSettingsService - AppSettingsService
   * @param _el - ElementRef
   */
  constructor(
    private _toastrService: ToastrService,
    private _translateService: TranslateService,
    private _userApiService: UserApiService,
    private _appSettingsService: AppSettingsService,
    private _el: ElementRef,
    @Inject(DOCUMENT) private _document: Document
  ) { }

  /** Submit form */
  submit() {
    this.form.updateValueAndValidity();
    if (this.form.valid === false) {
      this._toastrService.error(
        this._translateService.instant('The form contains errors.')
      );
      return;
    }

    const data = {
      password: this.model.password,
      new_password: this.model.newPassword,
      new_password_confirm: this.model.confirmPassword
    };

    this._userApiService.updatePassword(data).pipe(
      catchError((err: any) =>  of({ success: false, message: err.message, error: err.error.errors[0] }))
    ).subscribe((response: IPasswordResponse) => {
      if (!('success' in response)) {
        this._toastrService.success(
          this._translateService.instant(response.message)
        );
        // Close password form and show personal data
        this._redirect();
      } else {
        // Set error on field
        const formField = this._fieldsMatching[response.error.field];
        this.form.get(formField).setErrors({ invalid: { message: response.error.message } });
        // Make forcus on error field
        this._el.nativeElement.querySelector(`#${formField}`).focus();
      }
    });
  }

  /** Cancel action on form */
  cancel(): void {
    this._redirect();
  }

  /** Redirect to external project */
  private _redirect(): void {
    this._document.location.href = this.referer
      ? this.referer
      : this._appSettingsService.baseUrl;
  }
}

interface IPasswordResponse {
  success?: boolean;
  message: string;
  error?: { field: string, message: string };
}
