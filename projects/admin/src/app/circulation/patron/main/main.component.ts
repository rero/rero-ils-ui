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
import { Subscription } from 'rxjs';
import { LoanState } from 'projects/admin/src/app/classes/loans';
import { OrganisationService } from 'projects/admin/src/app/service/organisation.service';
import { PatronService } from 'projects/admin/src/app/service/patron.service';
import { PatronTransactionService } from '../../services/patron-transaction.service';
import { CirculationService } from '../../services/circulation.service';
import { RecordService } from '@rero/ng-core';
import { OperationLogsApiService } from '../../../api/operation-logs-api.service';

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
        this._router.navigate(['/circulation', 'patron', this._patronBarcode, 'loan']);
      }
    }, {
      keys: 'shift.2',
      group: this._translateService.instant('Patron profile shortcuts'),
      description: this._translateService.instant('Go to "pickup" tab'),
      callback: ($event) => {
        this._router.navigate(['/circulation', 'patron', this._patronBarcode, 'pickup']);
      }
    }, {
      keys: 'shift.3',
      group: this._translateService.instant('Patron profile shortcuts'),
      description: this._translateService.instant('Go to "pending" tab'),
      callback: ($event) => {
        this._router.navigate(['/circulation', 'patron', this._patronBarcode, 'pending']);
      }
    }, {
      keys: 'shift.4',
      group: this._translateService.instant('Patron profile shortcuts'),
      description: this._translateService.instant('Go to "patron profile" tab'),
      callback: ($event) => {
        this._router.navigate(['/circulation', 'patron', this._patronBarcode, 'profile']);
      }
    }, {
      keys: 'shift.5',
      group: this._translateService.instant('Patron profile shortcuts'),
      description: this._translateService.instant('Go to "fees" tab'),
      callback: ($event) => {
        this._router.navigate(['/circulation', 'patron', this._patronBarcode, 'fees']);
      }
    }, {
      keys: 'shift.6',
      group: this._translateService.instant('Patron profile shortcuts'),
      description: this._translateService.instant('Go to "history" tab'),
      callback: ($event) => {
        this._router.navigate(['/circulation', 'patron', this._patronBarcode, 'history']);
      }
    }
  ];

  /** the current logged patron */
  patron: any = undefined;

  /** the current patron barcode */
  _patronBarcode: string;

  /** the total amount of all fees related to the current patron */
  feesTotalAmount = 0;

  /** Subscription to current patron */
  private _patronSubscription$: Subscription;

  /** Subscription to the fees accounting operation subject (allowing to know if some fees are paid, deleted, ...) */
  private _patronFeesOperationSubscription$: Subscription;

  historyCount = 0;


  // GETTER & SETTER ====================================================
  /**
   * Get current organisation
   * @return current organisation
   */
  get organisation() {
    return this._organisationService.organisation;
  }

  /**
   * Get barcode for current patron
   * @return string, barcode
   */
  get barcode() {
    return this._patronBarcode;
  }

  // CONSTRUCTOR & HOOKS ====================================================
  /**
   * Constructor
   * @param _route - ActivatedRoute
   * @param _router - Router
   * @param _patronService - PatronService
   * @param _patronTransactionService - PatronTransactionService
   * @param _organisationService - OrganisationService
   * @param _hotKeysService - HotkeysService
   * @param _translateService - TranslateService
   * @param _circulationService - CirculationService
   * @param _recordService: RecordService
   */
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _patronService: PatronService,
    private _patronTransactionService: PatronTransactionService,
    private _organisationService: OrganisationService,
    private _hotKeysService: HotkeysService,
    private _translateService: TranslateService,
    private _circulationService: CirculationService,
    private _operationLogsApiService: OperationLogsApiService,
    private _recordService: RecordService
  ) { }

  /** OnInit hook */
  ngOnInit() {
    this._circulationService.clear();
    this._patronBarcode = this._route.snapshot.paramMap.get('barcode');
    this._patronSubscription$ = this._patronService.getPatron(this._patronBarcode).subscribe((patron: any) => {
      if (patron) {
        this.patron = patron;
        // We need to unregister/register the shortcuts after the patron was loaded. Otherwise, the patron could be considered has
        // null and this will cause error for navigation url construction
        this._unregisterShortcuts();
        this._registerShortcuts();
        this._operationLogsApiService.getCheckInHistory(patron.pid, 1, 1).subscribe((result: any) => {
          this.historyCount = this._recordService.totalHits(result.hits.total);
        });
        this._patronService.getCirculationInformations(patron.pid).subscribe((data) => {
          this.feesTotalAmount = data.fees.engaged + data.fees.preview;
          this._parseStatistics(data.statistics || {});
          for (const message of (data.messages || [])) {
            this._circulationService.addCirculationMessage(message as any);
          }
          // subscribe to fees accounting operations for this patron
          this._patronFeesOperationSubscription$ = this._patronTransactionService.patronFeesOperationSubject$.subscribe(
            (amount) => {
              const total = this.feesTotalAmount + amount;
              this.feesTotalAmount = (total > 0) ? total : 0;
            }
          );
        });
      }
    });
  }

  /** OnDestroy hook */
  ngOnDestroy() {
    this._unregisterShortcuts();
    if (this._patronFeesOperationSubscription$) {
      this._patronFeesOperationSubscription$.unsubscribe();
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

  /**
   * Find and return a circulation statistic.
   * @param type: the type of circulation statistics to find.
   */
  getCirculationStatistics(type: string): number {
    return (
      'circulationInformations' in this._circulationService
      && 'statistics' in this._circulationService.circulationInformations
      && type in this._circulationService.circulationInformations.statistics
    ) ? this._circulationService.circulationInformations.statistics[type]
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
          this._circulationService.incrementCirculationStatistic('pending', Number(data[key]));
          break;
        case LoanState[LoanState.ITEM_AT_DESK]:
          this._circulationService.incrementCirculationStatistic('pickup',  Number(data[key]));
          break;
        case LoanState[LoanState.ITEM_ON_LOAN]:
          this._circulationService.incrementCirculationStatistic('loans',  Number(data[key]));
          break;
        case LoanState[LoanState.CANCELLED]:
        case LoanState[LoanState.ITEM_IN_TRANSIT_TO_HOUSE]:
        case LoanState[LoanState.ITEM_RETURNED]:
          this._circulationService.incrementCirculationStatistic('history',  Number(data[key]));
          break;
      }
    }
  }
}
