/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { LoanState } from '../../../class/items';
import { User } from '../../../class/user';
import { OrganisationService } from '../../../service/organisation.service';
import { PatronService } from '../../../service/patron.service';
import { PatronTransactionService } from '../../patron-transaction.service';

@Component({
  selector: 'admin-main',
  templateUrl: './main.component.html'
})
export class MainComponent implements OnInit, OnDestroy {

  patron: User = undefined;

  /** circulation statistics about a patron */
  patronCirculationStatistics = {
    loans: 0,
    pickup: 0,
    pending: 0,
  };

  /** current patron as observable */
  patron$: Observable<User>;

  /** the total amount of all 'open' patron transactions for the current patron */
  transactionsTotalAmount = 0;

  /** Subscription to 'open' patron transactions */
  private _patronTransactionSubscription$: Subscription;

  /** Subsription to current patron */
  private _patronSubscription$: Subscription;

  /** Constructor
   * @param _route - ActivatedRoute
   * @param _router - Router
   * @param _patronService - PatronService
   * @param _patronTransactionService - PatronTransactionService
   * @param _organisationService - OrganisationService
   */
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _patronService: PatronService,
    private _patronTransactionService: PatronTransactionService,
    private _organisationService: OrganisationService) { }

  ngOnInit() {
    const barcode = this._route.snapshot.paramMap.get('barcode');
    this._patronSubscription$ = this._patronService.getPatron(barcode).subscribe((patron) => {
      if (patron) {
        this.patron = patron;
        this._patronService.getCirculationStats(patron.pid).subscribe((stats) => this._parseStatistics(stats));
        this._patronTransactionSubscription$ = this._patronTransactionService.patronTransactionsSubject$.subscribe(
          (transactions) => {
            this.transactionsTotalAmount = this._patronTransactionService.computeTotalTransactionsAmount(transactions);
          }
        );
        this._patronTransactionService.emitPatronTransactionByPatron(patron.pid, undefined, 'open');
      }
    });
  }

  /** Parse statistics from API into corresponding tab statistic.
   *
   * @param statistics: a dictionary of loan state/value
   */
  private _parseStatistics(statistics: any) {
    // reset the known stats
    for (const key of Object.keys(this.patronCirculationStatistics)) {
      this.patronCirculationStatistics[key] = 0;
    }
    // parse the stats
    for (const key of Object.keys(statistics)) {
      switch (key) {
        case LoanState[LoanState.PENDING]:
        case LoanState[LoanState.ITEM_IN_TRANSIT_FOR_PICKUP]:
          this.patronCirculationStatistics.pending += statistics[key];
          break;
        case LoanState[LoanState.ITEM_AT_DESK]:
          this.patronCirculationStatistics.pickup += statistics[key];
          break;
        case LoanState[LoanState.ITEM_ON_LOAN]:
          this.patronCirculationStatistics.loans += statistics[key];
          break;
      }
    }
  }

  clearPatron() {
    this._patronService.clearPatron();
    this._router.navigate(['/circulation']);
  }

  ngOnDestroy() {
    if (this._patronTransactionSubscription$) {
      this._patronTransactionSubscription$.unsubscribe();
    }
    if (this._patronSubscription$) {
      this._patronSubscription$.unsubscribe();
    }
    this._patronService.clearPatron();
  }

  /** Get current organisation
   *  @return: current organisation
   */
  get organisation() {
    return this._organisationService.organisation;
  }
}
