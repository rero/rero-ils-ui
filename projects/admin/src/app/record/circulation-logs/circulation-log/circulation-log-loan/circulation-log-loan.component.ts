/*
 * RERO ILS UI
 * Copyright (C) 2023 RERO
 * Copyright (C) 2023 UCLouvain
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
