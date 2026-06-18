// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
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
