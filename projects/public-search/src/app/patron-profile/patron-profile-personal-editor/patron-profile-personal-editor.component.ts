/*
 * RERO ILS UI
 * Copyright (C) 2022-2024 RERO
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
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { TranslateService } from '@ngx-translate/core';
import { CONFIG, RecordService, processJsonSchema, removeEmptyValues } from '@rero/ng-core';
import { AppSettingsService, UserService } from '@rero/shared';
import { MessageService } from 'primeng/api';
import { Subscription, forkJoin, of } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';

@Component({
  selector: 'public-search-patron-profile-personal-editor',
  templateUrl: './patron-profile-personal-editor.component.html'
})
export class PatronProfilePersonalEditorComponent implements OnInit, OnDestroy {

  private recordService: RecordService = inject(RecordService);
  private formlyJsonschema: FormlyJsonschema = inject(FormlyJsonschema);
  private translateService: TranslateService = inject(TranslateService);
  private appSettingsService: AppSettingsService = inject(AppSettingsService);
  private userService: UserService = inject(UserService);
  private document: Document = inject(DOCUMENT);
  private messageService: MessageService = inject(MessageService);

  // COMPONENT ATTRIBUTES =====================================================
  /** Request referer */
  @Input() referer: string | null;

  /** Form submission error */
  formError: string | null = null;
  /** Formly fields configuration populate by the JSONSchema */
  fields: FormlyFieldConfig[];
  /** form initial values */
  model: any = {};
  /** angular form group for ngx-formly */
  form: UntypedFormGroup = new UntypedFormGroup({});

  /** all component subscription */
  private _subscriptions = new Subscription();
  /** Additional style for a field */
  private _cssConfig = {
    keep_history: 'col-12 pl-0',
    default: 'col-6 pl-0'
  };
  /** Description for some fields defined as key */
  private _fieldDescription = {
    username: _('Username must start with a letter or a number, be at least three characters long and only contain alphanumeric characters, dashes and underscores.'),
    keep_history: _('If enabled the loan history is saved for a maximum of six months. It is visible to you and the library staff.')
  };

  /** Init hook */
  ngOnInit(): void {
    const schemaForm = this.recordService.getSchemaForm('users').pipe(
      tap(schema => {
        if (schema) {
          const disabledFields = this.appSettingsService.settings.userProfile.readOnlyFields;
          this.fields = [
            this.formlyJsonschema.toFieldConfig(processJsonSchema(schema.schema), {

              // post process JSONSchema7 to FormlyFieldConfig conversion
              map: (field: FormlyFieldConfig, jsonSchema: any) => {
                // If 'format' is defined into the jsonSchema, use it as props to try a validation on this field.
                // See: `email.validator.ts` file
                if (jsonSchema.format) {
                  field.props.type = jsonSchema.format;
                }
                // Add the "row" class to the main object
                if (field.key == null) {
                  field.props.containerCssClass = 'row';
                }
                const fkey = String(field.key);
                // Add a class on each field
                field.props.itemCssClass = (fkey in this._cssConfig)
                  ? this._cssConfig[fkey]
                  : this._cssConfig.default;
                // Deactivation of the fields if we have a patron record
                if ((this.userService.user.roles.length > 0) && (field.key !== undefined && disabledFields.includes(fkey))) {
                  field.props.readonly = true;
                }
                // Hide password field
                if (fkey === 'password') {
                  field.props.readonly = true;
                  field.hide = true;
                }
                if (fkey === 'country') {
                  field.props.options.forEach((option: any) => {
                    option.label = this.translateService.instant('country_' + option.value);
                  });
                }
                // Translate validator message
                if ('validation' in field  && 'messages' in field.validation) {
                  Object.keys(jsonSchema.widget.formlyConfig.validation.messages).forEach((key: string) => {
                    field.validation.messages[key] = this.translateService.instant(String(field.validation.messages[key]));
                  });
                }

                // Add async validators on field
                switch (fkey) {
                  case 'email':
                    if (field.asyncValidators == null) {
                      field.asyncValidators = {};
                    }
                    field.asyncValidators.uniqueEmail = this.getUniqueValidator(
                      'email',
                      jsonSchema.widget.formlyConfig.validation.messages.uniqueEmailMessage
                    );
                    break;
                  case 'username':
                    if (field.asyncValidators == null) {
                      field.asyncValidators = {};
                    }
                    field.asyncValidators.uniqueUsername = this.getUniqueValidator(
                      'username',
                      jsonSchema.widget.formlyConfig.validation.messages.uniqueUsernameMessage
                    );
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
      })
    );

    const userQuery = this.recordService.getRecord('users', this.userService.user.id.toString());

    this._subscriptions.add(
      forkJoin([schemaForm, userQuery]).subscribe(([schema, user]: [any, any]) => {
        this.model = user.metadata;
      })
    );
  }

  /** On destroy hook */
  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  // COMPONENT FUNCTIONS ======================================================
  /** Submit form */
  submit() {
    this.form.updateValueAndValidity();
    if (this.form.valid === false) {
      this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant('Error'),
        detail: this.translateService.instant('The form contains errors.'),
        sticky: true,
        closable: true
      });
      return;
    }
    const data = removeEmptyValues(this.form.value);
    // Update user record and reload logged user
    this.recordService
      .update('users', this.userService.user.id.toString(), data)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('Success'),
            detail: this.translateService.instant('Your personal data has been updated.'),
            life: CONFIG.MESSAGE_LIFE
          });
          this.redirect();
        },
        error: (error) => this.formError = error.title
      });
  }

  // PRIVATE COMPONENT FUNCTIONS ==============================================
  /** Cancel edition */
  cancel(): void {
    this.redirect();
  }

  /** Redirect to external project */
  private redirect(): void {
    this.document.location.href = this.referer
      ? this.referer
      : this.appSettingsService.baseUrl;
  }

  /**
   * Create an Async validator to check the uniqueness of a value.
   *
   * @param fieldName - name of the field to check the uniqueness such as email
   *                    or username.
   * @returns boolean, true if find a value boolean.
   */
  private getUniqueValidator(fieldName: string, message: string) {
    return {
      expression: (control: UntypedFormControl) => {
        const { value } = control;
        return (value == null || value.length === 0)
          ? of(true)
          : this.recordService.getRecords('users', `${fieldName}:${value}`).pipe(
              debounceTime(1000),
              map((res: any) => {
                return (res.hits.hits.length === 0) ||
                  (res.hits.hits.length === 1 && res.hits.hits[0].id === this.userService.user.id);
              })
            );
      },
      message: this.translateService.instant(message)
    };
  }
}
