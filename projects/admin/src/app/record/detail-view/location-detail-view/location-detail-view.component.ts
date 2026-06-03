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

import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { NgClass, NgStyle, AsyncPipe } from '@angular/common';
import { GetRecordPipe } from '@rero/ng-core';

@Component({
    selector: 'admin-location-detail-view',
    templateUrl: './location-detail-view.component.html',
    imports: [TranslateDirective, NgClass, NgStyle, AsyncPipe, TranslatePipe, GetRecordPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationDetailViewComponent {

  readonly record = input<any>();
  readonly type = input<string>('');
}
