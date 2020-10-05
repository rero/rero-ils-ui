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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patronService: PatronService,
    private patronTransactionService: PatronTransactionService,
    private organisationService: OrganisationService) { }

  ngOnInit() {
    const barcode = this.route.snapshot.paramMap.get('barcode');
    this._patronSubscription$ = this.patronService.getPatron(barcode).subscribe((patron) => {
      if (patron) {
        this.patron = patron;
        this._patronTransactionSubscription$ = this.patronTransactionService.patronTransactionsSubject$.subscribe(
          (transactions) => {
            this.transactionsTotalAmount = this.patronTransactionService.computeTotalTransactionsAmount(transactions);
          }
        );
        this.patronTransactionService.emitPatronTransactionByPatron(patron.pid, undefined, 'open');
      }
    });
  }

  clearPatron() {
    this.patronService.clearPatron();
    this.router.navigate(['/circulation']);
  }

  ngOnDestroy() {
    if (this._patronTransactionSubscription$) {
      this._patronTransactionSubscription$.unsubscribe();
    }
    if (this._patronSubscription$) {
      this._patronSubscription$.unsubscribe();
    }
    this.patronService.clearPatron();
  }

  /** Get current organisation
   *  @return: current organisation
   */
  get organisation() {
    return this.organisationService.organisation;
  }
}
