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
import { HotkeysService } from '@ngneat/hotkeys';
import { TranslateService } from '@ngx-translate/core';
import { User } from '@rero/shared';
import { Subscription } from 'rxjs';
import { LoanState } from 'projects/admin/src/app/classes/loans';
import { OrganisationService } from 'projects/admin/src/app/service/organisation.service';
import { PatronService } from 'projects/admin/src/app/service/patron.service';
import { PatronTransactionService } from '../../services/patron-transaction.service';

@Component({
  selector: 'admin-main',
  templateUrl: './main.component.html'
})
export class MainComponent implements OnInit, OnDestroy {

  // COMPONENT ATTRIBUTES ====================================================
  /** shortcuts for patron tabs */
  private _shortcuts = [
    {
      keys: 'shift.1',
      group: this._translateService.instant('Patron profile shortcuts'),
      description: this._translateService.instant('Go to "circulation" tab'),
      callback: ($event) => {
        this._router.navigate(['/circulation', 'patron', this.patron.patron.barcode, 'loan']);
      }
    }, {
      keys: 'shift.2',
      group: this._translateService.instant('Patron profile shortcuts'),
      description: this._translateService.instant('Go to "pickup" tab'),
      callback: ($event) => {
        this._router.navigate(['/circulation', 'patron', this.patron.patron.barcode, 'pickup']);
      }
    }, {
      keys: 'shift.3',
      group: this._translateService.instant('Patron profile shortcuts'),
      description: this._translateService.instant('Go to "pending" tab'),
      callback: ($event) => {
        this._router.navigate(['/circulation', 'patron', this.patron.patron.barcode, 'pending']);
      }
    }, {
      keys: 'shift.4',
      group: this._translateService.instant('Patron profile shortcuts'),
      description: this._translateService.instant('Go to "patron profile" tab'),
      callback: ($event) => {
        this._router.navigate(['/circulation', 'patron', this.patron.patron.barcode, 'profile']);
      }
    }, {
      keys: 'shift.5',
      group: this._translateService.instant('Patron profile shortcuts'),
      description: this._translateService.instant('Go to "fees" tab'),
      callback: ($event) => {
        this._router.navigate(['/circulation', 'patron', this.patron.patron.barcode, 'fees']);
      }
    }, {
      keys: 'shift.6',
      group: this._translateService.instant('Patron profile shortcuts'),
      description: this._translateService.instant('Go to "history" tab'),
      callback: ($event) => {
        this._router.navigate(['/circulation', 'patron', this.patron.patron.barcode, 'history']);
      }
    }
  ];

  /** the current logged patron */
  patron: User = undefined;
  /** the total amount of all 'open' patron transactions for the current patron */
  transactionsTotalAmount = 0;

  /** Subscription to 'open' patron transactions */
  private _patronTransactionSubscription$: Subscription;
  /** Subsription to current patron */
  private _patronSubscription$: Subscription;


  // GETTER & SETTER ====================================================
  /** Get current organisation
   *  @returns current organisation
   */
  get organisation() {
    return this._organisationService.organisation;
  }

  // CONSTRUCTOR & HOOKS ====================================================
  /** Constructor
   * @param _route - ActivatedRoute
   * @param _router - Router
   * @param _patronService - PatronService
   * @param _patronTransactionService - PatronTransactionService
   * @param _organisationService - OrganisationService
   * @param _hotKeysService - HotkeysService
   * @param _translateService - TranslateService
   */
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _patronService: PatronService,
    private _patronTransactionService: PatronTransactionService,
    private _organisationService: OrganisationService,
    private _hotKeysService: HotkeysService,
    private _translateService: TranslateService
  ) { }

  /** OnInit hook */
  ngOnInit() {
    const barcode = this._route.snapshot.paramMap.get('barcode');
    this._patronSubscription$ = this._patronService.getPatron(barcode).subscribe((patron: User) => {
      if (patron) {
        this.patron = patron;
        // We need to unregister/register the shortcuts after the patron was loaded. Otherwise, the patron could be considered has
        // null and this will cause error for navigation url construction
        this._unregisterShortcuts();
        this._registerShortcuts();
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

  /** OnDestroy hook */
  ngOnDestroy() {
    this._unregisterShortcuts();
    if (this._patronTransactionSubscription$) {
      this._patronTransactionSubscription$.unsubscribe();
    }
    if (this._patronSubscription$) {
      this._patronSubscription$.unsubscribe();
    }
    this._patronService.clearPatron();
  }

  // COMPONENT FUNCTIONS ====================================================
  /** reset the patron currently viewed */
  clearPatron() {
    this._patronService.clearPatron();
    this._router.navigate(['/circulation']);
  }

  /** Register all component shortcuts on the hotkeysService */
  private _registerShortcuts() {
    for (const shortcut of this._shortcuts) {
      const callback = shortcut.callback;
      delete shortcut.callback;
      this._hotKeysService.addShortcut(shortcut).subscribe($event => callback($event));
    }
  }

  /** Unregister all component shortcuts from the hotkeysService (if they are registered) */
  private _unregisterShortcuts() {
    const registeredHotKeys = this._hotKeysService.getHotkeys().map(shortcut => shortcut.keys);
    const componentShortcuts = this._shortcuts.map(shortcut => shortcut.keys);
    const intersectionShortcuts = registeredHotKeys.filter(value => componentShortcuts.includes(value));
    if (intersectionShortcuts.length > 0) {
      this._hotKeysService.removeShortcuts(intersectionShortcuts);
    }
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

  /** Parse statistics from API into corresponding tab statistic.
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
        case LoanState[LoanState.CANCELLED]:
        case LoanState[LoanState.ITEM_IN_TRANSIT_TO_HOUSE]:
        case LoanState[LoanState.ITEM_RETURNED]:
          this.patron.incrementCirculationStatistic('history',  Number(data[key]));
          break;
      }
    }
  }
}
