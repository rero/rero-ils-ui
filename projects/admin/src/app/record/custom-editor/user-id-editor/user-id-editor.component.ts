/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { Component, inject, OnInit, signal, ChangeDetectionStrategy} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { CONFIG, HttpPendingService, JSONSchema7, NgCoreTranslateService, processJsonSchema, RecordService, removeEmptyValues, SearchInputComponent } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { of } from 'rxjs';
import { debounceTime, map, switchMap, tap } from 'rxjs/operators';
import { Bind } from 'primeng/bind';
import { Divider } from 'primeng/divider';
import { Button } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'admin-user-id-editor',
    templateUrl: './user-id-editor.component.html',
    imports: [SearchInputComponent, Bind, Divider, FormsModule, ReactiveFormsModule, Button, FormlyModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserIdEditorComponent implements OnInit {

  private messageService: MessageService = inject(MessageService);
  private dynamicDialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private recordService: RecordService = inject(RecordService);
  private formlyJsonschema: FormlyJsonschema = inject(FormlyJsonschema);
  private translateService: NgCoreTranslateService = inject(NgCoreTranslateService);
  private appStore = inject(AppStore);
  readonly httpPending = inject(HttpPendingService);

  searchText = '';

  /** current User id in the invenio db */
  userID: string = null;

  /** remotely loaded User id in the invenio db */
  loadedUserID: string = null;

  /** JSONSchema */
  schema = null;

  /** form initial values */
  readonly model = signal<any>({});

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
            const processedSchema: any = processJsonSchema((schema as any).schema);
            this.fields = [
              this.formlyJsonschema.toFieldConfig(processedSchema, {

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
    ).subscribe(model => this.model.set(model));
  }

  /**
   * Retrieve a User given an email or a username.
   *
   * @param query - username or email to retrieve a User
   */
  searchValueUpdated(query: (string | null)): void {
    if (this.httpPending.isPending()) { return; }
    if (!query) {
      this.loadedUserID = null;
      this.passwordField.props.required = true;
      this.form.reset();
      this.model.set({});
      return;
    }
    this.recordService.getRecords('users', { query }).pipe(
      map((res: any) => {
        if (res.hits.hits.length === 0) {
          this.messageService.add({
            severity: 'warn',
            summary: this.translateService.instant('User'),
            detail: this.translateService.instant('User not found.'),
            life: CONFIG.MESSAGE_LIFE
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
        const currentOrgPid = this.appStore.currentOrganisationPid();
        const patronAccounts = model.metadata.patrons;
        // user has patron account
        if (patronAccounts && patronAccounts.length > 0) {
          const patronAccount = patronAccounts.filter((ptrn: any) => ptrn.organisation.pid === currentOrgPid).pop();
          // user has already an account in the logged librarian organisation
          if (patronAccount != null) {
            this.messageService.add({
              severity: 'info',
              summary: this.translateService.instant('User'),
              detail: this.translateService.instant('This person is already registered in your organisation.'),
              life: CONFIG.MESSAGE_LIFE
            });
            return of(null);
          }
        }
        this.messageService.add({
          severity: 'info',
          summary: this.translateService.instant('User'),
          detail: this.translateService.instant('The personal data has been successfully linked to this patron.'),
          life: CONFIG.MESSAGE_LIFE
        });
        this.loadedUserID = model.id;
        this.passwordField.props.required = false;
        this.form.reset();
        const metadata = model.metadata || null;
        this.model.set(metadata);
        return metadata;
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
    if (this.httpPending.isPending()) { return; }
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant('User'),
        detail: this.translateService.instant('The form contains errors.'),
        sticky: true,
        closable: true
      });
      return;
    }

    const data = removeEmptyValues(this.form.value);
    if (this.loadedUserID != null) {
      this.userID = this.loadedUserID;
    }
    if (this.userID != null) {
      data.pid = this.userID;
      this.recordService.update('users', data.pid, data)
        .subscribe({
          next: () => this.closeDialog(this.userID),
          error: (error: any) => {
            this.messageService.add(
              (error.status === 409 || error.status === 412)
                ? {
                    severity: 'warn',
                    summary: this.translateService.instant('Record conflict'),
                    detail: this.translateService.instant('This record has been modified by another user. Please reload the page — your local changes will be lost.'),
                    sticky: true,
                    closable: true
                  }
                : {
                    severity: 'error',
                    summary: this.translateService.instant('User'),
                    detail: error.title,
                    sticky: true,
                    closable: true
                  }
            );
          }
        });
    } else {
      this.recordService.create('users', data)
        .subscribe({
          next: (res: any) => { this.userID = res.id; this.closeDialog(this.userID); },
          error: (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('User'),
              detail: error.title,
              sticky: true,
              closable: true
            });
          }
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
        return this.recordService.getRecords('users', { query: `${fieldName}:${value}` }).pipe(
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
