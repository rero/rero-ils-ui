/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { RecordService } from '@rero/ng-core';

@Component({
  selector: 'admin-formly-field-type',
  template: `
    <div class="{{ field.props.className }}">
      {{ value }}
    </div>
  `,
})
export class FieldRefTypeComponent extends FieldType implements OnInit {

  private recordService: RecordService = inject(RecordService);
  private ref: ChangeDetectorRef = inject(ChangeDetectorRef);

  /** value */
  value: string;

  /** OnInit hook */
  ngOnInit(): void {
    this.recordService.getRecords(this.props.resource, `pid:${this.model[this.props.resourceKey]}`)
      .subscribe((result: any) => {
        if (this.recordService.totalHits(result.hits.total) === 1) {
          let data = result.hits.hits[0].metadata;
          const keys = this.props.resourceField.split('.');
          if (this.props.resourceSelect) {
            const {field, value} = this.props.resourceSelect;
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
        this.ref.detectChanges();
      });
  }
}
