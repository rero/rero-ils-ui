/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
 * Copyright (C) 2021 UCLouvain
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
  selector: 'admin-budgets-brief-view',
  template: `
  <h5 class="mb-0">
    <i
      class="fa fa-circle mr-2"
      [title]="title"
      [ngClass]="{'text-success': record.metadata.is_active, 'text-danger': !record.metadata.is_active}"
    ></i>
    <a [routerLink]="[detailUrl.link]" class="pr-1">{{ record.metadata.name }}</a>
  </h5>
  `,
  styles: []
})
export class BudgetsBriefViewComponent implements ResultItem {

  private translateService: TranslateService = inject(TranslateService);

  /** The record to display */
  @Input() record: any;
  /** The record type */
  @Input() type: string;
  /** The URL to the detail view of the record */
  @Input() detailUrl: { link: string, external: boolean };

  /**
   * Status of the budget on bullet title
   * @returns string - status
   */
  get title(): string {
    return this.record.metadata.is_active
      ? this.translateService.instant('Active')
      : this.translateService.instant('Inactive');
  }
}
