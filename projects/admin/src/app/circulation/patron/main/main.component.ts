/*
 * RERO ILS UI
 * Copyright (C) 2019-2025 RERO
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
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanState } from '@app/admin/classes/loans';
import { OrganisationService } from '@app/admin/service/organisation.service';
import { PatronService } from '@app/admin/service/patron.service';
import { getSeverity } from '@app/admin/utils/utils';
import { HotkeysService } from '@ngneat/hotkeys';
import { TranslateService } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { MenuItem } from 'primeng/api';
import { forkJoin, Subscription, switchMap, tap } from 'rxjs';
import { OperationLogsApiService } from '@rero/shared';
import { CirculationStatistics } from '../../circulationStatistics';
import { CirculationService } from '../../services/circulation.service';

@Component({
    selector: 'admin-main',
    templateUrl: './main.component.html',
    standalone: false
})
export class MainComponent implements OnInit, OnDestroy {

  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private patronService: PatronService = inject(PatronService);
  private organisationService: OrganisationService = inject(OrganisationService);
  private hotKeysService: HotkeysService = inject(HotkeysService);
  private translateService: TranslateService = inject(TranslateService);
  private circulationService: CirculationService = inject(CirculationService);
  private operationLogsApiService: OperationLogsApiService = inject(OperationLogsApiService);
  private recordService: RecordService = inject(RecordService);

  // COMPONENT ATTRIBUTES ====================================================
  /** shortcuts for patron tabs */
  private _shortcuts = [
    {
      keys: '1',
      group: this.translateService.instant('Patron profile shortcuts'),
      description: this.translateService.instant('Go to "circulation" tab'),
      callback: ($event) => {
        this.router.navigate(['/circulation', 'patron', this.barcode, 'loan']);
      }
    }, {
      keys: '2',
      group: this.translateService.instant('Patron profile shortcuts'),
      description: this.translateService.instant('Go to "pickup" tab'),
      callback: ($event) => {
        this.router.navigate(['/circulation', 'patron', this.barcode, 'pickup']);
      }
    }, {
      keys: '3',
      group: this.translateService.instant('Patron profile shortcuts'),
      description: this.translateService.instant('Go to "pending" tab'),
      callback: ($event) => {
        this.router.navigate(['/circulation', 'patron', this.barcode, 'pending']);
      }
    }, {
      keys: '4',
      group: this.translateService.instant('Patron profile shortcuts'),
      description: this.translateService.instant('Go to "patron profile" tab'),
      callback: ($event) => {
        this.router.navigate(['/circulation', 'patron', this.barcode, 'profile']);
      }
    }, {
      keys: '5',
      group: this.translateService.instant('Patron profile shortcuts'),
      description: this.translateService.instant('Go to "fees" tab'),
      callback: ($event) => {
        this.router.navigate(['/circulation', 'patron', this.barcode, 'fees']);
      }
    }, {
      keys: '6',
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

  items: MenuItem[] | undefined;

  activeTab: string;

  subscription = new Subscription();

  // GETTER & SETTER ====================================================
  /**
   * Get current organisation
   * @return current organisation
   */
  get organisation() {
    return this.organisationService.organisation;
  }

  /** OnInit hook */
  ngOnInit(): void {
    /** load patron if the barcode changes */
    this.route.params.subscribe((data: any) => {
      if (data.hasOwnProperty('barcode')) {
        this.load(data.barcode);
      }
    });
  }

  onActiveItemChange(event: MenuItem): void {
    if (event) {
      this.router.navigate(event.routerLink);
    }
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
    this._unregisterShortcuts();
    this.subscription.unsubscribe();
    this.patronService.clearPatron();
  }

  // COMPONENT FUNCTIONS ====================================================
  /**
   * Load data
   * @param barcode: string, patron barcode
   */
  load(barcode: string): void {
    this.barcode = barcode;

    this.subscription.add(
      this.patronService.getPatron(barcode)
      .pipe(
        tap((patron: any) => this.patron = patron),
        tap(() => {
          // We need to unregister/register the shortcuts after the patron was loaded.
          // Otherwise, the patron could be considered has null and this will
          // cause error for navigation url construction
          this._unregisterShortcuts();
          this._registerShortcuts();
        }),
        switchMap((patron: any) => {
          const circulationInformations$ = this.patronService.getCirculationInformations(patron.pid);
          const checkInHistory$ = this.operationLogsApiService.getCheckInHistory(patron.pid, 1, 1);
          const overduesPreview$ = this.patronService.getOverduesPreview(this.patron.pid);
          return forkJoin([circulationInformations$, checkInHistory$, overduesPreview$]);
        }),
        tap(([informations, checkInHistory, overduesPreview]: any) => {
          this.circulationService.clear();
          this.circulationService.statisticsIncrease(CirculationStatistics.FEES_ENGAGED, informations.fees.engaged);
          this.circulationService.statisticsIncrease(CirculationStatistics.FEES, informations.fees.engaged);
          this._parseStatistics(informations.statistics || {});
          for (const message of (informations.messages || [])) {
            this.circulationService.addCirculationMessage({
              severity: getSeverity(message.type),
              detail: message.content
            });
          }
          overduesPreview.map((overdue: any) => this.circulationService.statisticsIncrease(CirculationStatistics.FEES, overdue.fees.total));
          if (this.patron.keep_history) {
            this.circulationService.statisticsIncrease(CirculationStatistics.HISTORY, this.recordService.totalHits(checkInHistory.hits.total));
          }
        }),
        tap(() => this.initializeMenu(this.patron.keep_history))
      )
      .subscribe()
    );
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
   * Parse statistics from API into corresponding tab statistic.
   * @param data: a dictionary of loan state/value
   */
  private _parseStatistics(data: any): void {
    for (const key of Object.keys(data)) {
      switch (key) {
        case LoanState[LoanState.PENDING]:
        case LoanState[LoanState.ITEM_IN_TRANSIT_FOR_PICKUP]:
          this.circulationService.statisticsIncrease(CirculationStatistics.PENDING, Number(data[key]));
          break;
        case LoanState[LoanState.ITEM_AT_DESK]:
          this.circulationService.statisticsIncrease(CirculationStatistics.PICKUP,  Number(data[key]));
          break;
        case LoanState[LoanState.ITEM_ON_LOAN]:
          this.circulationService.statisticsIncrease(CirculationStatistics.LOAN,  Number(data[key]));
          break;
        case 'ill_requests':
          this.circulationService.statisticsIncrease(CirculationStatistics.ILL, Number(data[key]));
          break;
      }
    }
  }

  private initializeMenu(keepHistory: boolean): void {
    this.items = [
      {
        id: 'loan',
        label: this.translateService.instant('On loan'),
        routerLink: ['/circulation', 'patron', this.barcode, 'loan'],
        tag: {
          statistics: this.circulationService.statistics
        }
      },
      {
        id: 'pickup',
        label: this.translateService.instant('To pick up'),
        routerLink: ['/circulation', 'patron', this.barcode, 'pickup'],
        tag: {
          statistics: this.circulationService.statistics
        }
      },
      {
        id: 'pending',
        label: this.translateService.instant('Pending'),
        routerLink: ['/circulation', 'patron', this.barcode, 'pending'],
        tag: {
          statistics: this.circulationService.statistics
        }
      },
      {
        id: 'ill',
        label: this.translateService.instant('Interlibrary loan'),
        routerLink: ['/circulation', 'patron', this.barcode, 'ill'],
        tag: {
          statistics: this.circulationService.statistics
        }
      },
      {
        id: 'profile',
        label: this.translateService.instant('Profile'),
        routerLink: ['/circulation', 'patron', this.barcode, 'profile']
      },
      {
        id: 'fees',
        label: this.translateService.instant('Fees'),
        routerLink: ['/circulation', 'patron', this.barcode, 'fees'],
        tag: {
          severity: 'warning',
          statistics: this.circulationService.statistics,
          withCurrency: true,
        }
      }
    ];
    if (keepHistory) {
      this.items.push({
        id: 'history',
        label: this.translateService.instant('History'),
        routerLink: ['/circulation', 'patron', this.barcode, 'history'],
        tag: {
          statistics: this.circulationService.statistics
        }
      });
    }

    // Active the active tab
    this.activeTab = this.router.url.split('/').pop();
  }
}
