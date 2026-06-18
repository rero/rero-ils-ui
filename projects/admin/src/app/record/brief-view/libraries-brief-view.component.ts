// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'admin-libraries-brief-view',
    template: `
  <h5>
    <a [routerLink]="[detailUrl().link]">{{ record().metadata.name }}</a>
  </h5>
  <small> {{ record().metadata.code }}</small>
  `,
    imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibrariesBriefViewComponent {

  /** Record data */
  record = input<any>();

  /** Resource type */
  type = input<string>();

  /** Detail URL to navigate to detail view */
  detailUrl = input<{ link: string, external: boolean }>();
}
