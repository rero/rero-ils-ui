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

import { Component, inject, OnInit } from '@angular/core';
import { PatronService } from '../../../service/patron.service';
import { CirculationService } from '../../services/circulation.service';

@Component({
  selector: 'admin-pending',
  templateUrl: './pending.component.html'
})
export class PendingComponent implements OnInit {

  private patronService: PatronService = inject(PatronService);
  private circulationService: CirculationService = inject(CirculationService);

  /** Array of loans */
  loans: [];

  /**
   * Init
   */
  ngOnInit() {
    this.patronService.currentPatron$.subscribe((patron: any) => {
      if (patron) {
        this.patronService.getItemsRequested(patron.pid)
        .subscribe(loans => {
          this.loans = loans;
        });
      }
    });
  }

  /**
   * Remove the canceled request on the loans list.
   * @param loanId, the canceled loan id
   */
  cancelRequest(loanId: any): void {
    // Remove loan in list
    const index = this.loans.findIndex((element: any) => element.id == loanId);
    this.loans.splice(index, 1);
    // Update count on tab
    this.circulationService.circulationInformations.statistics['pending'] -= 1;
  }
}
