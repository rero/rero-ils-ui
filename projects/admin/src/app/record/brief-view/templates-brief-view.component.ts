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

@Component({
  selector: 'admin-templates-brief-view',
  template: `
  <h5 class="mb-0 card-title">
    <a [routerLink]="[detailUrl.link]">{{ record.metadata.name }} </a>
    <small *ngIf="record.metadata.visibility && record.metadata.visibility === 'private'">
      <i class="fa fa-lock text-secondary" aria-hidden="true"></i>
    </small>
  </h5>
  <div class="card-text">
    <ul class="list-inline mb-0">
      <li *ngIf="record.metadata.description">
        {{ record.metadata.description | truncateText: 8 }}
      </li>
      <li *ngIf="record.metadata.creator.pid | getRecord: 'patrons' | async as creator">
        {{ creator.metadata.first_name }} {{ creator.metadata.last_name }}
      </li>
      <li *ngIf="record.metadata.template_type" translate>
        {{ record.metadata.template_type }}
      </li>
    </ul>
  </div>
  `
  })
export class TemplatesBriefViewComponent {

  /** Record data */
  @Input()
  record: any;

  /** Detail URL to navigate to detail view */
  @Input()
  detailUrl: { link: string, external: boolean };
}
