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
import { Subscription } from 'rxjs';
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
        this._patronService.getCirculationInformations(patron.pid).subscribe((data) => {
          this._parseStatistics(data.statistics || {});
          for (const message of (data.messages || [])) {
            this.patron.addCirculationMessage(message as any);
          }
        });
        this._patronTransactionSubscription$ = this._patronTransactionService.patronTransactionsSubject$.subscribe(
          (transactions) => {
            this.transactionsTotalAmount = this._patronTransactionService.computeTotalTransactionsAmount(transactions);
          }
        );
        this._patronTransactionService.emitPatronTransactionByPatron(patron.pid, undefined, 'open');
      }
    });
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

  /** Find and return a circulation statistic.
   * @param type: the type of circulation statistics to find.
   */
  getCirculationStatistics(type: string): number {
    return (
      this.patron
      && 'circulation_informations' in this.patron
      && 'statistics' in this.patron.circulation_informations
      && type in this.patron.circulation_informations.statistics
    ) ? this.patron.circulation_informations.statistics[type]
      : 0;
  }

  /**
   * Parse statistics from API into corresponding tab statistic.
   * @param data: a dictionary of loan state/value
   */
  private _parseStatistics(data: any) {
    for (const key of Object.keys(data)) {
      switch (key) {
        case LoanState[LoanState.PENDING]:
        case LoanState[LoanState.ITEM_IN_TRANSIT_FOR_PICKUP]:
          this.patron.incrementCirculationStatistic('pending', Number(data[key]));
          break;
        case LoanState[LoanState.ITEM_AT_DESK]:
          this.patron.incrementCirculationStatistic('pickup',  Number(data[key]));
          break;
        case LoanState[LoanState.ITEM_ON_LOAN]:
          this.patron.incrementCirculationStatistic('loans',  Number(data[key]));
          break;
      }
    }
  }
}
