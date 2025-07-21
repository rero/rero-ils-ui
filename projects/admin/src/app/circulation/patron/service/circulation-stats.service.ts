/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
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
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Loan, LoanOverduePreview, LoanState } from '@app/admin/classes/loans';
import { PatronTransaction } from '@app/admin/classes/patron-transaction';
import { PatronService } from '@app/admin/service/patron.service';
import { getSeverity } from '@app/admin/utils/utils';
import { map, Observable, switchMap, tap } from 'rxjs';
import { PatronTransactionService } from '../../services/patron-transaction.service';

@Injectable({
  providedIn: 'root'
})
export class CirculationStatsService {

  private patronService: PatronService = inject(PatronService);
  private patronTransactionService: PatronTransactionService = inject(PatronTransactionService);


  statistics: WritableSignal<{[key: string]: number}> = signal({
    feesEngaged: 0,
    fees: 0,
    overdueFees: 0,
    pending: 0,
    pickup: 0,
    loan: 0,
    ill: 0
  });
  messages: WritableSignal<{severity: string, detail: string}[]> = signal([]);
  overdueTransactions: WritableSignal<{fees: LoanOverduePreview, loan: Loan}[]> = signal([]);
  engagedTransactions: WritableSignal<PatronTransaction[]> = signal([]);

  updateStats(patronPid: string): void {
    this.getStats(patronPid).subscribe();
  }

  updateFees(patronPid: string): Observable<any>{
            // load overdue transactions
    return this.patronService.getOverduePreview(patronPid).pipe(
      // compute the total of the overdue transactions
      tap((overdues) => {
          let fees = 0;
          overdues.map((fee: any) => {
            fees += fee.fees.total;
          });
          this.setOverdueFees(fees, overdues);
      }),
      // get engaged fees patron transactions
      tap(() => this.patronTransactionService.emitPatronTransactionByPatron(patronPid, undefined, 'open')),
      // subscribe to the engaged patron transactions
      switchMap(() => this.patronTransactionService.patronTransactionsSubject$),
      // set engaged fees in the shared service
      tap((transactions) =>
        this.setFeesEngaged(this.patronTransactionService.computeTotalTransactionsAmount(transactions), transactions)
      )
    );
  }

  setOverdueFees(overdueFees: number, transactions:{fees: LoanOverduePreview, loan: Loan}[]): void {
    this.overdueTransactions.set(transactions);
    const data = this.statistics();
    this.statistics.set({...data, ...{overdueFees, fees: overdueFees + data.feesEngaged } });
  }

  setFeesEngaged(feesEngaged: number, transactions: PatronTransaction[]): void {
    this.engagedTransactions.set(transactions);
    const data = this.statistics();
    this.statistics.set({...data, ...{feesEngaged, fees: data.overdueFees + feesEngaged}});
  }

  getStats(patronPid: string): Observable<any> {
    return this.patronService.getCirculationInformations(patronPid).pipe(
      map((result: any[]) => this.processStats(result))
    );
  }

  clearMessages(): void {
    this.messages.set([]);
  }

  private processStats(circulations: any): void {

    // Count on tabs
    const stats = circulations.statistics;
    const data = {
      pending: 0,
      pickup: 0,
      loan: 0,
      ill: 0,
    };
    Object.keys(stats).forEach((key: string) => {
      switch (key) {
        case LoanState[LoanState.PENDING]:
        case LoanState[LoanState.ITEM_IN_TRANSIT_FOR_PICKUP]:
          data.pending += Number(stats[key]);
          break;
        case LoanState[LoanState.ITEM_AT_DESK]:
          data.pickup = Number(stats[key]);
          break;
        case LoanState[LoanState.ITEM_ON_LOAN]:
          data.loan = Number(stats[key]);
          break;
        case 'ill_requests':
          data.ill = Number(stats[key]);
          break;
      }
    });

    this.statistics.set({...this.statistics(), ...data});

    // Messages
    this.clearMessages();
    circulations.messages.map((message: any) => {
      this.messages.set([...this.messages(), {
        severity: getSeverity(message.type),
        detail: message.content
      }]);
    });
  }
}
