/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { Component, ChangeDetectionStrategy} from '@angular/core';
import { IssueItemStatus, AvailabilityComponent, InheritedCallNumberComponent } from '@rero/shared';
import { DefaultHoldingItemComponent } from '../default-holding-item/default-holding-item.component';
import { RecordMaskedComponent } from '../../../record-masked/record-masked.component';
import { RouterLink } from '@angular/router';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { HoldingItemNoteComponent } from '../holding-item-note/holding-item-note.component';
import { HoldingItemTemporaryItemTypeComponent } from '../holding-item-temporary-item-type/holding-item-temporary-item-type.component';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { GetRecordPipe, Nl2brPipe } from '@rero/ng-core';
import { ItemInCollectionPipe } from '../../../../../pipe/item-in-collection.pipe';

@Component({
    selector: 'admin-serial-holding-item',
    templateUrl: './serial-holding-item.component.html',
    imports: [RecordMaskedComponent, RouterLink, AvailabilityComponent, InheritedCallNumberComponent, Bind, Button, Tooltip, HoldingItemNoteComponent, HoldingItemTemporaryItemTypeComponent, TranslateDirective, AsyncPipe, TranslatePipe, GetRecordPipe, Nl2brPipe, ItemInCollectionPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SerialHoldingItemComponent extends DefaultHoldingItemComponent {

  /** reference to ItemIssueStatus */
  itemIssueStatus = IssueItemStatus;
}
