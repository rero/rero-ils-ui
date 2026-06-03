/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { TranslateDirective } from '@ngx-translate/core';
import { Nl2brPipe } from '@rero/ng-core';

@Component({
    selector: 'admin-holding-shared-view',
    templateUrl: './holding-shared-view.component.html',
    styles: ['dl.metadata > dd { font-weight: normal; }'],
    imports: [TranslateDirective, Nl2brPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HoldingSharedViewComponent {

  /** the holding record */
  holding = input<any>();
}
