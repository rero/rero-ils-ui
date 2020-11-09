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
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { interval, Subscription } from 'rxjs';
import { UserService } from '../../service/user.service';
import { ItemsService } from '../../service/items.service';


@Component({
  selector: 'admin-circulation-main-request',
  templateUrl: './main-request.component.html'
})
export class MainRequestComponent implements OnInit, OnDestroy {

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
    {value: 'requestdate', label: this._translateService.instant('Request date'), icon: 'fa-sort-numeric-asc'},
    {value: '-requestdate', label: this._translateService.instant('Request date (desc)'), icon: 'fa-sort-numeric-desc'},
    {value: 'callnumber', label: this._translateService.instant('Call number'), icon: 'fa-sort-alpha-asc'},
    {value: '-callnumber', label: this._translateService.instant('Call number (desc)'), icon: 'fa-sort-alpha-desc'}
  ];

  /** the placeholder string used on the */
  public placeholder: string = this._translateService.instant('Please enter an item barcode.');
  /** search text used into the search input component */
  public searchText = '';
  /** requested items loaded */
  public items = [];
  /** detect if the requested items are loading */
  public isLoading = false;
  /** the interval (in millis) between 2 calls of requested items (0 = no refresh) */
  public refreshInterval = 0;
  /** is the requested items detail should be collapsed or not */
  public isDetailCollapsed = true;
  /** Focus attribute of the search input */
  public searchInputFocus = false;

  /** the library pid for which load the requested items */
  private _libraryPid: string;
  /** the subscription for the interval refreshing */
  private _intervalSubscription = new Subscription();
  /** the sort criteria used */
  private _sortCriteria = this.sortingCriteria[1].value;


  // COMPONENT CONSTRUCTOR ===========================================================
  /** Constructor
   * @param _userService: User Service
   * @param _itemsService: Items Service
   * @param _translateService: Translate Service
   * @param _toastService: Toastr Service
   */
  constructor(
    private _userService: UserService,
    private _itemsService: ItemsService,
    private _translateService: TranslateService,
    private _toastService: ToastrService,
  ) {}

  /** OnInit hook */
  ngOnInit() {
    const user = this._userService.getCurrentUser();
    if (user) {
      this._libraryPid = user.getCurrentLibrary();
      this.getRequestedLoans();
      this._enableAutoRefresh();
    }
    this.searchInputFocus = true;
  }

  /** OnDestroy hook */
  ngOnDestroy() {
    if (this._intervalSubscription) {
      this._intervalSubscription.unsubscribe();
    }
  }

  // PRIVATE FUNCTIONS ========================================================================
  /** Enable the requested items auto-refresh behavior if needed */
  private _enableAutoRefresh() {
    if (this._intervalSubscription) {
      this._intervalSubscription.unsubscribe();
      this._intervalSubscription = new Subscription();
    }
    if (this.refreshInterval > 0) {
      this._intervalSubscription = interval(this.refreshInterval).subscribe( () => this.getRequestedLoans());
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
      switch (this._sortCriteria) {
        case '-requestdate': return bTime.diff(aTime);
        case 'callnumber': return a.call_number.localeCompare(b.call_number);
        case '-callnumber': return b.call_number.localeCompare(a.call_number);
        default: return aTime.diff(bTime);
      }
    });
  }

  // PUBLIC FUNCTIONS ========================================================================

  /** Get the requested loans for the library of the current user */
  getRequestedLoans() {
   this.isLoading = true;
   this._itemsService.getRequestedLoans(this._libraryPid).subscribe(items => {
     this._sortingRequestedLoans(items);
     this.isLoading = false;
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
    this.searchText = searchText;
    const item = this.items.find(currItem => currItem.barcode === searchText);
    if (item === undefined) {
      this._toastService.warning(
        this._translateService.instant('No request corresponding to the given item has been found.'),
        this._translateService.instant('request')
      );
    } else {
      /*const items = this.items;
      this.items = null;*/
      this._itemsService.doValidateRequest(item, this._libraryPid).subscribe(
        newItem => {
          this._sortingRequestedLoans(this.items.map(currItem => (currItem.pid === newItem.pid) ? newItem : currItem));
          this._toastService.warning(
            this._translateService.instant('The item is ').concat(this._translateService.instant(newItem.status)),
            this._translateService.instant('request')
          );
          this.searchText = '';
        }
      );
    }
    this.searchInputFocus = true;
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
    this._sortCriteria = criteria;
    this._sortingRequestedLoans(this.items);
  }
}
