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
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '@rero/shared';
import moment from 'moment';
import { MessageService } from 'primeng/api';
import { interval, Subscription } from 'rxjs';
import { ItemsService } from '../../service/items.service';

@Component({
  selector: 'admin-circulation-main-request',
  templateUrl: './main-request.component.html'
})
export class MainRequestComponent implements OnInit, OnDestroy {

  private messageService = inject(MessageService);

  // COMPONENT ATTRIBUTES ==================================================================
  /** options used for auto-refresh select box */
  public refreshOptions = [
    {value: '15000', label: '15 s', icon: 'fa-clock-o'},
    {value: '30000', label: '30 s', icon: 'fa-clock-o'},
    {value: '60000', label: '1 m', icon: 'fa-clock-o'},
    {value: '300000', label: '5 m', icon: 'fa-clock-o'},
    {value: '600000', label: '10 m', icon: 'fa-clock-o'},
    {value: '3000000', label: '30 m', icon: 'fa-clock-o'}
  ];

  /** options used to sort requested items list */
  public sortingCriteria = [
    {value: 'requestdate', label: this.translateService.instant('Request date'), icon: 'fa-sort-numeric-asc'},
    {value: '-requestdate', label: this.translateService.instant('Request date (desc)'), icon: 'fa-sort-numeric-desc'},
    {value: 'callnumber', label: this.translateService.instant('Call number'), icon: 'fa-sort-alpha-asc'},
    {value: '-callnumber', label: this.translateService.instant('Call number (desc)'), icon: 'fa-sort-alpha-desc'},
    {value: 'location', label: this.translateService.instant('Location'), icon: 'fa-sort-alpha-asc'},
    {value: '-location', label: this.translateService.instant('Location (desc)'), icon: 'fa-sort-alpha-desc'},
    {value: 'pickuplocation', label: this.translateService.instant('Pick-up location'), icon: 'fa-sort-alpha-asc'},
    {value: '-pickuplocation', label: this.translateService.instant('Pick-up location (desc)'), icon: 'fa-sort-alpha-desc'},
  ];

  /** the placeholder string used on the */
  public placeholder = _('Please enter an item barcode.');
  /** search text used into the search input component */
  public searchText = '';
  /** requested items loaded */
  public items = null;
  /** the interval (in millis) between 2 calls of requested items (0 = no refresh) */
  public refreshInterval = 0;
  /** is the requested items detail should be collapsed or not */
  public isDetailCollapsed = true;
  /** Focus attribute of the search input */
  public searchInputFocus = true;
  /** Disabled attribute of the search input */
  public searchInputDisabled = false;

  /** the library pid for which load the requested items */
  private libraryPid: string;
  /** the subscription for the interval refreshing */
  private intervalSubscription = new Subscription();
  /** the sort criteria used */
  private sortCriteria = this.sortingCriteria[1].value;


  // COMPONENT CONSTRUCTOR ===========================================================
  /** Constructor
   * @param userService: User Service
   * @param itemsService: Items Service
   * @param translateService: Translate Service
   */
  constructor(
    private userService: UserService,
    private itemsService: ItemsService,
    private translateService: TranslateService,
  ) {}

  /** OnInit hook */
  ngOnInit() {
    const { user } = this.userService;
    if (user) {
      this.libraryPid = user.currentLibrary;
      this.getRequestedLoans();
      this._enableAutoRefresh();
    }
  }

  /** OnDestroy hook */
  ngOnDestroy() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  // PRIVATE FUNCTIONS ========================================================================
  /** Enable the requested items auto-refresh behavior if needed */
  private _enableAutoRefresh() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
      this.intervalSubscription = new Subscription();
    }
    if (this.refreshInterval > 0) {
      this.intervalSubscription = interval(this.refreshInterval).subscribe(() => this.getRequestedLoans());
    }
  }

  /**
   * Allow to sort an item list using the sort criteria used by the component
   * @param items: the item list to sort
   * @return the sorted item list based on component sort criteria
   */
  private _sortingRequestedLoans(items: Array<any>) {
    this.items = items.sort((a, b) => {
      const aTime = moment(a.loan.transaction_date);
      const bTime = moment(b.loan.transaction_date);
      switch (this.sortCriteria) {
        case '-requestdate': return bTime.diff(aTime);
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
          const locA = a.library.name + ' ' + a.location.name;
          const locB = b.library.name + ' ' + b.location.name;
          return (this.sortCriteria === 'location')
            ? locA.localeCompare(locB)
            : locB.localeCompare(locA);
        case 'pickuplocation':
        case '-pickuplocation':
          const pickA = (a.loan.pickup_location.pickup_name)
            ? a.loan.pickup_location.pickup_name
            : a.loan.pickup_location.library_name + ' ' + a.loan.pickup_location.name;
          const pickB = (a.loan.pickup_location.pickup_name)
            ? b.loan.pickup_location.pickup_name
            : b.loan.pickup_location.library_name + ' ' + b.loan.pickup_location.name;
          return (this.sortCriteria === 'pickuplocation')
            ? pickA.localeCompare(pickB)
            : pickB.localeCompare(pickA);
        default: return aTime.diff(bTime);
      }
    });
  }

  // PUBLIC FUNCTIONS ========================================================================

  /** Get the requested loans for the library of the current user */
  getRequestedLoans() {
   this.itemsService.getRequestedLoans(this.libraryPid).subscribe(items => {
     this._sortingRequestedLoans(items);
   });
  }

  /**
   * Method used when an item barcode (or other string) are entered into the search input component
   * @param searchText: the entered search text
   */
  searchValueUpdated(searchText: string) {
    if (! searchText) {
      return null;
    }
    this.searchInputFocus = false;
    this.searchInputDisabled = true;
    this.searchText = searchText;
    const item = this.items.find(currItem => currItem.barcode === searchText);
    if (item === undefined) {
      this.messageService.add({
        severity: 'warn',
        summary: this.translateService.instant('request'),
        detail: this.translateService.instant('No request corresponding to the given item has been found.')
      });
      this._resetSearchInput();
    } else {
      /*const items = this.items;
      this.items = null;*/
      this.itemsService.doValidateRequest(item, this.libraryPid).subscribe(
        newItem => {
          this._sortingRequestedLoans(this.items.map(currItem => (currItem.pid === newItem.pid) ? newItem : currItem));
          this.messageService.add({
            severity: 'warn',
            summary: this.translateService.instant('request'),
            detail: this.translateService.instant('The item is ').concat(this.translateService.instant(newItem.status))
          });
          this._resetSearchInput();
        }
      );
    }
  }

  /**
   * Function used when detail collapsed is clicked
   * @param state: the toggle switch state
   */
  toggleDetailCollapsed(state: boolean): void {
    this.isDetailCollapsed = state;
  }

  /**
   * Function used when auto-refresh is toggled
   * @param state: the toggle switch state
   */
  enableAutoRefresh(state: boolean): void {
    this.refreshInterval = (state) ? parseInt(this.refreshOptions[0].value, 10) : 0;
    this._enableAutoRefresh();
  }

  /**
   * when user choose an new auto refresh interval time
   * @param value: the interval value (values of this.refreshOptions)
   */
  selectingIntervalTimer(value: any): void {
    this.refreshInterval = parseInt(value, 10);
    this._enableAutoRefresh();
  }

  /**
   * when user choose a sort criteria
   * @param criteria: the sort criteria
   */
  selectingSortCriteria(criteria: string) {
    this.sortCriteria = criteria;
    this._sortingRequestedLoans(this.items);
  }

  /** Reset search input */
  private _resetSearchInput(): void {
    setTimeout(() => {
      this.searchInputDisabled = false;
      this.searchInputFocus = true;
      this.searchText = '';
    });
  }
}
