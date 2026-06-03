/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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

import { Component, inject, input, ChangeDetectionStrategy} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'admin-budgets-brief-view',
    template: `
    <h5>
      <i
        class="fa fa-circle ui:mr-2"
        [title]="title"
        [ngClass]="{'text-success': record().metadata.is_active, 'text-error': !record().metadata.is_active}"
      ></i>&nbsp;
      <a [routerLink]="[detailUrl().link]">{{ record().metadata.name }}</a>
    </h5>
  `,
    imports: [NgClass, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BudgetsBriefViewComponent {

  private translateService: TranslateService = inject(TranslateService);

  /** The record to display */
  record = input<any>();
  /** The record type */
  type = input<string>();
  /** The URL to the detail view of the record */
  detailUrl = input<{ link: string, external: boolean }>();

  /**
   * Status of the budget on bullet title
   * @returns string - status
   */
  get title(): string {
    return this.record().metadata.is_active
      ? this.translateService.instant('Active')
      : this.translateService.instant('Inactive');
  }
}
