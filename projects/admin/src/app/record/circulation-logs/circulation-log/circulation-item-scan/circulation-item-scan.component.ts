// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { AsyncPipe } from '@angular/common';
import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { TransactionStatusPipe } from '@app/admin/pipe/transaction-status.pipe';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { GetRecordPipe } from '@rero/ng-core';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { CirculationLogComponent } from '../circulation-log.component';

@Component({
    selector: 'admin-circulation-item-scan',
    templateUrl: './circulation-item-scan.component.html',
    imports: [AsyncPipe, Bind, CirculationLogComponent, GetRecordPipe, Tag, TransactionStatusPipe, TranslateDirective, TranslatePipe],
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
