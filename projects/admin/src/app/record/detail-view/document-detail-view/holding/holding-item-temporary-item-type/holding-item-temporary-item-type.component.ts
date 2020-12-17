/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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

import { Component, Input } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'admin-holding-item-temporary-item-type',
  template: `
    <ng-container *ngIf="hasTemporaryItemType()">
      <div class="row">
        <div class="col-sm-4 col-md-3 pl-5">
          <i class="fa fa-long-arrow-right pr-1"></i>
          <i class="fa fa-exclamation-triangle text-warning pr-1"></i>
          <span class="label-title text-warning" translate>Temporary circulation category</span>
        </div>
        <div class="col-sm-8 col-md-9">
          {{ record.metadata.temporary_item_type.pid | getRecord:'item_types': 'field':'name' | async }}
          <span *ngIf="record.metadata.temporary_item_type.end_date as endDate" class="ml-1 small text-secondary">
            (<i class="fa fa-long-arrow-right" aria-hidden="true"></i> {{ endDate | dateTranslate :'shortDate' }})
          </span>
        </div>
      </div>
    </ng-container>
  `
})
export class HoldingItemTemporaryItemTypeComponent {

  /** Item record */
  @Input() record: any;


  hasTemporaryItemType(): boolean {
    if ('temporary_item_type' in this.record.metadata) {
      const endDateValue = this.record.metadata.temporary_item_type.end_date || undefined;
      return !(endDateValue && moment(endDateValue).isBefore(moment()));
    }
    return false;
  }

}
