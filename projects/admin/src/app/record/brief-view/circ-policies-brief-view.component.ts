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
import { ResultItem } from '@rero/ng-core';

@Component({
    selector: 'admin-circ-policies-brief-view',
    template: `
  <h5>
    <div class="ui:flex ui:gap-2">
      <a [routerLink]="[detailUrl.link]">{{ record.metadata.name }}</a>
      <p-tag class="ui:align-bottom" severity="secondary">
        @if (record.metadata.policy_library_level) {
          {{ 'Library' | translate }}
        } @else {
          {{ 'Organisation' | translate }}
        }
      </p-tag>
    </div>
  </h5>
  @if (record.metadata.description) {
    <span [innerHtml]="record.metadata.description | nl2br"></span>
  }
  `,
    standalone: false
})
export class CircPoliciesBriefViewComponent implements ResultItem {

  @Input() record: any;

  @Input() type: string;

  @Input() detailUrl: { link: string, external: boolean };
}
