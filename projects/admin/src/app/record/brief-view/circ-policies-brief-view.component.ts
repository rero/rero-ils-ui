/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
