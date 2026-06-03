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

import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { NgClass, AsyncPipe } from '@angular/common';
import { CollectionItemsComponent } from './collection-items/collection-items.component';
import { DateTranslatePipe, GetRecordPipe, Nl2brPipe } from '@rero/ng-core';


@Component({
    selector: 'admin-collection-detail-view',
    templateUrl: './collection-detail-view.component.html',
    imports: [Bind, Tag, TranslateDirective, NgClass, CollectionItemsComponent, AsyncPipe, TranslatePipe, DateTranslatePipe, GetRecordPipe, Nl2brPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionDetailViewComponent {

  readonly record = input<any>();
  readonly type = input<string>('');
}
