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
import { ChangeDetectionStrategy, Component, computed, inject, Injector, linkedSignal, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { _, TranslateDirective, TranslatePipe } from "@ngx-translate/core";
import { TranslateService } from '@ngx-translate/core';
import { CONFIG, SearchInputComponent } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { DateTime } from 'luxon';
import { MessageService } from 'primeng/api';
import { interval, of } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { ItemsService } from '../../service/items.service';
import { Bind } from 'primeng/bind';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { RequestedItemsListComponent } from './requested-items-list/requested-items-list.component';
import { SelectModule } from 'primeng/select';

type RefreshOption = {
  value: string;
  label: string;
  icon: string;
};

type SortOption = RefreshOption;

type RequestedLoanItem = {
  pid: string;
  barcode: string;
  status: string;
  call_number?: string;
  library: { name: string };
  location: { name: string };
  loan: {
    pid: string;
    transaction_date: string;
    pickup_location: {
      pickup_name?: string;
      library_name: string;
      name: string;
    };
  };
};

@Component({
    selector: 'admin-circulation-main-request',
    templateUrl: './main-request.component.html',
    imports: [SearchInputComponent, Bind, ToggleSwitch, FormsModule, TranslateDirective, RequestedItemsListComponent, TranslatePipe, SelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainRequestComponent {

  private appStore = inject(AppStore);
  private itemsService: ItemsService = inject(ItemsService);
  private translateService: TranslateService = inject(TranslateService);
  private messageService = inject(MessageService);

  // COMPONENT ATTRIBUTES ==================================================================
  /** options used for auto-refresh select box */
  readonly refreshOptions: RefreshOption[] = [
    {value: '15000', label: '15 s', icon: 'fa fa-clock-o'},
    {value: '30000', label: '30 s', icon: 'fa fa-clock-o'},
    {value: '60000', label: '1 m', icon: 'fa fa-clock-o'},
    {value: '300000', label: '5 m', icon: 'fa fa-clock-o'},
    {value: '600000', label: '10 m', icon: 'fa fa-clock-o'},
    {value: '3000000', label: '30 m', icon: 'fa fa-clock-o'}
  ];

  /** options used to sort requested items list */
  private readonly currentLanguage = toSignal(
    this.translateService.onLangChange.pipe(
      map(() => this.translateService.getCurrentLang()),
      startWith(this.translateService.getCurrentLang())
    ),
    { initialValue: this.translateService.getCurrentLang() }
  );

  readonly sortingCriteria = computed<SortOption[]>(() => {
    this.currentLanguage();
    return [
      {value: 'requestdate', label: this.translateService.instant('Request date'), icon: 'fa fa-sort-numeric-asc'},
      {value: '-requestdate', label: this.translateService.instant('Request date (desc)'), icon: 'fa fa-sort-numeric-desc'},
      {value: 'callnumber', label: this.translateService.instant('Call number'), icon: 'fa fa-sort-alpha-asc'},
      {value: '-callnumber', label: this.translateService.instant('Call number (desc)'), icon: 'fa fa-sort-alpha-desc'},
      {value: 'location', label: this.translateService.instant('Location'), icon: 'fa fa-sort-alpha-asc'},
      {value: '-location', label: this.translateService.instant('Location (desc)'), icon: 'fa fa-sort-alpha-desc'},
      {value: 'pickuplocation', label: this.translateService.instant('Pick-up location'), icon: 'fa fa-sort-alpha-asc'},
      {value: '-pickuplocation', label: this.translateService.instant('Pick-up location (desc)'), icon: 'fa fa-sort-alpha-desc'},
    ];
  });

  /** the placeholder string used on the */
  readonly placeholder = _('Please enter an item barcode.');
  /** search text used into the search input component */
  readonly searchText = signal('');
  /** the interval (in millis) between 2 calls of requested items (0 = no refresh) */
  readonly refreshInterval = signal(0);
  /** Focus attribute of the search input */
  readonly searchInputFocus = signal(true);
  /** Disabled attribute of the search input */
  readonly searchInputDisabled = signal(false);
  /** the sort criteria used */
  readonly sortCriteria = linkedSignal(() => this.sortingCriteria()[0].value);
  private readonly itemOverrides = signal<Map<string, RequestedLoanItem>>(new Map());
  private readonly injector = inject(Injector);

  readonly libraryPid = computed(() => this.appStore.currentLibraryPid());

  private readonly rawItems = toSignal(
    toObservable(this.libraryPid, { injector: this.injector }).pipe(
      switchMap(libraryPid => {
        if (!libraryPid) {
          return of<RequestedLoanItem[] | null>(null);
        }
        return toObservable(this.refreshInterval, { injector: this.injector }).pipe(
          switchMap(refreshInterval => refreshInterval > 0
            ? interval(refreshInterval).pipe(startWith(0), switchMap(() => this.itemsService.getRequestedLoans(libraryPid)))
            : this.itemsService.getRequestedLoans(libraryPid)
          )
        );
      })
    ),
    { injector: this.injector, initialValue: null }
  );

  readonly items = computed<RequestedLoanItem[] | null>(() => {
    const items = this.rawItems();
    const sortCriteria = this.sortCriteria();
    const overrides = this.itemOverrides();
    if (!items) {
      return null;
    }
    const merged = overrides.size > 0
      ? items.map((item: RequestedLoanItem) => overrides.get(item.pid) ?? item)
      : items;
    return this.sortRequestedLoans(merged, sortCriteria);
  });

  // PRIVATE FUNCTIONS ========================================================================
  /**
   * Allow to sort an item list using the sort criteria used by the component
   * @param items: the item list to sort
   * @return the sorted item list based on component sort criteria
   */
  private sortRequestedLoans(items: RequestedLoanItem[], sortCriteria: string): RequestedLoanItem[] {
    return [...items].sort((a: RequestedLoanItem, b: RequestedLoanItem) => {
      const aTime = DateTime.fromISO(a.loan.transaction_date);
      const bTime = DateTime.fromISO(b.loan.transaction_date);
      switch (sortCriteria) {
        case '-requestdate': return bTime.toMillis() - aTime.toMillis();
        case 'callnumber':
          return (('call_number' in a) && ('call_number' in b))
            ? a.call_number.localeCompare(b.call_number)
            : 1;
        case '-callnumber':
          return (('call_number' in a) && ('call_number' in b))
            ? b.call_number.localeCompare(a.call_number)
            : 1;
        case 'location':
        case '-location':
          { const locA = a.library.name + ' ' + a.location.name;
          const locB = b.library.name + ' ' + b.location.name;
          return (sortCriteria === 'location')
            ? locA.localeCompare(locB)
            : locB.localeCompare(locA); }
        case 'pickuplocation':
        case '-pickuplocation':
          { const pickA = (a.loan.pickup_location.pickup_name)
            ? a.loan.pickup_location.pickup_name
            : a.loan.pickup_location.library_name + ' ' + a.loan.pickup_location.name;
          const pickB = (b.loan.pickup_location.pickup_name)
            ? b.loan.pickup_location.pickup_name
            : b.loan.pickup_location.library_name + ' ' + b.loan.pickup_location.name;
          return (sortCriteria === 'pickuplocation')
            ? pickA.localeCompare(pickB)
            : pickB.localeCompare(pickA); }
        default: return aTime.toMillis() - bTime.toMillis();
      }
    });
  }

  // PUBLIC FUNCTIONS ========================================================================

  /**
   * Method used when an item barcode (or other string) are entered into the search input component
   * @param searchText: the entered search text
   */
  searchValueUpdated(searchText: string) {
    if (! searchText) {
      return null;
    }
    this.searchInputFocus.set(false);
    this.searchInputDisabled.set(true);
    this.searchText.set(searchText);
    const libraryPid = this.libraryPid();
    const items = this.items();
    const item = items?.find((currItem: RequestedLoanItem) => currItem.barcode === searchText);
    if (item === undefined) {
      this.messageService.add({
        severity: 'warn',
        summary: this.translateService.instant('request'),
        detail: this.translateService.instant('No request corresponding to the given item has been found.'),
        life: CONFIG.MESSAGE_LIFE
      });
      this._resetSearchInput();
    } else {
      if (!libraryPid) {
        this._resetSearchInput();
        return;
      }

      this.itemsService.doValidateRequest(item, libraryPid).subscribe(
        newItem => {
          this.itemOverrides.update(overrides => new Map(overrides).set(newItem.pid, newItem));
          this.messageService.add({
            severity: 'warn',
            summary: this.translateService.instant('request'),
            detail: this.translateService.instant('The item is ').concat(this.translateService.instant(newItem.status)),
            life: CONFIG.MESSAGE_LIFE
          });
          this._resetSearchInput();
        }
      );
    }
  }

  /**
   * Function used when auto-refresh is toggled
   * @param state: the toggle switch state
   */
  enableAutoRefresh(state: boolean): void {
    this.refreshInterval.set((state) ? parseInt(this.refreshOptions[0].value, 10) : 0);
  }

  /**
   * when user choose an new auto refresh interval time
   * @param value: the interval value (values of this.refreshOptions)
   */
  selectingIntervalTimer(value: string): void {
    this.refreshInterval.set(parseInt(value, 10));
  }

  /**
   * when user choose a sort criteria
   * @param criteria: the sort criteria
   */
  selectingSortCriteria(criteria: string) {
    this.sortCriteria.set(criteria);
  }

  /** Reset search input */
  private _resetSearchInput(): void {
    this.searchInputDisabled.set(false);
    this.searchText.set('');
  }
}
