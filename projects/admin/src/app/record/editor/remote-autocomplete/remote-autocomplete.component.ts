/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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
import { FieldType } from '@ngx-formly/core';
import { of, Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'admin-editor-formly-field-input',
  templateUrl: './remote-autocomplete.component.html'
})
export class RemoteAutocompleteInputTypeComponent extends FieldType implements OnInit {

  formGroup = null;

  asyncSelected = {
    name: undefined,
    ref: undefined,
    query: undefined,
    category: undefined
  };

  private _loaded = false;

  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;
  dataSource: Observable<any>;
  statesComplex: any[] = [];
  numberOfSuggestions = 10;

  constructor(
    private recordService: RecordService,
    private translateService: TranslateService
  ) {
    super();
  }

  get type() {
    return this.to.type || 'text';
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      name: new FormControl('')
      // name: this.field.formControl
    });
    this.asyncSelected = {
      name,
      ref: undefined,
      query: name,
      category: this.translateService.instant('create')
    };
    this.dataSource = new Observable((observer: any) => {
      // Runs on every search
      observer.next(this.formControl.value);
    }).pipe(mergeMap((token: any) => this.getAuthoritySuggestions(token)));
  }

  getAuthoritySuggestions(query) {
    if (!query) {
      return of([]);
    }
    const esQuery = `\\*.preferred_name_for_person:'${query}'`;
    return this.recordService
      .getRecords('mef', esQuery, 1, this.numberOfSuggestions)
      .pipe(
        map(results => {
          const names = [
            {
              name: query,
              ref: undefined,
              query,
              category: this.translateService.instant('create')
            }
          ];
          if (!results) {
            return [];
          }
          results.hits.hits.map(hit => {
            for (const source of ['idref', 'gnd']) {
              if (hit.metadata[source]) {
                names.push(this.getNameRef(hit.metadata, source, query));
              }
            }
          });
          return names;
        })
      );
  }


  /**
   * Returns name, $ref end category.
   *
   * @param metadata the meta data.
   * @param sourceName The name of the source.
   * @param query The query for the $ref.
   * @return the name the $ref and the category.
   */
  getNameRef(metadata, sourceName, query) {
    return {
      name: this.getNameSource(metadata[sourceName]),
      ref: `https://mef.rero.ch/api/${sourceName}/${metadata[sourceName].pid}`,
      query,
      category: this.translateService.instant('link to authority ' + sourceName)
    };
  }

  /**
   * Returns name of the source.
   *
   * @param sourceData the source.
   * @return name as string with ptreferred name + birth and death date.
   */
  getNameSource(sourceData) {
    if (sourceData) {
      const data = sourceData;
      let name = data.preferred_name_for_person;
      if (data.date_of_birth || data.date_of_death) {
        name += ', ';
        if (data.date_of_birth) {
          name += this.extractDate(data.date_of_birth);
        }
        name += ' - ';
        if (data.date_of_death) {
          name += this.extractDate(data.date_of_death);
        }
      }
      return name;
    }
  }

  getName(metadata) {
    for (const source of ['idref', 'gnd', 'bnf', 'rero']) {
      if (metadata[source]) {
        const data = metadata[source];
        let name = source.toUpperCase( );
        name += ': ' + data.preferred_name_for_person;
        if (data.date_of_birth || data.date_of_death) {
          name += ', ';
          if (data.date_of_birth) {
            name += this.extractDate(data.date_of_birth);
          }
          name += ' - ';
          if (data.date_of_death) {
            name += this.extractDate(data.date_of_death);
          }
        }
        return name;
      }
    }
  }

  extractDate(date) {
    const mDate = moment(date, ['YYYY', 'YYYY-MM', 'YYYY-MM-DD']);
    if (mDate.isValid()) {
      return mDate.format('YYYY');
    }
    return date;
  }

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
    if (e.item.ref != null) {
      const parent = this.field.parent;
      // save the type value to restore after reset
      const typeField = parent.fieldGroup.find(f => f.key === 'type');
      const typeFieldValue = typeField.formControl.value;
      // reset the fields
      parent.formControl.reset();
      // restore the type
      typeField.formControl.setValue(typeFieldValue);
      // set $ref value
      const refField = parent.fieldGroup.find(f => f.key === '$ref');
      refField.hide = false;
      refField.formControl.setValue(e.item.ref);
    } else {
      if (this.field.parent.formControl.get('$ref')) {
        this.field.parent.formControl.get('$ref').reset();
      }
    }
  }
}
