/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
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
import { Item, ItemAction, ItemNoteType } from '@app/admin/classes/items';
import { ItemsService } from '@app/admin/service/items.service';
import { PatronService } from '@app/admin/service/patron.service';
import { TranslateService } from '@ngx-translate/core';
import { DateTranslatePipe } from '@rero/ng-core';
import { ItemStatus, UserService } from '@rero/shared';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription, forkJoin } from 'rxjs';
import { CirculationService } from '../../services/circulation.service';
import { LoanFixedDateService } from '../../services/loan-fixed-date.service';
import { FixedDateFormComponent } from './fixed-date-form/fixed-date-form.component';

/** Interface to declare a special circulation settings */
export interface CirculationSetting {
  key: string;    /** the setting internal key */
  label: string;  /** the setting label to display to user */
  value: any;     /** the setting value */
  extra?: any;     /** extra element for customization */
}


@Component({
  selector: 'admin-loan',
  templateUrl: './loan.component.html',
  providers: [ DateTranslatePipe, LoanFixedDateService ]
})
export class LoanComponent implements OnInit, OnDestroy {

  // COMPONENT ATTRIBUTES ============================================
  /** Search text (barcode) entered in search input */
  public searchText = '';
  /** Current patron */
  public patron: any;
  /** List of checked out items */
  public checkedOutItems = [];
  /** List of checked in items */
  public checkedInItems = [];
  /** Focus attribute of the search input */
  searchInputFocus = false;
  /** Disabled attribute of the search input */
  searchInputDisabled = false;
  /** Library PID of the logged user */
  currentLibraryPid: string;

  /** ready to pickup items */
  private _pickupItems = [];
  /** Observable subscription */
  private _subscription = new Subscription();
  /** checkout list sort criteria */
  private _sortCriteria = '-transaction_date';
  /** modal reference */
  private _modalRef: BsModalRef;
  /** checkout circulation special settings */
  private _checkoutCirculationSettings: CirculationSetting[] = [];

  // GETTER & SETTER ================================================
  /** Return the circulation special settings */
  get checkoutSettings(): CirculationSetting[] | null {
    return this._checkoutCirculationSettings;
  }

  /**
   *  Add/Replace a circulation special setting
   *  @param setting: the circulation setting
   */
  private _setCheckoutSetting(setting: CirculationSetting) {
    this.removeCheckoutSettings(setting.key);
    this._checkoutCirculationSettings.push(setting);
  }

  /**
   * Get a circulation setting
   * @param key: the setting key to find
   * @return the value of the setting. null if key isn't found
   */
  private _getCheckoutSetting(key: string): any | null {
    const setting = this._checkoutCirculationSettings.find(element => element.key === key);
    return (setting !== undefined)
      ? setting.value
      : null;
  }

  /**
   * Remove a circulation special setting
   * @param key: the circulation setting key to remove
   * @return the circulation setting removed or null if the setting is not found
   */
  removeCheckoutSettings(key: string): CirculationSetting | CirculationSetting[] | null {
    const idx = this._checkoutCirculationSettings.findIndex(setting => setting.key === key);
    if (idx >= 0) {
      if (key === 'endDate' && this._checkoutCirculationSettings[idx].extra.remember) {
        this._loanFixedDateService.remove();
      }
      return this._checkoutCirculationSettings.splice(idx, 1);
    }
  }

  // CONSTRUCTOR & HOOKS ============================================
  /**
   * Constructor
   * @param _itemsService - Items Service
   * @param _translateService - Translate Service
   * @param _toastService - Toastr Service
   * @param _patronService - Patron Service
   * @param _userService - UserService
   * @param _modalService - BsModalService
   * @param _dateTranslatePipe - DateTranslatePipe
   * @param _circulationService - CirculationService
   * @param _loanFixedDateService - LoanFixedDateService
   */
  constructor(
    private _itemsService: ItemsService,
    private _translateService: TranslateService,
    private _toastService: ToastrService,
    private _patronService: PatronService,
    private _userService: UserService,
    private _modalService: BsModalService,
    private _dateTranslatePipe: DateTranslatePipe,
    private _circulationService: CirculationService,
    private _loanFixedDateService: LoanFixedDateService
  ) {}

  /** OnInit hook */
  ngOnInit(): void {
    this._subscription.add(this._patronService.currentPatron$.subscribe((patron: any) => {
      this.patron = patron;
      if (patron) {
        const loanedItems$ = this._patronService.getItems(patron.pid, this._sortCriteria);
        const pickupItems$ = this._patronService.getItemsPickup(patron.pid);
        forkJoin([loanedItems$, pickupItems$]).subscribe(
          ([loanedItems, pickupItems]) => {
            // loanedItems is an array of brief item data (pid, barcode). For each one, we need to
            // call the detail item service to get full data about it
            loanedItems.map((item: any) => item.loading = true);
            this.checkedOutItems = loanedItems;
            // for each checkedOutElement call the detail item service.
            loanedItems.forEach((data: any, index) => {
              this._patronService.getItem(data.barcode).subscribe(item => loanedItems[index] = item);
            });

            // we need to know which items are ready to pickup to decrement the counter if a checkout
            // operation is done on one of this items.
            this._pickupItems = pickupItems;
          }, error => {}
        );
      }
    }));
    this.currentLibraryPid = this._userService.user.currentLibrary;
    this.searchInputFocus = true;
    // Assignment of end date if present in locale storage
    const fixedDateValue = this._loanFixedDateService.get();
    if (fixedDateValue) {
      this.setCheckoutDateSetting(fixedDateValue, true);
    }
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  // COMPONENT FUNCTIONS ========================================================
  /**
   * Search value with search input
   * @param searchText: value to search for (barcode)
   */
  searchValueUpdated(searchText: string) {
    if (!searchText) {
      return null;
    }
    this.searchText = searchText;
    this.getItem(this.searchText);
  }

  /**
   * Check item availability and set current action
   * @param barcode: barcode of the item to get
   */
  getItem(barcode: string): void {
    this.searchInputFocus = false;
    this.searchInputDisabled = true;
    const item = this.checkedOutItems.find(currItem => currItem.barcode === barcode);
    if (item && item.actions.includes(ItemAction.checkin)) {
      item.currentAction = ItemAction.checkin;
      this.applyItems([item]);
      if (item.pending_loans) {
        this._toastService.warning(
          this._translateService.instant('The item has a request'),
          this._translateService.instant('Checkin')
        );
      }
      if (item.status === ItemStatus.IN_TRANSIT) {
        this._toastService.warning(
          this._translateService.instant('The item is in transit'),
          this._translateService.instant('Checkin')
        );
      }
    } else {
      this._itemsService.getItem(barcode, this.patron.pid).subscribe(
        newItem => {
          if (newItem === null) {
            this._toastService.error(
              this._translateService.instant('Item not found'),
              this._translateService.instant('Checkout')
            );
            this._resetSearchInput();
          } else {
            if (newItem.status === ItemStatus.ON_LOAN) {
              this._toastService.error(
                this._translateService.instant('Checkout impossible: the item is already on loan for another patron'),
                this._translateService.instant('Checkout')
              );
              this._resetSearchInput();
            } else {
              if (newItem.pending_loans && newItem.pending_loans[0].patron_pid !== this.patron.pid) {
                this._toastService.error(
                  this._translateService.instant('Checkout impossible: the item is requested by another patron'),
                  this._translateService.instant('Checkout')
                );
                this._resetSearchInput();
              } else {
                newItem.currentAction = ItemAction.checkout;
                this.applyItems([newItem]);
              }
            }
          }
        },
        error => {
          this._toastService.error(
            this._translateService.instant(error.message),
            this._translateService.instant('Checkout')
          );
          this._resetSearchInput();
        }
      );
    }
  }

  /**
   * Dispatch items between checked in and checked out items
   * @param items: checked in and checked out items
   */
  applyItems(items: Item[]): void {
    const observables = [];
    for (const item of items) {
      if (item.currentAction !== ItemAction.no) {
        const additionalParams = {};
        if (item.currentAction === ItemAction.checkout) {
          this._checkoutCirculationSettings.map(setting => additionalParams[setting.key] = setting.value);
        }
        observables.push(
          this._itemsService.doAction(
            item,
            this.currentLibraryPid,
            // TODO: user or patron ?
            this._userService.user.patronLibrarian.pid,
            this.patron.pid,
            additionalParams
          )
        );
      }
    }
    forkJoin(observables).subscribe(
      newItems => {
        newItems.map((newItem: Item) => {
          switch (newItem.actionDone) {
            case ItemAction.checkin: {
              this._displayCirculationNote(newItem, ItemNoteType.CHECKIN);
              this.checkedOutItems = this.checkedOutItems.filter(currItem => currItem.pid !== newItem.pid);
              this.checkedInItems.unshift(newItem);
              // display a toast message if the item goes in transit...
              if (newItem.status === ItemStatus.IN_TRANSIT) {
                const destination = newItem.loan.item_destination.library_name;
                this._toastService.warning(
                  this._translateService.instant('The item is in transit to [{{ destination }}]', {destination}),
                  this._translateService.instant('Checkin')
                );
              }
              this._circulationService.decrementCirculationStatistic('loans');
              this._circulationService.incrementCirculationStatistic('history');
              break;
            }
            case ItemAction.checkout: {
              this._displayTransactionEndDateChanged(newItem);
              this._displayCirculationNote(newItem, ItemNoteType.CHECKOUT);
              this.checkedOutItems.unshift(newItem);
              this.checkedInItems = this.checkedInItems.filter(currItem => currItem.pid !== newItem.pid);
              this._circulationService.incrementCirculationStatistic('loans');
              // check if items was ready to pickup. if yes, then we need to decrement the counter
              const idx = this._pickupItems.findIndex(item => item.metadata.item.pid === newItem.pid);
              if (idx > -1) {
                this._pickupItems.splice(idx, 1);
                this._circulationService.decrementCirculationStatistic('pickup');
              }
              break;
            }
            case ItemAction.extend_loan: {
              const index = this.checkedOutItems.findIndex(currItem => currItem.pid === newItem.pid);
              this.checkedOutItems[index] = newItem;
              break;
            }
          }
          this._resetSearchInput();
        });
        this._resetSearchInput();
      },
      err => {
        let errorMessage = '';
        if (err && err.error && err.error.message) {
          errorMessage = err.error.message;
        }
        if (err.error.status === 403) {
          let message = this._translateService.instant(errorMessage) || this._translateService.instant('Checkout is not allowed by circulation policy');
          let title =  this._translateService.instant('Circulation');
          if (message.includes(': ')) {
            const splittedData = message.split(': ', 2);
            title = splittedData[0].trim();
            message = splittedData[1].trim();
            message = message.charAt(0).toUpperCase() + message.slice(1);
          }
          this._toastService.error(
            message,
            title,
            {disableTimeOut: true, closeButton: true, enableHtml: true}
          );
        } else {
          this._toastService.error(
            this._translateService.instant('An error occurred on the server: ') + errorMessage,
            this._translateService.instant('Circulation'),
            {disableTimeOut: true, closeButton: true, enableHtml: true}
          );
        }
        this._resetSearchInput();
      }
    );
  }

  /**
   * display a circulation note about an item as a permanent toastr message
   * @param item: the item
   * @param noteType: the note type to display
   */
  private _displayCirculationNote(item: Item, noteType: ItemNoteType): void {
    const note = item.getNote(noteType);
    if (note != null) {
      this._toastService.warning(
        note.content, null,
        {
          closeButton: true,    // add a close button to the toastr message
          disableTimeOut: true, // permanent toastr message (until click on 'close' button)
          tapToDismiss: false   // toastr message only close when click on the 'close' button.
        }
      );
    }
  }

  /**
   * Display a warning toastr message if transaction end_date is not the same as the user selected end_date.
   * The backend will check if the selected end_date is an opening day ; if not then it will automatically
   * update the selected date to the next open day.
   * @param item: the item (with loan data included)
   */
  private _displayTransactionEndDateChanged(item: any): void {
    let settingEndDate = this._getCheckoutSetting('endDate');
    let loanEndDate = item.loan.end_date || null;
    if (settingEndDate !== null && loanEndDate !== null) {
      settingEndDate = new Date(settingEndDate);
      loanEndDate = new Date(loanEndDate);
      if (settingEndDate.getFullYear() !== loanEndDate.getFullYear() ||
        settingEndDate.getMonth() !== loanEndDate.getMonth() ||
        settingEndDate.getDate() !== loanEndDate.getDate()
      ) {
        this._toastService.warning(
          this._translateService.instant('The due date has been set to the next business day, since the selected day is closed.'),
          this._translateService.instant('Checkout')
        );
      }
    }
  }

  /**
   * method called if transaction has linked open fess when a checkin operation is done
   * @param event: True if transaction has fees, False otherwise
   */
  hasFees(event: boolean): void {
    if (event) {
      this._toastService.error(
        this._translateService.instant('The item has fees'),
        this._translateService.instant('Checkin')
      );
    }
  }

  /**
   * Allow to sort the checkout items list using a sort criteria
   * @param sortCriteria: the srt criteria to use for sorting the list
   */

  selectingSortCriteria(sortCriteria: string): void {
    switch (sortCriteria) {
      case 'duedate':
        this.checkedOutItems.sort((a, b) => a.loan.end_date.diff(b.loan.end_date));
        break;
      case '-duedate':
        this.checkedOutItems.sort((a, b) => b.loan.end_date.diff(a.loan.end_date));
        break;
      case 'transactiondate':
        this.checkedOutItems.sort((a, b) => a.loan.transaction_date.diff(b.loan.transaction_date));
        break;
      default:
        this.checkedOutItems.sort((a, b) => b.loan.transaction_date.diff(a.loan.transaction_date));
    }
  }

  /**
   * Open a modal dialog form allowing to user to choose a fixed end-date.
   * Subscribe to modal onHide event to get data entered by user and perform job if needed.
   */
  openFixedEndDateDialog(): void {
    this._modalRef = this._modalService.show(FixedDateFormComponent, {
        ignoreBackdropClick: true,
        keyboard: true
    });
    this._modalRef.content.onSubmit.subscribe(result => {
      if ('action' in result && result.action === 'submit') {
        const date = this.setCheckoutDateSetting(result.content.endDate, result.content.remember);
        if (result.content.remember) {
          this._loanFixedDateService.set(date);
        }
      }
    });
  }

  /**
   * Save setting for end date
   * @param endDate - Date in string format
   * @param remember - Hold value (Boolean format)
   * @returns End date in string format
   */
  setCheckoutDateSetting(endDate: string, remember: boolean): string {
    const checkoutEndDate = moment(endDate, FixedDateFormComponent.DATE_FORMAT).toDate().setHours(23, 59);
    const formattedDate = this._dateTranslatePipe.transform(checkoutEndDate, 'shortDate');
    const setting = {
      key: 'endDate',
      label: this._translateService.instant('Active chosen due date: {{ endDate }}', {endDate: formattedDate}),
      value: new Date(checkoutEndDate).toISOString(),
      extra: {
        remember,
        class: 'badge-' + (remember ? 'success' : 'warning')
      }
    };
    this._setCheckoutSetting(setting);

    return setting.value;
  }

  /**
   * Allow to specify that all checkout circulation should be operate without taking
   * care of any possible blocking restrictions (Cipo, PatronTypes restriction, patron blocking, ...)
   */
  overrideBlocking(): void {
    this._setCheckoutSetting({
      key: 'overrideBlocking',
      label: this._translateService.instant('Override blockings'),
      value: true
    });
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
