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
