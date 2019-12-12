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

import { Component, Input } from '@angular/core';
import { ResultItem } from '@rero/ng-core';

@Component({
  selector: 'admin-vendor-brief-view',
  template: `
    <h5 class="mb-0 card-title">
      <a [routerLink]="['/records', 'vendors', 'detail', record.metadata.pid]">
        {{ record.metadata.name }}
    </a>
    </h5>
    <div class="card-text">
    <span *ngIf="record.metadata.name">
      {{ record.metadata.name }}
    </span>
    </div>
  `,
  styleUrls: []
})
export class VendorBriefViewComponent implements ResultItem {

  /** Record  data */
  record: any;

  /** Resource type */
  type: string;

  /** Detail URL to navigate to detail view */
  detailUrl: { link: string, external: boolean };

}
