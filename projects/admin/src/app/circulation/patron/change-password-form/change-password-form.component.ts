/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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

import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { User, UserApiService } from '@rero/shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'admin-change-password-form',
  templateUrl: './change-password-form.component.html'
})
export class ChangePasswordFormComponent implements OnInit {

  /** patron to change the password */
  patron: User;

  /** form */
  form: UntypedFormGroup = new UntypedFormGroup({});

  /** model */
  model = {};

  /** form fields */
  formFields: FormlyFieldConfig[];

  /**
   * Constructor
   * @param _modalService - BsModalService
   * @param _bsModalRef - BsModalRef
   * @param _translateService - TranslateService
   * @param _toastr - ToastrService
   * @param _userApiService - UserApiService
   */
  constructor(
    private _modalService: BsModalService,
    private _bsModalRef: BsModalRef,
    private _translateService: TranslateService,
    private _toastr: ToastrService,
    private _userApiService: UserApiService
  ) { }

  /**
   * Component initialization.
   */
  ngOnInit() {
    const initialState: any = this._modalService.config.initialState;
    if (initialState.hasOwnProperty('patron')) {
      this.closeModal();
    }
    this.patron = initialState.patron;
    this._initForm();
  }

  /**
   * Submit form
   * @param model - Object
   */
  submit(patron, model) {
    this._userApiService.changePassword(patron.username, model.password).subscribe(
      () => {
        this._toastr.success(
          this._translateService.instant('The patron password has been changed.'),
        );
        this.closeModal();
      },
      (resp) => {
        let error = this._translateService.instant('An error has occurred.');
        if (resp.error && resp.error.message) {
          error = `${error}: (${resp.error.message})`;
        }
        this._toastr.error(
          error,
          this._translateService.instant('Update Patron Password'),
          { disableTimeOut: true }
        );
        this.closeModal();
      }
    );
  }

  /**
   * Initialize formly form.
   */
  private _initForm() {
    if (this.patron) {
      this.formFields = [
        {
          key: 'password',
          type: 'input',
          focus: true,
          templateOptions: {
            type: 'password',
            label: this._translateService.instant('New password'),
            required: true,
            // same as Invenio
            minLength: 6,
            maxLength: 128,
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

  /**
   * Close modal dialog
   * @param event - Event
   */
  closeModal() {
    this._bsModalRef.hide();
  }
}
