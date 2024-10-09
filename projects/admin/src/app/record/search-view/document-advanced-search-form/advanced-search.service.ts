/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { inject, Injectable } from '@angular/core';
import { DocumentApiService } from '@app/admin/api/document-api.service';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IAdvancedSearchConfig, IFieldsData, IFieldsType, ILabelValue, ILabelValueField, ISearch, ISearchModel, ISelectOptions } from './i-advanced-search-config-interface';

@Injectable({
  providedIn: 'root'
})
export class AdvancedSearchService {

  private documentApiService: DocumentApiService = inject(DocumentApiService);

  /** Field search types */
  public static SEARCH_TYPE_CONTAINS = 'contains';
  public static SEARCH_TYPE_CONTAINS_PHRASE = 'phrase';

  /** Search operator */
  public static OPERATOR_AND = 'AND';
  public static OPERATOR_OR = 'OR';
  public static OPERATOR_NOT = 'AND NOT';

  /** Fields options */
  public fieldOptions: ILabelValue[] = [];

  /** Fields data */
  public fieldData: IFieldsData;

  /** Fields mapping */
  private fieldMappingMap: Map<string, string>;

  /** Fields searchType mapping */
  private fieldsSearchType: IFieldsType = {};

  /**
   * Load advanced search configuration
   * @returns an observable with a Boolean that gives
   * information about the loaded configuration.
   */
  load(): Observable<any> {
    if (this.fieldData !== undefined) {
      return of(undefined);
    }

    return this.documentApiService.getAdvancedSearchConfig().pipe(
      tap((config: IAdvancedSearchConfig) => this.process(config)),
    );
  }

  /**
   * Get operator
   * @returns operators used for forms
   */
  getOperators(): ISelectOptions[] {
    return [
        { label: _('and'), value: AdvancedSearchService.OPERATOR_AND },
        { label: _('or'), value: AdvancedSearchService.OPERATOR_OR },
        { label: _('and not'), value: AdvancedSearchService.OPERATOR_NOT }
      ]
  }

  /**
   * Field mapping
   * @param field - the field name
   * @returns the field config
   */
  fieldMapping(field: string): string {
    if (!this.fieldMappingMap.has(field)) {
      throw new SyntaxError(`Field mapping does not exist (${field})`);
    }
    return this.fieldMappingMap.get(field);
  }

  /**
   * Get Fields config
   * Implementation of a getter to prevent data modification
   * @returns - fields options
   */
  getFieldsConfig(): ILabelValue[] {
    return this.fieldOptions;
  }

  /**
   * Get fields data
   * Implementation of a getter to prevent data modification
   * @returns - fields data options
   */
  getFieldsData(): IFieldsData {
    return this.fieldData;
  }

  /**
   * Get fields search type data
   * Implementation of a getter to prevent data modification
   * @returns - fields search type data options
   */
  getFieldsSearchType(): any {
    return this.fieldsSearchType;
  }

  /**
   * Generate query by model
   * @param model - The form model
   * @returns a query string
   */
  generateQueryByModel(model: ISearchModel): string {
    const query = [];
    let field: string = this.protectStar(this.fieldMapping(model.field));
    let term: string = this.protectTerm(model.term, model.searchType);
    query.push(`${field}:${term}`);
    model.search.forEach((search: ISearch) => {
      if (search.term) {
        query.push(search.operator);
        field = this.protectStar(this.fieldMapping(search.field));
        term = this.protectTerm(search.term, search.searchType);
        query.push(`${field}:${term}`);
      }
    });
    return query.join(' ');
  }

  /**
   * Process
   * @param config - the backend json config
   */
  private process(config: IAdvancedSearchConfig): void {
    this.fieldData = config.fieldsData;
    const fieldMapping = [];
    config.fieldsConfig.forEach((field: ILabelValueField) => {
      if (field?.options?.search_type) {
        this.fieldsSearchType[field.value] = field.options.search_type;
      }
      fieldMapping.push([field.value, field.field]);
      this.fieldOptions.push({label: field.label, value: field.value});
    });
    this.fieldMappingMap = new Map(fieldMapping);
  }

  /**
   * Protect Star
   * @param term - The string to project
   * @returns a protected string
   */
    private protectStar(term: string): string {
      return term.replace(/\.\*/g, '.\\*');
    }

    /**
     * Protect term
     * @param term - The string to project
     * @param searchType - The search type
     * @returns a protected string and delimited
     */
    private protectTerm(term: string, searchType: string): string {
      if (searchType === AdvancedSearchService.SEARCH_TYPE_CONTAINS_PHRASE) {
        return `"${term.replace(/\"/g, '\\"')}"`;
      }

      return `(${term.replace(/\(/g, '\\(').replace(/\)/g, '\\)')})`;
    }
}
