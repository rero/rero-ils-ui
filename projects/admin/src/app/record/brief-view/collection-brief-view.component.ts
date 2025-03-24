/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
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
    <div class="ui:flex ui:flex-col ui:gap-1">
      <h5>
        <i class="fa fa-circle ui:mr-1" [ngClass]="{'text-success': record.metadata.published, 'text-error': !record.metadata.published}" aria-hidden="true"></i>
        <a id="collection-link" [routerLink]="[detailUrl.link]">{{ record.metadata.title }}</a>
        @if (record.metadata.collection_id) {
          ({{ record.metadata.collection_id }})
        }
      </h5>
        @if (record.metadata.teachers) {
          <div id="collection-teacher">
            @for (teacher of record.metadata.teachers; track teacher; let last = $last) {
              {{ teacher.name }} {{ last ? '' : ', ' }}
            }
          </div>
        }
        @if (record.metadata.description) {
          <div
            id="collection-start-end-date"
            [innerHtml]="record.metadata.description | nl2br"
          ></div>
        }
        <div>
        {{ record.metadata.start_date | dateTranslate: 'mediumDate' }}
        - {{ record.metadata.end_date | dateTranslate: 'mediumDate' }}
        </div>
    </div>
  `,
    standalone: false
})
export class CollectionBriefViewComponent implements ResultItem {

  @Input() record: any;

  @Input() type: string;

  @Input()
  detailUrl: { link: string, external: boolean };
}
