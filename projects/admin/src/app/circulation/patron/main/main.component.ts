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
import { ActivatedRoute, NavigationEnd, Router, Scroll } from '@angular/router';
import { OrganisationService } from '@app/admin/service/organisation.service';
import { PatronService } from '@app/admin/service/patron.service';
import { HotkeysService } from '@ngneat/hotkeys';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { map, Subscription, switchMap, tap } from 'rxjs';
import { CirculationStatsService } from '../service/circulation-stats.service';
import { PatronTransactionService } from '../../services/patron-transaction.service';

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
  private patronTransactionService: PatronTransactionService = inject(PatronTransactionService);
  private hotKeysService: HotkeysService = inject(HotkeysService);
  private translateService: TranslateService = inject(TranslateService);
  private circulationStatsService: CirculationStatsService = inject(CirculationStatsService);

  // COMPONENT ATTRIBUTES ====================================================
  /** shortcuts for patron tabs */
  private _shortcuts = [];

  /** the current logged patron */
  patron: any = undefined;

  /** the current patron barcode */
  barcode: string;

  items: MenuItem[] | undefined = [];

  activeTab: string;

  subscription = new Subscription();

  stats: any;

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
    this.subscription.add(this.route.params.subscribe((data: any) => {
      if (data.hasOwnProperty('barcode') && (this.barcode !== data.barcode)) {
        this.load(data.barcode);
      }
    }));
    this.subscription.add(this.router.events.subscribe((event: NavigationEnd | any) => {
      if (event instanceof NavigationEnd) {
        this.activeTab = this.router.url.split('/').pop();
      }
    }
    ));
    // Active the active tab
   this.activeTab = this.router.url.split('/').pop();

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
        // load statistics
        switchMap((patron: any) =>
          this.circulationStatsService.getStats(patron.pid)
        ),
        // load overdue transactions
        switchMap(() => this.patronService.getOverduePreview(this.patron.pid)),
        // compute the total of the overdue transactions
        map((overdues) => {
            let fees = 0;
            overdues.map((fee: any) => {
              fees += fee.fees.total;
            });
            this.circulationStatsService.setOverdueFees(fees, overdues);
        }),
        // get engaged fees patron transactions
        tap(() => this.patronTransactionService.emitPatronTransactionByPatron(this.patron.pid, undefined, 'open')),
        // subscribe to the engaged patron transactions
        switchMap(() => this.patronTransactionService.patronTransactionsSubject$),
        // set engaged fees in the shared service
        map((transactions) => {
          this.circulationStatsService.setFeesEngaged(this.patronTransactionService.computeTotalTransactionsAmount(transactions), transactions);
        }),
        tap(() => this.initializeTabs(this.patron.keep_history)),
        tap(() => this.initializeShortcuts(this.patron.keep_history)),
        tap(() => {
          this._unregisterShortcuts();
          this._registerShortcuts();
        })
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

  private initializeTabs(keepHistory: boolean): void {
    let items = [
      {
        id: 'loan',
        label: this.translateService.instant('On loan'),
        routerLink: ['/circulation', 'patron', this.barcode, 'loan'],
        tag: {
          statistics: this.circulationStatsService.statistics
        }
      },
      {
        id: 'pickup',
        label: this.translateService.instant('To pick up'),
        routerLink: ['/circulation', 'patron', this.barcode, 'pickup'],
        tag: {
          statistics: this.circulationStatsService.statistics
        }
      },
      {
        id: 'pending',
        label: this.translateService.instant('Pending'),
        routerLink: ['/circulation', 'patron', this.barcode, 'pending'],
        tag: {
          statistics: this.circulationStatsService.statistics
        }
      },
      {
        id: 'ill',
        label: this.translateService.instant('Interlibrary loan'),
        routerLink: ['/circulation', 'patron', this.barcode, 'ill'],
        tag: {
          statistics: this.circulationStatsService.statistics
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
          severity: 'warn',
          statistics: this.circulationStatsService.statistics,
          withCurrency: true,
        }
      }
    ];
    if (keepHistory) {
      items.push({
        id: 'history',
        label: this.translateService.instant('History'),
        routerLink: ['/circulation', 'patron', this.barcode, 'history']
      });
    }
    this.items = items;
  }

  private initializeShortcuts(keepHistory: boolean): void {
    this._shortcuts = [
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
        description: this.translateService.instant('Go to "ILL" tab'),
        callback: ($event) => {
          this.router.navigate(['/circulation', 'patron', this.barcode, 'ill']);
        }
      }, {
        keys: '5',
        group: this.translateService.instant('Patron profile shortcuts'),
        description: this.translateService.instant('Go to "patron profile" tab'),
        callback: ($event) => {
          this.router.navigate(['/circulation', 'patron', this.barcode, 'profile']);
        }
      }, {
        keys: '6',
        group: this.translateService.instant('Patron profile shortcuts'),
        description: this.translateService.instant('Go to "fees" tab'),
        callback: ($event) => {
          this.router.navigate(['/circulation', 'patron', this.barcode, 'fees']);
        }
      }
    ];
    if(keepHistory) {
        this._shortcuts.push(
          {
            keys: '7',
            group: this.translateService.instant('Patron profile shortcuts'),
            description: this.translateService.instant('Go to "history" tab'),
            callback: ($event) => {
              this.router.navigate(['/circulation', 'patron', this.barcode, 'history']);
            }
          }
        );
    }
  }
}
