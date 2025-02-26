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

@Component({
    selector: 'admin-templates-brief-view',
    template: `
  <h5>
    <a [routerLink]="[detailUrl.link]">{{ record.metadata.name }} </a>
    @if (record.metadata.visibility === 'private') {
      <small>
        <i class="fa fa-lock text-muted-color" aria-hidden="true"></i>
      </small>
    }
  </h5>
    <ul class="list-none">
      @if (record.metadata.description) {
        <li>
          {{ record.metadata.description | truncateText: 8 }}
        </li>
      }
      @if ($any(record.metadata.creator.pid | getRecord: 'patrons' | async); as creator) {
        <li>
          {{ creator.metadata.first_name }} {{ creator.metadata.last_name }}
        </li>
      }
      @if (record.metadata.template_type) {
        <li translate>
          {{ record.metadata.template_type }}
        </li>
      }
    </ul>
  `,
    standalone: false
})
export class TemplatesBriefViewComponent {

  /** Record data */
  @Input() record: any;

  /** Resource type */
  @Input() type: string;

  /** Detail URL to navigate to detail view */
  @Input() detailUrl: { link: string, external: boolean };
}
