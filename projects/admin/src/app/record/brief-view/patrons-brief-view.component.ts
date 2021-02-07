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
  selector: 'admin-patrons-brief-view',
  template: `
  <ng-container *ngIf="record">
    <h5 class="card-title mb-0">
      <a id="{{record.metadata.user_id + '-profile'}}" [routerLink]="[detailUrl.link]">
        {{ record.metadata.last_name }}, {{ record.metadata.first_name }}
      </a>
      <small class="ml-3" *ngIf="record.metadata.patron">
        <a id="{{record.metadata.patron.barcode[0] + '-loans'}}" [routerLink]="['/circulation', 'patron', record.metadata.patron.barcode[0]]">
          <i class="fa fa-exchange mr-2"></i>
          <span translate>Circulation</span>
        </a>
      </small>
    </h5>
    <div class="card-text px-2">
      <p class="mb-0">{{ record.metadata.birth_date | dateTranslate:'mediumDate' }} &mdash; {{ record.metadata.city }}</p>
      <span class="font-weight-bold">
        <ng-container *ngIf="record.metadata.roles.length === 1; else roles" translate>Role</ng-container>
        <ng-template #roles translate>Roles</ng-template>:
      </span>
      <span *ngFor="let role of record.metadata.roles; let isLast=last">
        {{ role | translate }}{{isLast ? '' : ', '}}
      </span>
    </div>
  <ng-container>
  `,
  styles: []
})
export class PatronsBriefViewComponent implements ResultItem {

  @Input()
  record: any;

  @Input()
  type: string;

  @Input()
  detailUrl: { link: string, external: boolean };
}
