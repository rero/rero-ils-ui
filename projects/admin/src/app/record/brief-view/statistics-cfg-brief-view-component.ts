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
import { Component, inject, input, ChangeDetectionStrategy} from '@angular/core';
import { TranslateService, TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TruncateTextPipe } from '@rero/ng-core';


@Component({
    selector: 'admin-statistics-cfg-brief-view',
    template: `
  <h5>
    <i
      class="fa fa-circle"
      [title]="activeLabel"
      [ngClass]="{'text-success': record().metadata.is_active, 'text-error': !record().metadata.is_active}"
    ></i>&nbsp;<a [routerLink]="[detailUrl().link]">{{ record().metadata.name }}</a>
  </h5>
  <div>
    @if (record().metadata.description) {
      <div [innerHTML]="record().metadata.description | truncateText: 30"></div>
    }
    <dl class="metadata">
      <dt translate>Category</dt>
      <dd>{{ record().metadata.category.type | translate }}</dd>

      <dt translate>Indicator</dt>
      <dd>{{ record().metadata.category.indicator.type | translate }}</dd>
    </dl>
  </div>
  `,
    imports: [NgClass, RouterLink, TranslateDirective, TruncateTextPipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsCfgBriefViewComponent {

  private translateService: TranslateService = inject(TranslateService);

  /** Record data */
  record = input<any>();

  /** Resource type */
  type = input<string>();

  /** Detail URL to navigate to detail view */
  detailUrl = input<{ link: string, external: boolean }>();

  /**
   * Status of the configuration on bullet title
   * @returns string - status
   */
    get activeLabel() {
      return this.record().metadata.is_active
        ? this.translateService.instant('Active')
        : this.translateService.instant('Inactive');
    }
}
