// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input, output, ChangeDetectionStrategy} from '@angular/core';
import { CirculationLogComponent } from '../circulation-log.component';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { GetRecordPipe } from '@rero/ng-core';

@Component({
    selector: 'admin-circulation-log-loan',
    templateUrl: './circulation-log-loan.component.html',
    imports: [CirculationLogComponent, Bind, Tag, RouterLink, AsyncPipe, TranslatePipe, GetRecordPipe],
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
