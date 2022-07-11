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
import { FieldType } from '@ngx-formly/core';
import { RecordService } from '@rero/ng-core';

@Component({
  selector: 'admin-formly-field-type',
  template: `
    <div class="{{ field.templateOptions.className }}">
      {{ value }}
    </div>
  `
})
export class FieldRefTypeComponent extends FieldType implements OnInit {

  /** value */
  value: string;

  /**
   * Constructor
   * @param _recordService - RecordService
   */
  constructor(private _recordService: RecordService) {
    super();
  }

  /** OnInit hook */
  ngOnInit(): void {
    this._recordService.getRecords(this.to.resource, `pid:${this.model[this.to.recourceKey]}`)
      .subscribe((result: any) => {
        if (this._recordService.totalHits(result.hits.total) === 1) {
          let data = result.hits.hits[0].metadata;
          const keys = this.to.resourceField.split('.');
          if (this.to.resourceSelect) {
            const field = this.to.resourceSelect.field;
            const value = this.to.resourceSelect.value;
            data[keys[0]] = data[keys[0]].filter((element: any) => element[field] === value);
          }
          keys.forEach((key: string) => {
            if (data && key in data) {
              data = data[key];
            } else {
              data = undefined;
            }
          });
          this.value = data;
        } else {
          this.value = '---';
        }
      });
  }
}
