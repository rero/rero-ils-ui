// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { TransactionStatusPipe } from '@app/admin/pipe/transaction-status.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Tag } from '@openng/optimus-ui/tag';
import { GetRecordPipe } from '@rero/ng-core';

import { CirculationLogComponent } from '../circulation-log.component';

@Component({
  selector: 'admin-circulation-item-scan',
  templateUrl: './circulation-item-scan.component.html',
  imports: [AsyncPipe, Bind, CirculationLogComponent, GetRecordPipe, Tag, TransactionStatusPipe, TranslatePipe],
})
export class CirculationItemScanComponent {
  /** Operation log record */
  record = input<any>();
  /** Is the log should be highlighted */
  isHighlight = input(false);
  /** Is the transaction must be separated from sibling elements */
  separator = input(false);
}
