// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'admin-patron-types-brief-view',
  template: `
    <h5>
      <a [routerLink]="[detailUrl().link]">{{ record().metadata.name }}</a>
    </h5>
    @if (record().metadata.description) {
      {{ record().metadata.description }}
    }
  `,
  styles: [],
  imports: [RouterLink],
})
export class PatronTypesBriefViewComponent {
  record = input<any>();

  type = input<string>();

  detailUrl = input<{ link: string; external: boolean }>();
}
