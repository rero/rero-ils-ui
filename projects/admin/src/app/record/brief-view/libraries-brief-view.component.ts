/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { ResultItem  } from '@rero/ng-core';

@Component({
  selector: 'admin-libraries-brief-view',
  template: `
  <h5 class="mb-0 card-title">
    <a [routerLink]="[detailUrl.link]">{{ record.metadata.name }}</a>
  </h5>
  <div class="card-text">
    <small> {{ record.metadata.code }}</small>
    @if (record.metadata.description) {
      {{ record.metadata.description }}
    }
  </div>
  `,
})
export class LibrariesBriefViewComponent implements ResultItem {

  /** Record data */
  @Input() record: any;

  /** Resource type */
  @Input() type: string;

  /** Detail URL to navigate to detail view */
  @Input() detailUrl: { link: string, external: boolean };
}
