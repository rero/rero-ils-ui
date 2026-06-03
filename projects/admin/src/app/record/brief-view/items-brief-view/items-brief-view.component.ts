/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
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
import { TranslateDirective } from '@ngx-translate/core';
import { InheritedCallNumberComponent, ItemHoldingsCallNumberPipe } from '@rero/shared';
import { AsyncPipe, JsonPipe } from '@angular/common';


@Component({
    selector: 'admin-inventory-brief-view',
    templateUrl: './items-brief-view.component.html',
    imports: [RouterLink, TranslateDirective, InheritedCallNumberComponent, AsyncPipe, JsonPipe, ItemHoldingsCallNumberPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsBriefViewComponent {

  /** Record */
  record = input<any>();

  /** Type of record */
  type = input<string>();

  /** Detail Url */
  detailUrl = input<{ link: string, external: boolean }>();
}
