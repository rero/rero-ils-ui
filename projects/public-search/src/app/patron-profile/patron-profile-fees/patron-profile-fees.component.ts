/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { Component, inject, Input, OnInit } from '@angular/core';
import { Record, RecordService } from '@rero/ng-core';
import { forkJoin } from 'rxjs';
import { PatronApiService } from '../../api/patron-api.service';
import { PatronTransactionApiService } from '../../api/patron-transaction-api.service';
import { PatronProfileMenuService } from '../patron-profile-menu.service';
import { fee, overdueFee } from './types';

@Component({
    selector: 'public-search-patron-profile-fees',
    templateUrl: './patron-profile-fees.component.html',
    standalone: false
})
export class PatronProfileFeesComponent implements OnInit {

  private patronTransactionApiService: PatronTransactionApiService = inject(PatronTransactionApiService);
  private patronProfileMenuService: PatronProfileMenuService = inject(PatronProfileMenuService);
  private patronApiService: PatronApiService = inject(PatronApiService);

  /** Total of fees */
  @Input() feesTotal: number;

  /** First call of get record */
  loaded = false;

  /** requests records */
  records = [];

  get currency() {
    return this.patronProfileMenuService.currentPatron.organisation.currency;
  }

  /** OnInit hook */
  ngOnInit(): void {
    const patronPid = this.patronProfileMenuService.currentPatron.pid;
    const queryFees = this.patronTransactionApiService.getFees(patronPid, 'open', 1, RecordService.MAX_REST_RESULTS_SIZE);
    const queryOverdue = this.patronApiService.getOverduePreviewByPatronPid(patronPid);

    forkJoin([queryFees, queryOverdue]).subscribe({
      next: ([feesResponse, overdueResponse]: [Record, overdueFee[]]) => {
        feesResponse.hits.hits.map(record => {
          if (record.metadata?.loan) {
            const result = this.records.filter((fee: fee) => record.metadata?.loan?.pid === fee.loan?.pid);
            if (result.length === 1) {
              if (record.metadata.note) {
                result[0].notes.push(record.metadata.note);
              }
              result[0].totalAmount += record.metadata.total_amount;
              result[0].transactions.push(record);
            } else {
              this.createFee(record);
            }
          } else {
            this.createFee(record);
          }
        });
        overdueResponse.map((overdue: overdueFee) => {
          const result = this.records.filter((record: fee) => record.loan?.pid === overdue.loan.pid);
          if (result.length === 1) {
            result[0].totalAmount += overdue.fees.total;
            result[0].overdue = overdue.fees.total;
          } else {
            const overdueRecord = {
              type: 'overdue',
              createdAt: new Date(),
              loan: overdue.loan,
              totalAmount: overdue.fees.total,
              overdue: overdue.fees.total
            }
            this.records.push(overdueRecord);
          }
        });
        this.records.sort((a, b) => a.createdAt - b.createdAt);
        this.loaded = true;
      }});
  }

  private createFee(record): void {
    const fee: fee = {
      type: record.metadata.type,
      notes: [],
      createdAt: new Date(record.metadata.creation_date),
      totalAmount: record.metadata.total_amount,
      transactions: [record]
    };
    if (record.metadata.note) {
      fee.notes.push(record.metadata.note);
    }
    if (record.metadata.loan) {
      fee.loan = record.metadata.loan;
    }
    this.records.push(fee);
  }
}
