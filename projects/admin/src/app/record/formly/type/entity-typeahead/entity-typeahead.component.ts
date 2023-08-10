/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { MefTypeahead } from '@app/admin/classes/typeahead/mef-typeahead';
import { EntityTypeFilter } from '@app/admin/record/formly/type/entity-typeahead/entity-typeahead.interface';
import { FieldType } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { SuggestionMetadata } from '@rero/ng-core';
import { PERMISSIONS, PermissionsService } from '@rero/shared';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Observable, Observer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'admin-entity-typeahead',
  templateUrl: './entity-typeahead.component.html',
  styleUrls: ['./entity-typeahead.component.scss']
})
export class EntityTypeaheadComponent extends FieldType implements OnInit {

  // COMPONENT ATTRIBUTES =====================================================
  /** searched term */
  searchTerm: string = null;
  /** entity type filter options */
  entityTypeFilters: EntityTypeFilter[] = [];
  /** is the suggestions are loading ? */
  isSuggestionsLoading: boolean = false;

  /** observable on entity suggestions */
  suggestion$: Observable<(SuggestionMetadata | string)[][]>;
  /** observable on representation of the formControl value. */
  valueAsHTML$: Observable<string>;
  /** suggestions data from remote typeahead service */
  suggestionSections: TypeaheadMatch[][] = [];


  /** the number of suggestions to retrieve from suggestion service */
  private _numberOfSuggestions: number = 10;

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _remoteTypeahead - MefTypeahead
   * @param _translateService - TranslateService
   * @param _permissionService - PermissionsService
   */
  constructor(
    private _remoteTypeahead: MefTypeahead,
    private _translateService: TranslateService,
    private _permissionService: PermissionsService
  ) {
    super();
  }

  /** OnInit hook. */
  ngOnInit() {
   this._buildEntityTypeFilters();

   this.suggestion$ = new Observable((observer: Observer<string>) => observer.next(this.searchTerm)).pipe(
     switchMap((query: string) => {
       const selectedEntityType = this.entityTypeFilters.find(entity => entity.selected) || this.entityTypeFilters[0];
       const options = {filters: {selected: selectedEntityType.value}};
       return this._remoteTypeahead
         .getSuggestions(options, query, this._numberOfSuggestions)
         .pipe(
           map((suggestions: any) => {
            // Section header will be created only if suggestion defines a valid value.
            // If the suggestion doesn't define any value, this is because this is a fake suggestion;
            // added manually (see above).
            // In such case, don't create any TypeaheadMatch.
            if (
              this._permissionService.canAccess(PERMISSIONS.LOCENT_CREATE)
              && suggestions.find((suggestion: SuggestionMetadata) => suggestion.column === 1) === undefined
            ) {
              suggestions.push({
                label: undefined,
                value: undefined,
                group: this._translateService.instant('link to local authority'),
                column: 1,
              });
            }
            return suggestions;
           }),
           map((suggestions: any) => {
             let tmpSuggestions = this._splitSuggestionsByColumn(suggestions);
             tmpSuggestions = this._orderSuggestions(tmpSuggestions);
             this.suggestionSections = this._createSuggestionGroupHeader(tmpSuggestions);
             return suggestions;
           })
         );
     })
   );

   // get the template version of the formControl value
   this.valueAsHTML$ = new Observable((observer: Observer<string>) => observer.next(this.formControl.value)).pipe(
       switchMap((value: string) => {
         const selectedEntityType = this.entityTypeFilters.find(entity => entity.selected) || this.entityTypeFilters[0];
         const options = {filters: {selected: selectedEntityType.value}};
         return this._remoteTypeahead.getValueAsHTML(options, value);
       })
     );

  }

  // PUBLIC COMPONENT FUNCTIONS ===============================================
  /**
   * Handler when entity type filter change.
   * @param entityType: the selected filter on select menu
   */
  selectEntityType(entityType: string): void {
    this.searchTerm = null;
    this.entityTypeFilters.forEach(option => option.selected = option.value === entityType);
  }

  /**
   * Set the field value with the selected suggestion.
   * @param event: the clicked suggestion.
   */
  typeaheadOnSelect(event: TypeaheadMatch): void {
    if (event.item.value != null) {
      this.formControl.setValue(event.item.value);
    } else {
      this.formControl.get('$ref').reset();
    }
    this.searchTerm = null;
  }

  /** Clear current value */
  clear(): void {
    this.searchTerm = null;
    this.formControl.reset();
    this.field.focus = true;
  }

  // PRIVATE COMPONENT FUNCTIONS ==============================================
  /** Build the entity type filters based on `templateOptions` field section. */
  private _buildEntityTypeFilters(): void {
    this.to?.filters?.options.map(option => this.entityTypeFilters.push({
      ...option,
      ...{selected: option.value === this.to?.filters?.default}
    }));
  }

  /** Split suggestion from typeahead service by column. */
  private _splitSuggestionsByColumn(suggestions: SuggestionMetadata[]): SuggestionMetadata[][] {
    const sections = [];
    suggestions.forEach(suggestion => {
      if (typeof(suggestion) === 'string') {
        return;
      }
      const columnIdx = suggestion?.column || 0;
      if (!sections[columnIdx]) {
        sections[columnIdx] = [];
      }
      sections[columnIdx].push(suggestion);
    });
    return sections;
  }

  /** Order each suggestion for each section. */
  private _orderSuggestions(suggestionSections: SuggestionMetadata[][]): SuggestionMetadata[][] {
    return suggestionSections.map(section =>
      section.sort((a, b) =>
        (a.group === b.group)
          ? a.label.localeCompare(b.label)
          : a.group.localeCompare(b.group))
    );
  }

  /** Create group header for each suggestion sections. */
  private _createSuggestionGroupHeader(suggestionSections: SuggestionMetadata[][]): TypeaheadMatch[][] {
    return suggestionSections.map(section => {
      const newSectionSuggestions = [];
      let lastGroup = '';
      section.forEach(suggestion => {
        if (suggestion?.group && suggestion.group !== lastGroup) {
          lastGroup = suggestion.group;
          newSectionSuggestions.push(new TypeaheadMatch(suggestion.group, suggestion.group, true));
        }
        // We create a section header only if the value is present.
        // If we have a suggestion with no value, it's because it's been added manually (see above),
        // no need to create a new suggestion.
        if (suggestion.value) {
          newSectionSuggestions.push(new TypeaheadMatch(suggestion, suggestion.label, false));
        }
      });
      return newSectionSuggestions;
    })
  }
}
