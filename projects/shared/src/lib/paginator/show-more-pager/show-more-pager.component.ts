/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { Paginator } from '../paginator';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'shared-search-show-more-pager',
    templateUrl: './show-more-pager.component.html',
    imports: [Bind, Button, TranslateDirective, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowMorePagerComponent {

  /** Records paginator */
  readonly paginator = input<Paginator>();

  /** Show more button id */
  readonly id = input<string>();
}
