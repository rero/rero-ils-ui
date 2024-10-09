/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { JSONSchema7, NgCoreTranslateService, processJsonSchema, RecordService, removeEmptyValues } from '@rero/ng-core';
import { UserService } from '@rero/shared';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { of } from 'rxjs';
import { debounceTime, map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'admin-user-id-editor',
  templateUrl: './user-id-editor.component.html'
})
export class UserIdEditorComponent implements OnInit {

  private messageService: MessageService = inject(MessageService);
  private dynamicDialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private recordService: RecordService = inject(RecordService);
  private formlyJsonschema: FormlyJsonschema = inject(FormlyJsonschema);
  private translateService: NgCoreTranslateService = inject(NgCoreTranslateService);
  private userService: UserService = inject(UserService);

  searchText: string = '';

  /** current User id in the invenio db */
  userID: string = null;

  /** remotely loaded User id in the invenio db */
  loadedUserID: string = null;

  /** JSONSchema */
  schema = null;

  /** form initial values */
  model: any = {};

  /** angular form group for ngx-formly */
  form: UntypedFormGroup;

  /** Formly fields configuration populate by the JSONSchema */
  fields: FormlyFieldConfig[];

  /** Password field */
  passwordField: FormlyFieldConfig;

  /**
   * Get the JSONSchema and add validators.
   */
  ngOnInit(): void {
    this.form = new UntypedFormGroup({});
    this.userID = this.dynamicDialogConfig?.data?.userID;
    this.recordService.getSchemaForm('users').pipe(
      tap(
        schema => {
          if (schema != null) {
            schema = processJsonSchema(schema.schema);
            this.fields = [
              this.formlyJsonschema.toFieldConfig(schema, {

                // post process JSONSchema7 to FormlyFieldConfig conversion
                map: (field: FormlyFieldConfig, jsonSchema: JSONSchema7) => {
                  // If 'format' is defined into the jsonSchema, use it as props to try a validation on this field.
                  // See: `email.validator.ts` file
                  if (jsonSchema.format) {
                    field.props.type = jsonSchema.format;
                    if (field.asyncValidators == null) {
                      field.asyncValidators = {};
                    }
                    field.asyncValidators.uniqueEmail = this.getUniqueValidator('email');
                  }
                  if (field.props.label === 'Username') {
                    if (field.asyncValidators == null) {
                      field.asyncValidators = {};
                    }
                    field.asyncValidators.uniqueUsername = this.getUniqueValidator('username');
                  }
                  if (field.key === 'password') {
                    if (!this.userID) {
                      field.props.required = true;
                    }
                    this.passwordField = field;
                  }
                  // remove Message suffix to the message validation key
                  // (required for backend  translations)
                  if (field.validation) {
                    Object.keys(field.validation.messages).map(msg => {
                      if (msg.endsWith('Message')) {
                        const val = field.validation.messages[msg];
                        delete (field.validation.messages[msg]);
                        const newMsg = msg.replace(/Message$/, '');
                        field.validation.messages[newMsg] = val;
                      }
                    });
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
          : this.recordService.getRecord('users', this.userID);
      }),
      map((user: any) => user.metadata)
    ).subscribe(model => this.model = model);
  }

  /**
   * Retrieve a User given an email or a username.
   *
   * @param query - username or email to retrieve a User
   */
  searchValueUpdated(query: (string | null)): void {
    if (!query) {
      this.loadedUserID = null;
      this.passwordField.props.required = true;
      this.form.reset();
      this.model = {};
      return;
    }
    this.recordService.getRecords('users', query).pipe(
      map((res: any) => {
        if (res.hits.hits.length === 0) {
          this.messageService.add({
            severity: 'warn',
            summary: this.translateService.instant('User'),
            detail: this.translateService.instant('User not found.')
          })
          return null;
        }

        return res.hits.hits[0];
      }),
      map(model => {
        if (model == null) {
          return null;
        }
        // current logged user organisation
        const currentOrgPid = this.userService.user.currentOrganisation;
        const patronAccounts = model.metadata.patrons;
        // user has patron account
        if (patronAccounts && patronAccounts.length > 0) {
          const patronAccount = patronAccounts.filter((ptrn: any) => ptrn.organisation.pid === currentOrgPid).pop();
          // user has already an account in the logged librarian organisation
          if (patronAccount != null) {
            this.messageService.add({
              severity: 'info',
              summary: this.translateService.instant('User'),
              detail: this.translateService.instant('This person is already registered in your organisation.')
            });
            return of(null);
          }
        }
        this.messageService.add({
          severity: 'info',
          summary: this.translateService.instant('User'),
          detail: this.translateService.instant('The personal data has been successfully linked to this patron.')
        });
        this.loadedUserID = model.id;
        this.passwordField.props.required = false;
        this.form.reset();
        return this.model = model.metadata || null;
      }),
    ).subscribe();
  }

  closeDialog(value?: string): void {
    this.dynamicDialogRef.close(value);
  }

  /**
   * Submit the data if the form is valid.
   *
   * Create if the userID is null else update.
   */
  submit(): void {
    this.form.updateValueAndValidity();
    if (this.form.valid === false) {
      this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant('User'),
        detail: this.translateService.instant('The form contains errors.')
      });
      return;
    }

    const data = removeEmptyValues(this.form.value);
    if (this.loadedUserID != null) {
      this.userID = this.loadedUserID;
    }
    if (this.userID != null) {
      data.pid = this.userID;
      this.recordService.update('users', data.pid, data).subscribe(() => {
        this.closeDialog(this.userID);
      });
    } else {
      this.recordService.create('users', data).subscribe((res) => {
        this.userID = res.id;
        this.closeDialog(this.userID);
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
      expression: (control: UntypedFormControl) => {
        const { value } = control;
        if (value == null || value.length === 0) {
          return of(true);
        }
        return this.recordService.getRecords('users', `${fieldName}:${value}`).pipe(
          debounceTime(1000),
          map((res: any) => {
            const id = this.loadedUserID || this.userID;
            return (res.hits.hits.length === 0) ||
              (res.hits.hits.length === 1 && res.hits.hits[0].id === id);
          })
        );
      }
    };
  }
}
