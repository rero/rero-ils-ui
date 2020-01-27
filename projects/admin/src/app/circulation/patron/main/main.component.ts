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

import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PatronService } from '../../../service/patron.service';
import { PatronTransactionService } from '../../patron-transaction.service';
import { Observable, Subscription } from 'rxjs';
import { OrganisationService } from '../../../service/organisation.service';
import { User } from '../../../class/user';

@Component({
  selector: 'admin-main',
  templateUrl: './main.component.html'
})
export class MainComponent implements OnInit, OnDestroy {

  /** current patron as observable */
  patron$: Observable<User>;

  /** the total amount of all 'open' patron transactions for the current patron */
  transactionsTotalAmount = 0;

  /** Subscription to 'open' patron transactions */
  patronTransactionSubscription$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patronService: PatronService,
    private patronTransactionService: PatronTransactionService,
    private organisationService: OrganisationService) { }

  ngOnInit() {
    const barcode = this.route.snapshot.paramMap.get('barcode');
    this.patron$ = this.patronService.getPatron(barcode);
    this.patron$.subscribe((patron) => {
      if (patron) {
        this.patronTransactionSubscription$ = this.patronTransactionService.patronTransactionsSubject$.subscribe(
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
    if (this.patronTransactionSubscription$) {
      this.patronTransactionSubscription$.unsubscribe();
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
