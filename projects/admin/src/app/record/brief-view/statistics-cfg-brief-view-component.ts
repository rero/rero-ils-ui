// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { NgClass } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TruncateTextPipe } from '@rero/ng-core';

@Component({
  selector: 'admin-statistics-cfg-brief-view',
  template: `
    <h5>
      <i
        class="fa-solid fa-circle"
        [title]="activeLabel"
        [ngClass]="{ 'text-success': record().metadata.is_active, 'text-error': !record().metadata.is_active }"></i
      >&nbsp;<a [routerLink]="[detailUrl().link]">{{ record().metadata.name }}</a>
    </h5>
    <div>
      @if (record().metadata.description) {
        <div [innerHTML]="record().metadata.description | truncateText: 30"></div>
      }
      <dl class="metadata">
        <dt>{{ 'Category' | translate }}</dt>
        <dd>{{ record().metadata.category.type | translate }}</dd>

        <dt>{{ 'Indicator' | translate }}</dt>
        <dd>{{ record().metadata.category.indicator.type | translate }}</dd>
      </dl>
    </div>
  `,
  imports: [NgClass, RouterLink, TruncateTextPipe, TranslatePipe],
})
export class StatisticsCfgBriefViewComponent {
  private translateService: TranslateService = inject(TranslateService);

  /** Record data */
  record = input<any>();

  /** Resource type */
  type = input<string>();

  /** Detail URL to navigate to detail view */
  detailUrl = input<{ link: string; external: boolean }>();

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
