// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject, Injectable } from '@angular/core';
import { DocumentApiService } from '@app/admin/api/document-api.service';
import { _ } from "@ngx-translate/core";
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
  private fieldMappingMap: Map<string, string | null>;

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
  fieldMapping(field: string): string | null {
    const mapping = this.fieldMappingMap.get(field);
    if (mapping === undefined) {
      throw new SyntaxError(`Field mapping does not exist (${field})`);
    }
    return mapping;
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
    const query = [this.generateClause(model.field, model.term, model.searchType)];
    model.search.forEach((search: ISearch) => {
      if (search.term) {
        query.push(search.operator);
        query.push(this.generateClause(search.field, search.term, search.searchType));
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
    const fieldMapping: [string, string | null][] = [];
    config.fieldsConfig.forEach((field: ILabelValueField) => {
      if (field?.options?.search_type) {
        this.fieldsSearchType[field.value] = field.options.search_type;
      }
      fieldMapping.push([field.value, field.field]);
      this.fieldOptions.push({label: field.label, value: field.value});
    });
    this.fieldMappingMap = new Map<string, string | null>(fieldMapping);
  }

  /**
   * Generate a query clause.
   * @param fieldKey - The field configuration key
   * @param term - The search term
   * @param searchType - The search type
   * @returns a field-qualified or unqualified query clause
   */
  private generateClause(fieldKey: string, term: string, searchType: string): string {
    const protectedTerm = this.protectTerm(term, searchType);
    const field = this.fieldMapping(fieldKey);
    return field === null ? protectedTerm : `${this.protectStar(field)}:${protectedTerm}`;
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
        return `"${term.replace(/"/g, '\\"')}"`;
      }

      return `(${term.replace(/\(/g, '\\(').replace(/\)/g, '\\)')})`;
    }
}
