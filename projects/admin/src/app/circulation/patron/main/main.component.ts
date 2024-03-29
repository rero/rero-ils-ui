/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { LoanState } from '@app/admin/classes/loans';
import { OrganisationService } from '@app/admin/service/organisation.service';
import { PatronService } from '@app/admin/service/patron.service';
import { HotkeysService } from '@ngneat/hotkeys';
import { TranslateService } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { Subscription } from 'rxjs';
import { OperationLogsApiService } from '../../../api/operation-logs-api.service';
import { CirculationService } from '../../services/circulation.service';
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
      group: this.translateService.instant('Patron profile shortcuts'),
      description: this.translateService.instant('Go to "circulation" tab'),
      callback: ($event) => {
        this.router.navigate(['/circulation', 'patron', this.barcode, 'loan']);
      }
    }, {
      keys: 'shift.2',
      group: this.translateService.instant('Patron profile shortcuts'),
      description: this.translateService.instant('Go to "pickup" tab'),
      callback: ($event) => {
        this.router.navigate(['/circulation', 'patron', this.barcode, 'pickup']);
      }
    }, {
      keys: 'shift.3',
      group: this.translateService.instant('Patron profile shortcuts'),
      description: this.translateService.instant('Go to "pending" tab'),
      callback: ($event) => {
        this.router.navigate(['/circulation', 'patron', this.barcode, 'pending']);
      }
    }, {
      keys: 'shift.4',
      group: this.translateService.instant('Patron profile shortcuts'),
      description: this.translateService.instant('Go to "patron profile" tab'),
      callback: ($event) => {
        this.router.navigate(['/circulation', 'patron', this.barcode, 'profile']);
      }
    }, {
      keys: 'shift.5',
      group: this.translateService.instant('Patron profile shortcuts'),
      description: this.translateService.instant('Go to "fees" tab'),
      callback: ($event) => {
        this.router.navigate(['/circulation', 'patron', this.barcode, 'fees']);
      }
    }, {
      keys: 'shift.6',
      group: this.translateService.instant('Patron profile shortcuts'),
      description: this.translateService.instant('Go to "history" tab'),
      callback: ($event) => {
        this.router.navigate(['/circulation', 'patron', this.barcode, 'history']);
      }
    }
  ];

  /** the current logged patron */
  patron: any = undefined;

  /** the current patron barcode */
  barcode: string;

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
    return this.organisationService.organisation;
  }

  // CONSTRUCTOR & HOOKS ====================================================
  /**
   * Constructor
   * @param route - ActivatedRoute
   * @param router - Router
   * @param patronService - PatronService
   * @param patronTransactionService - PatronTransactionService
   * @param organisationService - OrganisationService
   * @param hotKeysService - HotkeysService
   * @param translateService - TranslateService
   * @param circulationService - CirculationService
   * @param recordService: RecordService
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patronService: PatronService,
    private patronTransactionService: PatronTransactionService,
    private organisationService: OrganisationService,
    private hotKeysService: HotkeysService,
    private translateService: TranslateService,
    private circulationService: CirculationService,
    private operationLogsApiService: OperationLogsApiService,
    private recordService: RecordService
  ) { }

  /** OnInit hook */
  ngOnInit(): void {
    /** load patron if the barcode changes */
    this.route.params.subscribe((data: any) => {
      if (data.hasOwnProperty('barcode')) {
        this.load(data.barcode);
      }
    });
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
    this._unregisterShortcuts();
    if (this._patronFeesOperationSubscription$) {
      this._patronFeesOperationSubscription$.unsubscribe();
    }
    if (this._patronSubscription$) {
      this._patronSubscription$.unsubscribe();
    }
    this.patronService.clearPatron();
  }

  // COMPONENT FUNCTIONS ====================================================
  /**
   * Load data
   * @param barcode: string, patron barcode
   */
  load(barcode: string): void {
    this.barcode = barcode;
    this._patronSubscription$ = this.patronService.getPatron(barcode).subscribe((patron: any) => {
      if (patron) {
        this.patron = patron;
        // We need to unregister/register the shortcuts after the patron was loaded. Otherwise, the patron could be considered has
        // null and this will cause error for navigation url construction
        this._unregisterShortcuts();
        this._registerShortcuts();
        this.operationLogsApiService.getCheckInHistory(patron.pid, 1, 1).subscribe((result: any) => {
          this.historyCount = this.recordService.totalHits(result.hits.total);
        });
        this.patronService.getCirculationInformations(patron.pid).subscribe((data) => {
          this.circulationService.clear();
          this.feesTotalAmount = data.fees.engaged + data.fees.preview;
          this._parseStatistics(data.statistics || {});
          for (const message of (data.messages || [])) {
            this.circulationService.addCirculationMessage(message as any);
          }
          // subscribe to fees accounting operations for this patron
          this._patronFeesOperationSubscription$ = this.patronTransactionService.patronFeesOperationSubject$.subscribe(
            (amount) => {
              const total = this.feesTotalAmount + amount;
              this.feesTotalAmount = (total > 0) ? total : 0;
            }
          );
        });
      }
    });
  }

  /** reset the patron currently viewed */
  clearPatron(): void {
    this.patronService.clearPatron();
    this.router.navigate(['/circulation']);
  }

  /** Register all component shortcuts on the hotkeysService */
  private _registerShortcuts(): void {
    for (const shortcut of this._shortcuts) {
      const { callback } = shortcut;
      delete shortcut.callback;
      this.hotKeysService.addShortcut(shortcut).subscribe($event => callback($event));
    }
  }

  /** Unregister all component shortcuts from the hotkeysService (if they are registered) */
  private _unregisterShortcuts(): void {
    const registeredHotKeys = this.hotKeysService.getHotkeys().map(shortcut => shortcut.keys);
    const componentShortcuts = this._shortcuts.map(shortcut => shortcut.keys);
    const intersectionShortcuts = registeredHotKeys.filter(value => componentShortcuts.includes(value));
    if (intersectionShortcuts.length > 0) {
      this.hotKeysService.removeShortcuts(intersectionShortcuts);
    }
  }

  /**
   * Find and return a circulation statistic.
   * @param type: the type of circulation statistics to find.
   */
  getCirculationStatistics(type: string): number {
    const stats = this.circulationService?.circulationInformations?.statistics;
    return stats && type in stats
      ? stats[type]
      : 0;
  }

  /**
   * Parse statistics from API into corresponding tab statistic.
   * @param data: a dictionary of loan state/value
   */
  private _parseStatistics(data: any): void {
    for (const key of Object.keys(data)) {
      switch (key) {
        case LoanState[LoanState.PENDING]:
        case LoanState[LoanState.ITEM_IN_TRANSIT_FOR_PICKUP]:
          this.circulationService.incrementCirculationStatistic('pending', Number(data[key]));
          break;
        case LoanState[LoanState.ITEM_AT_DESK]:
          this.circulationService.incrementCirculationStatistic('pickup',  Number(data[key]));
          break;
        case LoanState[LoanState.ITEM_ON_LOAN]:
          this.circulationService.incrementCirculationStatistic('loans',  Number(data[key]));
          break;
        case LoanState[LoanState.CANCELLED]:
        case LoanState[LoanState.ITEM_IN_TRANSIT_TO_HOUSE]:
        case LoanState[LoanState.ITEM_RETURNED]:
          this.circulationService.incrementCirculationStatistic('history',  Number(data[key]));
          break;
        case 'ill_requests':
          this.circulationService.incrementCirculationStatistic('ill', Number(data[key]));
          break;
      }
    }
  }
}
