// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Button } from '@openng/optimus-ui/button';
import { Tooltip } from '@openng/optimus-ui/tooltip';
import { GetRecordPipe, Nl2brPipe } from '@rero/ng-core';
import { AvailabilityComponent, InheritedCallNumberComponent, IssueItemStatus } from '@rero/shared';

import { ItemInCollectionPipe } from '../../../../../pipe/item-in-collection.pipe';
import { RecordMaskedComponent } from '../../../record-masked/record-masked.component';
import { DefaultHoldingItemComponent } from '../default-holding-item/default-holding-item.component';
import { HoldingItemNoteComponent } from '../holding-item-note/holding-item-note.component';
import { HoldingItemTemporaryItemTypeComponent } from '../holding-item-temporary-item-type/holding-item-temporary-item-type.component';

@Component({
  selector: 'admin-serial-holding-item',
  templateUrl: './serial-holding-item.component.html',
  imports: [
    RecordMaskedComponent,
    RouterLink,
    AvailabilityComponent,
    InheritedCallNumberComponent,
    Bind,
    Button,
    Tooltip,
    HoldingItemNoteComponent,
    HoldingItemTemporaryItemTypeComponent,
    AsyncPipe,
    TranslatePipe,
    GetRecordPipe,
    Nl2brPipe,
    ItemInCollectionPipe,
  ],
})
export class SerialHoldingItemComponent extends DefaultHoldingItemComponent {
  /** reference to ItemIssueStatus */
  itemIssueStatus = IssueItemStatus;
}
