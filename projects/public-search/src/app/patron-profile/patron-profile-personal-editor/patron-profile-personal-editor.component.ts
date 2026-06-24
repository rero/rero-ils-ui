// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, input, signal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { TranslatePipe, TranslateService, _ } from "@ngx-translate/core";
import { CONFIG, HttpPendingService, RecordService, processJsonSchema, removeEmptyValues, resolve$ref } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { Subscription, forkJoin, of } from 'rxjs';
import { debounceTime, map, switchMap, tap } from 'rxjs/operators';

@Component({
    selector: 'public-search-patron-profile-personal-editor',
    templateUrl: './patron-profile-personal-editor.component.html',
    imports: [ReactiveFormsModule, FormlyModule, TranslatePipe, LoadingBarModule, Button, Toast],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronProfilePersonalEditorComponent implements OnInit, OnDestroy {

  private location: Location = inject(Location);
  private recordService: RecordService = inject(RecordService);
  private formlyJsonschema: FormlyJsonschema = inject(FormlyJsonschema);
  private translateService: TranslateService = inject(TranslateService);
  private appStore = inject(AppStore);
  private messageService: MessageService = inject(MessageService);
  readonly httpPending = inject(HttpPendingService);

  // COMPONENT ATTRIBUTES =====================================================
  /** Request referer */
  referer = input<string | null>();

  /** Form submission error */
  formError: string | null = null;
  /** Formly fields configuration populate by the JSONSchema */
  fields: FormlyFieldConfig[] = [];
  /** form initial values */
  readonly model = signal<any>(null);
  /** angular form group for ngx-formly */
  form: UntypedFormGroup = new UntypedFormGroup({});

  /** all component subscription */
  private _subscriptions = new Subscription();
  /** Additional style for a field */
  private _cssConfig = {
    keep_history: 'ui:col-span-12 ui:pl-0',
    default: 'ui:col-span-12 ui:md:col-span-6 ui:pl-0'
  };
  /** Init hook */
  ngOnInit(): void {
    const schemaForm = this.recordService.getSchemaForm('users').pipe(
      tap((schema: any) => {
        if (schema) {
          const disabledFields = this.appStore.settings().userProfile.readOnlyFields;
          const fields = [
            this.formlyJsonschema.toFieldConfig(processJsonSchema(resolve$ref(schema.schema, schema.schema.properties)), {

              // post process JSONSchema7 to FormlyFieldConfig conversion
              map: (field: FormlyFieldConfig, jsonSchema: any) => {
                // If 'format' is defined into the jsonSchema, use it as props to try a validation on this field.
                // See: `email.validator.ts` file
                if (jsonSchema.format) {
                  field.props!.type = jsonSchema.format;
                }
                // Add the "row" class to the main object
                if (field.key == null) {
                  field.type = 'formly-group';
                  field.props!.containerCssClass = 'ui:grid ui:grid-cols-12 ui:gap-4';
                }
                const fkey = String(field.key);
                // Add a class on each field
                field.props!.itemCssClass = (fkey in this._cssConfig)
                  ? this._cssConfig[fkey]
                  : this._cssConfig.default;
                // Deactivation of the fields if we have a patron record
                if ((this.appStore.user()?.profile.roles.length > 0) && (field.key !== undefined && disabledFields.includes(fkey))) {
                  field.props!.disabled = true;
                }
                // Hide password field
                if (fkey === 'password') {
                  field.props!.readonly = true;
                  field.hide = true;
                }
                if (fkey === 'country') {
                  field.props!.options?.forEach((option: any) => {
                    option.label = this.translateService.instant('country_' + option.value);
                  });
                }
                // Translate validator message
                if ('validation' in field  && 'messages' in field.validation!) {
                  Object.keys(jsonSchema.widget.formlyConfig.validation.messages).forEach((key: string) => {
                    field.validation!.messages![key] = this.translateService.instant(String(field.validation!.messages![key]));
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
                if (field.validation && 'messages' in field.validation) {
                  Object.keys(field.validation.messages!).map(msg => {
                    if (msg.endsWith('Message')) {
                      const val = field.validation!.messages![msg];
                      delete (field.validation!.messages![msg]);
                      const newMsg = msg.replace(/Message$/, '');
                      field.validation!.messages![newMsg] = val;
                    }
                  });
                }
                return field;
              }
            })
          ];

          // mark the root field
          if (!fields[0]?.wrappers) {
            fields[0].wrappers = ['card'];
          }
          else if (!fields[0].wrappers.includes('card') && !fields[0].wrappers.includes('hide')) {
            fields[0].wrappers.unshift('card');
          }

          this.fields = fields;
        }
      })
    );

    const userQuery = this.recordService.getRecord('users', this.appStore.user()?.id.toString());

    this._subscriptions.add(
      forkJoin([schemaForm, userQuery]).subscribe(([_schema, user]: [any, any]) => {
        this.model.set(user.metadata);
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
    if (this.httpPending.isPending()) { return; }
    this.form.markAllAsTouched();
    if (this.form.valid === false) {
      this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant('Error'),
        detail: this.translateService.instant('The form contains errors.'),
        closable: true
      });
      return;
    }
    const data = removeEmptyValues(this.model());
    // Update user record and reload logged user
    this.recordService
      .update('users', this.appStore.user()?.id.toString(), data)
      .pipe(
        switchMap(() => this.appStore.load())
      )
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
                  summary: this.translateService.instant('Error'),
                  detail: this.translateService.instant('An error occurred on the server: ') + error.title,
                  closable: true
                }
          );
        }
      });
  }

  // PRIVATE COMPONENT FUNCTIONS ==============================================
  /** Cancel edition */
  cancel(): void {
    this.redirect();
  }

  /** Redirect to external project */
  private redirect(): void {
    this.location.back();
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
          : this.recordService.getRecords('users', { query: `${fieldName}:${value}` }).pipe(
              debounceTime(1000),
              map((res: any) => {
                return (res.hits.hits.length === 0) ||
                  (res.hits.hits.length === 1 && res.hits.hits[0].id === this.appStore.user()?.id);
              })
            );
      },
      message: this.translateService.instant(message)
    };
  }
}
