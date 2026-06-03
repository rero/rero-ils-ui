/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
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
import { CirculationLogComponent } from '../circulation-log.component';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { GetRecordPipe } from '@rero/ng-core';

@Component({
    selector: 'admin-circulation-item-scan',
    templateUrl: './circulation-item-scan.component.html',
    imports: [CirculationLogComponent, Bind, Tag, TranslateDirective, AsyncPipe, TranslatePipe, GetRecordPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CirculationItemScanComponent {

  /** Operation log record */
  record = input<any>();
  /** Is the log should be highlighted */
  isHighlight = input(false);
  /** Is the transaction must be separated from sibling elements */
  separator = input(false);
}
