// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { AsyncPipe } from '@angular/common';
import { Component, input, output, ChangeDetectionStrategy} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TransactionStatusPipe } from '@app/admin/pipe/transaction-status.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { GetRecordPipe } from '@rero/ng-core';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { CirculationLogComponent } from '../circulation-log.component';

@Component({
    selector: 'admin-circulation-log-loan',
    templateUrl: './circulation-log-loan.component.html',
    imports: [AsyncPipe, Bind, CirculationLogComponent, GetRecordPipe, RouterLink, Tag, TransactionStatusPipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CirculationLogLoanComponent {

  // COMPONENT ATTRIBUTES =====================================================
  /** Operation log record */
  record = input<any>();
  /** Is the log should be highlighted */
  isHighlight = input(false);
  /** Is the transaction must be separated from sibling elements */
  separator = input(false);

  /** Event for close dialog */
  closeDialogEvent = output();

  // COMPONENT FUNCTIONS ======================================================
  /** Close dialog */
  closeDialog(): void {
    this.closeDialogEvent.emit();
  }
}
