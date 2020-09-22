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
import { ResultItem } from '@rero/ng-core';

@Component({
  selector: 'admin-collection-brief',
  template: `
  <h5 class="mb-0 card-title">
    <i class="fa fa-circle mr-1 text-{{ record.metadata.published ? 'success' : 'danger' }}" aria-hidden="true"></i>
    <a id="collection-link" [routerLink]="[detailUrl.link]">{{ record.metadata.title }}</a>
    ({{ record.metadata.collection_id }})
  </h5>
  <div class="card-text">
    <div *ngIf="record.metadata.teachers" id="collection-teacher">
      <ng-container *ngFor="let teacher of record.metadata.teachers; let last = last">
      {{ teacher.name }}
      {{ last ? '' : ', ' }}
      </ng-container>
    </div>
    <div
      *ngIf="record.metadata.description"
      id="collection-start-end-date"
      [innerHtml]="record.metadata.description | nl2br"
    >
    </div>
    {{ record.metadata.start_date | dateTranslate: 'mediumDate' }}
    - {{ record.metadata.end_date | dateTranslate: 'mediumDate' }}
  </div>
  `
})
export class CollectionBriefViewComponent implements ResultItem {

  @Input()
  record: any;

  @Input()
  type: string;

  @Input()
  detailUrl: { link: string, external: boolean };
}
