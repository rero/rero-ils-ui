/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { TranslateService } from '@ngx-translate/core';
import { JSONSchema7, orderedJsonSchema, RecordService } from '@rero/ng-core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { debounceTime, map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'admin-user-id-editor',
  templateUrl: './user-id-editor.component.html'
})
export class UserIdEditorComponent implements OnInit {

  /** current query to import a user */
  searchText: string = null;

  /** current User id in the invenio db */
  userID: string = null;

  /** JOSONSchema */
  schema = null;

  /** form initial values */
  model: any = {};

  /** angular form group for ngx-formly */
  form: FormGroup;

  /** Formly fields configuration populate by the JSONSchema */
  fields: FormlyFieldConfig[];

  /**
   * Constructor
   *
   * @param _recordService - ng-core RecordService
   * @param bsModalRef - ngx-boostrap BsModalRef
   * @param _formlyJsonschema - ngx-formly FormlyJsonschema
   * @param _toastService - ngx-toastr ToastrService
   * @param _translateService - ngx-translate TranslateService
   */
  constructor(
    private _recordService: RecordService,
    public bsModalRef: BsModalRef,
    private _formlyJsonschema: FormlyJsonschema,
    private _toastService: ToastrService,
    private _translateService: TranslateService) {
    this.form = new FormGroup({});
  }

  /**
   * Get the JSONSchema and add validators.
   */
  ngOnInit(): void {
    this._recordService.getSchemaForm('users').pipe(
      tap(
        schema => {
          if (schema != null) {
            this.fields = [
              this._formlyJsonschema.toFieldConfig(orderedJsonSchema(schema.schema), {
                // post process JSONSChema7 to FormlyFieldConfig conversion
                map: (field: FormlyFieldConfig, jsonSchema: JSONSchema7) => {
                  if (field.templateOptions.label === 'Email') {
                    if (field.asyncValidators == null) {
                      field.asyncValidators = {};
                    }
                    field.asyncValidators.uniqueEmailMessage = this.getUniqueValidator('email');
                  }
                  if (field.templateOptions.label === 'Username') {
                    if (field.asyncValidators == null) {
                      field.asyncValidators = {};
                    }
                    field.asyncValidators.uniqueUsernameMessage = this.getUniqueValidator('username');
                  }
                  return field;
                }
              })
            ];
          }
        }
      ),
      switchMap(() => {
        return (this.userID == null)
          ? of({})
          : this._recordService.getRecord('users', this.userID);
      }),
      map(user => user.metadata)
    ).subscribe(model => this.model = model);
  }

  /**
   * Retrieve a User given an email or a username.
   *
   * @param query - username or email to retrieve a User
   */
  searchValueUpdated(query: (string | null)): void {
    this._recordService.getRecords('users', query).pipe(
      map((res: any) => {
        if (res.hits.hits.length === 0) {
          this._toastService.warning(
            this._translateService.instant('User not found.')
          );
          return of(null);
        }

        return res.hits.hits[0];
      }),
      map(model => {
        const roles = model.metadata.roles as Array<string>;
        if (roles) {
          const alreadyExists = roles.some(v => ['patron', 'librarian', 'system_librarian'].some(r => r === v));
          if (alreadyExists) {
            this._toastService.info(
              this._translateService.instant('This person is already registered in your organisation.')
            );
            return of(null);
          }
        }
        this._toastService.info(
          this._translateService.instant('The personal data has been successfully linked to this patron.')
        );
        this.userID = model.id;
        return this.model = model.metadata ? model.metadata : null;
      }),
    ).subscribe();
  }

  /**
   * Submit the data if the form is valid.
   *
   * Create if the userID is null else update.
   */
  submit(): void {
    this.form.updateValueAndValidity();
    if (this.form.valid === false) {
      this._toastService.error(
        this._translateService.instant('The form contains errors.')
      );
      return;
    }

    const data = this.form.value;
    if (this.userID != null) {
      data.pid = this.userID;
      this._recordService.update('users', data).subscribe(() => {
        this.bsModalRef.hide();
      });
    } else {
      this._recordService.create('users', data).subscribe((res) => {
        this.userID = res.id;
        this.bsModalRef.hide();
      });
    }
  }

  /**
   * Create an Async validator to check the uniqueness of a value.
   *
   * @param fieldName - name of the field to check the uniqueness such as email
   *                    or username.
   */
  getUniqueValidator(fieldName: string) {
    return {
      expression: (control: FormControl): Observable<boolean> => {
        const value = control.value;
        if (value == null) {
          return of(true);
        }
        return this._recordService.getRecords(
          'users',
          `${fieldName}:${value}`
        ).pipe(
          debounceTime(1000),
          map((res: any) => {
            return (res.hits.hits.length > 0 && res.hits.hits[0].id !== this.userID);
          })
        );
      }
    };
  }
}
