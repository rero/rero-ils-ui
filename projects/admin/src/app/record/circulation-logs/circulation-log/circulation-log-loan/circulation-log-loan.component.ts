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
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'admin-circulation-log-loan',
    templateUrl: './circulation-log-loan.component.html',
    standalone: false
})
export class CirculationLogLoanComponent {

  // COMPONENT ATTRIBUTES =====================================================
  /** Operation log record */
  @Input() record: any;
  /** Is the log should be highlighted */
  @Input() isHighlight = false;
  /** Is the transaction must be separated from sibling elements */
  @Input() separator = false;

  /** Event for close dialog */
  @Output() closeDialogEvent  = new EventEmitter();

  // COMPONENT FUNCTIONS ======================================================
  /** Close dialog */
  closeDialog(): void {
    this.closeDialogEvent.emit(null);
  }
}
