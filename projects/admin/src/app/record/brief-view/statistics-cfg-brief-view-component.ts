/*
 * RERO ILS UI
 * Copyright (C) 2023-2024 RERO
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
import { Component, inject, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ResultItem } from '@rero/ng-core';

@Component({
  selector: 'admin-statistics-cfg-brief-view',
  template: `
  <h5 class="mb-0 card-title">
    <i
      class="fa fa-circle mr-2"
      [title]="activeLabel"
      [ngClass]="{'text-success': record.metadata.is_active, 'text-danger': !record.metadata.is_active}"
    ></i>
  <a [routerLink]="[detailUrl.link]">{{ record.metadata.name }}</a></h5>
  <div class="card-text">
    @if (record.metadata.description) {
      <div [innerHTML]="record.metadata.description | truncateText: 30"></div>
    }
    <div>
      <b translate>Category</b>: {{ record.metadata.category.type | translate }}
    </div>
    <div>
      <b translate>Indicator</b>: {{ record.metadata.category.indicator.type | translate }}
    </div>
  </div>
  `
  })
export class StatisticsCfgBriefViewComponent implements ResultItem {

  private translateService: TranslateService = inject(TranslateService);

  /** Record data */
  @Input() record: any;

  /** Resource type */
  @Input() type: string;

  /** Detail URL to navigate to detail view */
  @Input() detailUrl: { link: string, external: boolean };

  /**
   * Status of the configuration on bullet title
   * @returns string - status
   */
    get activeLabel() {
      return this.record.metadata.is_active
        ? this.translateService.instant('Active')
        : this.translateService.instant('Inactive');
    }
}
