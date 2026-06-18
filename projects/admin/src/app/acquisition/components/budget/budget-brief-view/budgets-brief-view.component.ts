// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

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
