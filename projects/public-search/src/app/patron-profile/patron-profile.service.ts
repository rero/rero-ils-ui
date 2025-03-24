/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatronProfileService {

  /** Tabs event */
  private tabsEvent = new Subject<ITabEvent>();

  /** Cancel event */
  private cancelRequestEvent = new Subject<string>();

  /** Fees event */
  private loanFeesEvent = new Subject<number>();

  private loanFeesTotal: number = 0;

  /** Get tab event observable */
  get tabsEvent$(): Observable<ITabEvent> {
    return this.tabsEvent.asObservable();
  }

  /** Change tab */
  changeTab(tab: ITabEvent): void {
    this.tabsEvent.next(tab);
  }

  /** Cancel Request event observable */
  get cancelRequestEvent$(): Subject<string> {
    return this.cancelRequestEvent;
  }

  /** @returns Observable of the loan fees event */
  get loanFeesEvent$(): Observable<number> {
    return this.loanFeesEvent.asObservable();
  }

  /** Cancel request */
  cancelRequest(loanPid: string): void {
    this.cancelRequestEvent.next(loanPid);
  }

  /** Emit the loan fees */
  loanFees(fees: number): void {
    this.loanFeesTotal += fees;
    this.loanFeesEvent.next(this.loanFeesTotal);
  }

  resetLoanFeesTotal(): void {
    this.loanFeesTotal = 0;
  }
}

/** Tab event interface */
export interface ITabEvent {
  name: string;
  count: number;
}
