/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { FieldArrayType } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '@rero/ng-core';
import { CirculationPolicyApiService } from 'projects/admin/src/app/api/circulation-policy-api.service';
import { ItemTypeApiService } from 'projects/admin/src/app/api/item-type-api.service';
import { PatronTypeApiService } from 'projects/admin/src/app/api/patron-type-api.service';
import { forkJoin } from 'rxjs';
import { Settings } from './class/settings';

@Component({
  selector: 'admin-cipo-patron-type-item-type',
  templateUrl: './cipo-patron-type-item-type.component.html'
})
export class CipoPatronTypeItemTypeComponent extends FieldArrayType implements OnInit {

  // COMPONENT ATTRIBUTES =====================================================
  /** Patron types */
  patronTypes = [];
  /** Settings */
  settings: any;

  /** Item types / Circulation category */
  private _itemTypes = [];
  /** already known circulation policies */
  private _circPolicies = [];
  /** previous appliedTo libraries */
  private _prevSelectedLibraries = [];

   // GETTER & SETTER ==========================================================
  /** Section title */
  get title(): string {
    return 'label' in this.field.templateOptions
      ? this.field.templateOptions.label
      : this._translateService.instant('Item types / Patron types matching');
  }

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _patronTypeApiService - PatronTypeApiService
   * @param _itemTypeApiService - ItemTypeApiService
   * @param _circulationPolicyApiService - CirculationPolicyApiService
   * @param _translateService - TranslateService
   * @param _apiService - ApiService
   */
  constructor(
    private _patronTypeApiService: PatronTypeApiService,
    private _itemTypeApiService: ItemTypeApiService,
    private _circulationPolicyApiService: CirculationPolicyApiService,
    private _translateService: TranslateService,
    private _apiService: ApiService
  ) {
    super();
  }

  /** OnInit hook */
  ngOnInit() {
    const appliedLibraries = this.field.parent.model.libraries || [];
    this._prevSelectedLibraries = this._getLibrariesRef(appliedLibraries);

    forkJoin([
      this._patronTypeApiService.getAll(),
      this._itemTypeApiService.getAll(),
      this._circulationPolicyApiService.getAll(this.field.parent.model.pid)
    ]).subscribe(([patronTypes, itemTypes, circPolicies]) => {
      this.patronTypes = patronTypes;
      this._itemTypes = itemTypes;
      this._circPolicies = circPolicies;
      this._loadSettings();
    });

    // Detect form changes : If user choose to create a "library level" cipo, then we need
    // to rebuild the settings table according to selected libraries.
    this.form.valueChanges.subscribe((changes) => {
      const formLibraries = changes.hasOwnProperty('libraries') ? this._getLibrariesRef(changes.libraries) : [];
      if (JSON.stringify(formLibraries) !== JSON.stringify(this._prevSelectedLibraries)) {
        this._prevSelectedLibraries = formLibraries;
        this._loadSettings(); // Rebuild the settings
      }
    });
  }

  // PUBLIC FUNCTIONS =========================================================
  /**
   * Manage click on a setting checkbox
   * @param checked - boolean : is the checkbox is checked
   * @param itemTypePid - string : the corresponding item type pid
   * @param patronTypePid - string : the corresponding patron type pid
   */
  onClick(checked: boolean, itemTypePid: string, patronTypePid: string): void {
    const settings = this.form.get('settings');
    const value = this._setting(itemTypePid, patronTypePid);
    if (checked) {
      this.add(settings.value.length, value);
    } else {
      const index = settings.value.findIndex((e: Setting) => {
        return JSON.stringify(e) === JSON.stringify(value);
      });
      this.remove(index);
    }
  }

  // PRIVATES FUNCTIONS ======================================================
  /**
   * Create a setting object
   * @param itemTypePid - string : the item type pid
   * @param patronTypePid - string : the patron type pid
   * @return: the corresponding `Setting` structure
   */
  private _setting(itemTypePid: string, patronTypePid: string): Setting {
    return {
      item_type: {
        $ref: this._apiService.getRefEndpoint('item_types', itemTypePid)
      },
      patron_type: {
        $ref: this._apiService.getRefEndpoint('patron_types', patronTypePid)
      }
    };
  }

  /** Build and load the settings table */
  private _loadSettings(): void {
    const settings = new Settings(this._apiService);
    this.settings = settings
      .setCirculationPolicy(this.form.value)
      .createStructure(this._itemTypes, this.patronTypes, this._circPolicies, this._prevSelectedLibraries)
      .getStructure();
  }

  /** Get libraries references */
  private _getLibrariesRef(libraries: Array<any>): Array<string> {
    return Array.from(new Set(
      libraries.map(library => library.$ref).filter(Boolean)  // Removes `null` or `undefined` values
    ));
  }
}

export class Setting {
  // tslint:disable-next-line: variable-name
  item_type: {
    $ref: string;
  };
  // tslint:disable-next-line: variable-name
  patron_type: {
    $ref: string;
  };
}
