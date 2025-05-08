/*
 * RERO ILS UI
 * Copyright (C) 2020-2025 RERO
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
import { CirculationStatsService } from '../service/circulation-stats.service';

@Component({
    selector: 'admin-pending',
    templateUrl: './pending.component.html',
    standalone: false
})
export class PendingComponent implements OnInit {

  private patronService: PatronService = inject(PatronService);
  private circulationStatsService: CirculationStatsService = inject(CirculationStatsService);

  /** Array of loans */
  loans: [];

  private patron: any;

  /**
   * Init
   */
  ngOnInit() {
    this.patronService.currentPatron$.subscribe((patron: any) => {
      this.patron = patron;
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
    this.circulationStatsService.updateStats(this.patron.pid);
  }
}
