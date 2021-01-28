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

  /** Patron types */
  patronTypes = [];

  /** Settings */
  settings: any;

  /** Section title */
  get title() {
    return `label` in this.field.templateOptions
      ? this.field.templateOptions.label
      : this._translateService.instant('Item types / Patron types matching');
  }


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
    forkJoin([
      this._patronTypeApiService.getAll(),
      this._itemTypeApiService.getAll(),
      this._circulationPolicyApiService.getAll(this.field.parent.model.pid)
    ]).subscribe(([patronTypes, itemTypes, circPolicies]) => {
      this.patronTypes = patronTypes;
      const settings = new Settings(this._apiService);
      this.settings = settings
        .setCirculationPolicy(this.form.value)
        .createStructure(itemTypes, patronTypes, circPolicies)
        .getStructure();
    });
  }

  /**
   * Checkbox click
   * @param checked - boolean
   * @param itemTypePid - string
   * @param patronTypePid - string
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

  /**
   * Setting
   * @param itemTypePid - string
   * @param patronTypePid - string
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
