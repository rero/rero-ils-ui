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
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CirculationStatsService {

  private patronService: PatronService = inject(PatronService);

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
    circulations.messages.map((message: any) => {
      this.messages.set([...this.messages(), {
        severity: getSeverity(message.type),
        detail: message.content
      }]);
    });
  }
}
