// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormlyFieldConfig, FormlyFormBuilder, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '@rero/ng-core';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject } from 'rxjs';
import { AdvancedSearchService } from './advanced-search.service';
import { IFieldsData, IFieldsType, ISearchModel } from './i-advanced-search-config-interface';

@Component({
  selector: 'admin-document-advanced-search-form',
  templateUrl: './document-advanced-search-form.component.html',
  imports: [FormsModule, ReactiveFormsModule, FormlyModule, Bind, Button, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentAdvancedSearchFormComponent {

  private dynamicDialogRef = inject(DynamicDialogRef);
  private route = inject(ActivatedRoute);
  private localeStorage = inject(LocalStorageService);
  private translateService = inject(TranslateService);
  private advancedSearchService = inject(AdvancedSearchService);
  private formBuilder = inject(FormlyFormBuilder);

  private static LOCALE_STORAGE_NAME = 'advancedSearch';
  private static LOCALE_STORAGE_EXPIRED_IN_SECONDS = 600;

  protected configurationLoaded = signal(false);

  private fieldDataConfig!: IFieldsData;
  private fieldsSearchTypeConfig: IFieldsType = {};

  form = new FormGroup({});
  model!: ISearchModel;
  options: FormlyFormOptions = {};
  fieldsConfig: FormlyFieldConfig[] = [];

  private fieldHook = (field: any, selectName: string) => {
    const fieldControl = field.form.get(selectName);
    this.initField(field, fieldControl.value);
    fieldControl.valueChanges.subscribe((fieldKey: string) => {
      this.initField(field, fieldKey);
      field.formControl.setValue(null);
    });
  };

  private fieldSearchTypeHook = (field: any, selectName: string) => {
    const fieldControl = field.form.get(selectName);
    this.initFieldSearchType(field, fieldControl.value);
    fieldControl.valueChanges.subscribe((fieldKey: string) => {
      this.initFieldSearchType(field, fieldKey);
    });
  };

  constructor() {
    const { q } = this.route.snapshot.queryParams;
    this.initModel();
    this.advancedSearchService.load().subscribe(() => {
      this.initializeFieldConfig();
      this.loadOrResetStorage(q);
      this.configurationLoaded.set(true);
    });
  }

  /** Event to notify dialog closure */
  close(): void {
    this.dynamicDialogRef.close();
  }

  /** Clear the form and return it to its original state */
  clear(): void {
    this.initModel();
    this.localeStorage.remove(DocumentAdvancedSearchFormComponent.LOCALE_STORAGE_NAME);
  }

  /** Submit */
  submit(): void {
    this.localeStorage.set(DocumentAdvancedSearchFormComponent.LOCALE_STORAGE_NAME, this.model);
    this.dynamicDialogRef.close(this.generateQueryByModel(this.model))
  }

  /** Init formly model */
  private initModel(): void {
    this.model = {
      field: 'title',
      term: '',
      searchType: AdvancedSearchService.SEARCH_TYPE_CONTAINS,
      search: [{
        operator: AdvancedSearchService.OPERATOR_AND,
        field: 'title',
        term: '',
        searchType: AdvancedSearchService.SEARCH_TYPE_CONTAINS
      }],
    }
  }

  /**
   * Local storage management
   * @param q - Query string
   */
  private loadOrResetStorage(q: string): void {
    if (this.localeStorage.has(DocumentAdvancedSearchFormComponent.LOCALE_STORAGE_NAME)) {
      if (this.localeStorage.isExpired(
        DocumentAdvancedSearchFormComponent.LOCALE_STORAGE_NAME,
        DocumentAdvancedSearchFormComponent.LOCALE_STORAGE_EXPIRED_IN_SECONDS
      )) {
        this.localeStorage.remove(DocumentAdvancedSearchFormComponent.LOCALE_STORAGE_NAME);
      } else {
        const queryModel = this.localeStorage.get(DocumentAdvancedSearchFormComponent.LOCALE_STORAGE_NAME);
        if (q === this.generateQueryByModel(queryModel)) {
          this.model = queryModel;
        } else {
          this.localeStorage.remove(DocumentAdvancedSearchFormComponent.LOCALE_STORAGE_NAME);
        }
      }
    }
  }

  /**
   * Init field
   * @param field The current field
   * @param fieldParentKey The key of parent field
   * @param subject - Behavior Event
   */
  private initField(field: any, fieldParentKey: string): void {
    if (Object.keys(this.fieldDataConfig).some(key => key === fieldParentKey)) {
      field.props.group = false;
      field.props.translated = false;
      field.props.minItemsToDisplaySearch = 10;
      field.props.sort = true;
      field.props.placeholder = this.translateService.instant("Select…");
      field.props.sortOrder = "asc";
      field.props.class = "ui:w-full";
      field.props.styleClass = "ui:w-full";
      field.props.filter = true;
      field.props.required = true;
      field.type = 'select';
      field.props.options.next(this.fieldDataConfig[fieldParentKey]);
    } else {
      field.type = 'input';
      field.props.translated = false;
      field.props.placeholder = undefined;
      field.props.class = undefined;
      field.props.styleClass = undefined;
    }
    this.formBuilder.build(field);
  }

  /**
   * Init field search type
   * @param field The current field
   * @param fieldParentKey The key of parent field
   * @param subject - Behavior Event
   */
  private initFieldSearchType(field: any, fieldParentKey: string): void {
    if (Object.keys(this.fieldsSearchTypeConfig).some(key => key === fieldParentKey)) {
      field.props.sort = false;
      field.props.disabled = this.fieldsSearchTypeConfig[fieldParentKey].length < 2;
      field.props.options.next(this.fieldsSearchTypeConfig[fieldParentKey]);
      const fieldSearchTypeValue = this.fieldsSearchTypeConfig[fieldParentKey][0].value;
      if (
        !field.formControl.value
        || (field.formControl.value && fieldSearchTypeValue !== field.formControl.value)
      ) {
        field.formControl.setValue(fieldSearchTypeValue);
      }
    }
  }

  /**
   * Generate query by model
   * @param model - The form model
   * @returns a query string
   */
  private generateQueryByModel(model: ISearchModel): string {
    return this.advancedSearchService.generateQueryByModel(model);
  }

  /** Initializing the Formly configuration */
  private initializeFieldConfig(): void {
    this.fieldDataConfig = this.advancedSearchService.getFieldsData();
    this.fieldsSearchTypeConfig = this.advancedSearchService.getFieldsSearchType();
    this.fieldsConfig = [
      {
        fieldGroupClassName: 'ui:grid ui:grid-cols-12 ui:gap-4',
        fieldGroup: [
          {
            fieldGroupClassName: 'ui:grid ui:grid-cols-12 ui:gap-4',
            className: 'ui:col-span-11',
            fieldGroup: [
              {
                className: 'ui:col-span-6',
                type: 'select',
                key: 'field',
                props: {
                  sort: false,
                  hideLabel: true,
                  hideLabelSelectOption: true,
                  required: true,
                  minItemsToDisplaySearch: 999,
                  options: this.advancedSearchService.getFieldsConfig(),
                  appendTo: 'body'
                },
              },
              {
                className: 'ui:col-span-2',
                type: 'select',
                key: 'searchType',
                defaultValue: false,
                props: {
                  required: true,
                  hideLabelSelectOption: true,
                  options: new BehaviorSubject([]),
                  appendTo: 'body'
                },
                hooks: {
                  onInit: (field) => this.fieldSearchTypeHook(field, 'field')
                }
              },
              {
                className: 'ui:col-span-4',
                type: 'custom-field',
                key: 'term',
                props: {
                  required: true,
                  options: new BehaviorSubject([]),
                  appendTo: 'body'
                },
                hooks: {
                  onInit: (field) => this.fieldHook(field, 'field')
                }
              },
            ]
          },
        ],
      },
      {
        key: 'search',
        type: 'repeat',
        props: {
          maxItems: 4,
          minItems: 1,
        },
        fieldArray: {
          fieldGroup: [
            {
              fieldGroupClassName: 'ui:grid ui:grid-cols-12 ui:gap-4',
              fieldGroup: [
                {
                  className: 'ui:col-span-2',
                  type: 'select',
                  key: 'operator',
                  defaultValue: AdvancedSearchService.OPERATOR_AND,
                  props: {
                    hideLabel: true,
                    required: true,
                    options: this.advancedSearchService.getOperators(),
                    appendTo: 'body'
                  },
                },
                {
                  className: 'ui:col-span-4',
                  type: 'select',
                  key: 'field',
                  props: {
                    sort: false,
                    hideLabel: true,
                    hideLabelSelectOption: true,
                    required: true,
                    minItemsToDisplaySearch: 999,
                    options: this.advancedSearchService.getFieldsConfig(),
                    appendTo: 'body'
                  },
                },
                {
                  className: 'ui:col-span-2',
                  type: 'select',
                  key: 'searchType',
                  defaultValue: false,
                  props: {
                    required: true,
                    hideLabelSelectOption: true,
                    options: new BehaviorSubject([]),
                    appendTo: 'body'
                  },
                  hooks: {
                    onInit: (field) => this.fieldSearchTypeHook(field, 'field')
                  }
                },
                {
                  className: 'ui:col-span-4',
                  type: 'custom-field',
                  key: 'term',
                  props: {
                    options: new BehaviorSubject([]),
                    appendTo: 'body'
                  },
                  hooks: {
                    onInit: (field) => this.fieldHook(field, 'field')
                  }
                },
              ],
            },
          ],
        },
      },
    ]
  }
}
