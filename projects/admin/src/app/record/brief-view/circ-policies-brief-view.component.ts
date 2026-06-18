// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { TranslatePipe } from '@ngx-translate/core';
import { Nl2brPipe } from '@rero/ng-core';

@Component({
    selector: 'admin-circ-policies-brief-view',
    template: `
  <h5>
    <div class="ui:flex ui:gap-2">
      <a [routerLink]="[detailUrl().link]">{{ record().metadata.name }}</a>
      <p-tag class="ui:align-bottom" severity="secondary">
        @if (record().metadata.policy_library_level) {
          {{ 'Library' | translate }}
        } @else {
          {{ 'Organisation' | translate }}
        }
      </p-tag>
    </div>
  </h5>
  @if (record().metadata.description) {
    <span [innerHtml]="record().metadata.description | nl2br"></span>
  }
  `,
    imports: [RouterLink, Bind, Tag, TranslatePipe, Nl2brPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircPoliciesBriefViewComponent {

  record = input<any>();

  type = input<string>();

  detailUrl = input<{ link: string, external: boolean }>();
}
