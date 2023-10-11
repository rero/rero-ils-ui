/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
 * Copyright (C) 2021-2023 UCLouvain
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
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { LocalStorageService } from '@rero/ng-core';
import { BehaviorSubject } from 'rxjs';
import { AdvancedSearchService } from './advanced-search.service';
import { IFieldsData, IFieldsType, ISearchModel } from './i-advanced-search-config-interface';

@Component({
  selector: 'admin-document-advanced-search-form',
  templateUrl: './document-advanced-search-form.component.html'
})
export class DocumentAdvancedSearchFormComponent implements OnInit {

  /** Locale storage parameters */
  private static LOCALE_STORAGE_NAME = 'advancedSearch';
  private static LOCALE_STORAGE_EXPIRED_IN_SECONDS = 600;

  /** Closing event for the modal dialog */
  @Output() searchModel = new EventEmitter<string>(false);

  /** Hide dialog event */
  @Output() hideDialog = new EventEmitter<boolean>();

  /** Configuration loaded from backend */
  configurationLoaded: boolean = false;

  /** Field data config with map */
  fieldDataConfig: IFieldsData;

  /** Field search type config */
  fieldsSearchTypeConfig: IFieldsType = {};

  /** Form configuration */
  form = new FormGroup({});
  model: ISearchModel;
  options: FormlyFormOptions = {};
  fieldsConfig: FormlyFieldConfig[] = [];

  fieldHook = function(field: any, selectName: string) {
    const subject: BehaviorSubject<any> = new BehaviorSubject([]);
    const fieldControl = field.form.get(selectName);
    this.initField(field, fieldControl.value, subject);
    fieldControl.valueChanges.subscribe((fieldKey: string) => {
      this.initField(field, fieldKey, subject);
      field.formControl.setValue(null);
    });
  }

  fieldSearchTypeHook = function(field: any, selectName: string) {
    const subject: BehaviorSubject<any> = new BehaviorSubject([]);
    const fieldControl = field.form.get(selectName);
    this.initFieldSearchType(field, fieldControl.value, subject);
    fieldControl.valueChanges.subscribe((fieldKey: string) => {
      this.initFieldSearchType(field, fieldKey, subject);
    });
  }

  /**
   * Constructor
   * @param route - ActivatedRoute
   * @param localeStorage - LocalStorageService
   * @param AdvancedSearchService - AdvancedSearchService
   */
  constructor(
    private route: ActivatedRoute,
    private localeStorage: LocalStorageService,
    private advancedSearchService: AdvancedSearchService
  ) {}

  /** OnInit hook */
  ngOnInit(): void {
    const {q} = this.route.snapshot.queryParams;
    this.initModel();
    this.advancedSearchService.load().subscribe(() => {
      this.initializeFieldConfig();
      this.loadOrResetStorage(q);
      this.configurationLoaded = true;
    });
  }

  /** Event to notify dialog closure */
  close(): void {
    this.hideDialog.emit(true);
  }

  /** Clear the form and return it to its original state */
  clear(): void {
    this.initModel();
    this.localeStorage.remove(DocumentAdvancedSearchFormComponent.LOCALE_STORAGE_NAME);
  }

  /** Submit */
  submit(): void {
    this.localeStorage.set(DocumentAdvancedSearchFormComponent.LOCALE_STORAGE_NAME, this.model);
    this.searchModel.emit(this.generateQueryByModel(this.model));
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
  private initField(field: any, fieldParentKey: string, subject: BehaviorSubject<any>): void {
    if (Object.keys(this.fieldDataConfig).some(key => key === fieldParentKey)) {
      field.templateOptions = {
        options: subject.asObservable(),
        minItemsToDisplaySearch: 10,
        sort: false,
      };
      field.type = 'select';
      subject.next(this.fieldDataConfig[fieldParentKey]);
    } else {
      field.type = 'input';
    }
  }

  /**
   * Init field search type
   * @param field The current field
   * @param fieldParentKey The key of parent field
   * @param subject - Behavior Event
   */
  private initFieldSearchType(field: any, fieldParentKey: string, subject: BehaviorSubject<any>): void {
    if (Object.keys(this.fieldsSearchTypeConfig).some(key => key === fieldParentKey)) {
      field.templateOptions = {
        options: subject.asObservable(),
        sort: false,
      };
      subject.next(this.fieldsSearchTypeConfig[fieldParentKey]);
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
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            fieldGroupClassName: 'row',
            className: 'col-11',
            fieldGroup: [
              {
                className: 'col-6',
                type: 'select',
                key: 'field',
                defaultValue: 'title',
                templateOptions: {
                  sort: false,
                  hideLabel: true,
                  required: true,
                  options: this.advancedSearchService.getFieldsConfig(),
                },
              },
              {
                className: 'col-2',
                type: 'select',
                key: 'searchType',
                defaultValue: false,
                templateOptions: {
                  options: []
                },
                hooks: {
                  onInit: (field) => this.fieldSearchTypeHook(field, 'field')
                }
              },
              {
                className: 'col-4',
                type: 'custom-field',
                key: 'term',
                templateOptions: {
                  hideLabel: true,
                  required: true,
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
        templateOptions: {
          maxItems: 4,
          minItems: 1,
        },
        fieldArray: {
          fieldGroup: [
            {
              fieldGroupClassName: 'row',
              fieldGroup: [
                {
                  className: 'col-2',
                  type: 'select',
                  key: 'operator',
                  defaultValue: AdvancedSearchService.OPERATOR_AND,
                  templateOptions: {
                    hideLabel: true,
                    required: true,
                    options: this.advancedSearchService.getOperators(),
                  },
                },
                {
                  className: 'col-4',
                  type: 'select',
                  key: 'field',
                  defaultValue: 'title',
                  templateOptions: {
                    sort: false,
                    hideLabel: true,
                    required: true,
                    options: this.advancedSearchService.getFieldsConfig(),
                  },
                },
                {
                  className: 'col-2',
                  type: 'select',
                  key: 'searchType',
                  defaultValue: false,
                  templateOptions: {
                    options: []
                  },
                  hooks: {
                    onInit: (field) => this.fieldSearchTypeHook(field, 'field')
                  }
                },
                {
                  className: 'col-4',
                  type: 'custom-field',
                  key: 'term',
                  templateOptions: {
                    hideLabel: true,
                    options: [],
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
