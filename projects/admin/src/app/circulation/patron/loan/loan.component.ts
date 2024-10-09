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
import { Item, ItemAction, ItemNoteType } from '@app/admin/classes/items';
import { ItemsService } from '@app/admin/service/items.service';
import { PatronService } from '@app/admin/service/patron.service';
import { TranslateService } from '@ngx-translate/core';
import { DateTranslatePipe } from '@rero/ng-core';
import { ItemStatus, UserService } from '@rero/shared';
import moment from 'moment';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, Subscription } from 'rxjs';
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

  private itemsService: ItemsService = inject(ItemsService);
  private translateService: TranslateService = inject(TranslateService);
  private patronService: PatronService = inject(PatronService);
  private userService: UserService = inject(UserService);
  private dateTranslatePipe: DateTranslatePipe = inject(DateTranslatePipe);
  private circulationService: CirculationService = inject(CirculationService);
  private loanFixedDateService: LoanFixedDateService = inject(LoanFixedDateService);
  private messageService: MessageService = inject(MessageService);
  private dialogService: DialogService = inject(DialogService);

  dialogRef: DynamicDialogRef | undefined;

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
  private pickupItems = [];
  /** Observable subscription */
  private subscription = new Subscription();
  /** checkout list sort criteria */
  private sortCriteria = '-transaction_date';
  /** checkout circulation special settings */
  private checkoutCirculationSettings: CirculationSetting[] = [];

  // GETTER & SETTER ================================================
  /** Return the circulation special settings */
  get checkoutSettings(): CirculationSetting[] | null {
    return this.checkoutCirculationSettings;
  }

  /**
   *  Add/Replace a circulation special setting
   *  @param setting: the circulation setting
   */
  private _setCheckoutSetting(setting: CirculationSetting) {
    this.removeCheckoutSettings(setting.key);
    this.checkoutCirculationSettings.push(setting);
  }

  /**
   * Get a circulation setting
   * @param key: the setting key to find
   * @return the value of the setting. null if key isn't found
   */
  private _getCheckoutSetting(key: string): any | null {
    const setting = this.checkoutCirculationSettings.find(element => element.key === key);
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
    const idx = this.checkoutCirculationSettings.findIndex(setting => setting.key === key);
    if (idx >= 0) {
      if (key === 'endDate' && this.checkoutCirculationSettings[idx].extra.remember) {
        this.loanFixedDateService.remove();
      }
      return this.checkoutCirculationSettings.splice(idx, 1);
    }
  }

  /** OnInit hook */
  ngOnInit(): void {
    this.subscription.add(this.patronService.currentPatron$.subscribe((patron: any) => {
      this.patron = patron;
      if (patron) {
        const loanedItems$ = this.patronService.getItems(patron.pid, this.sortCriteria);
        const pickupItems$ = this.patronService.getItemsPickup(patron.pid);
        forkJoin([loanedItems$, pickupItems$]).subscribe({
          next: ([loanedItems, pickupItems]) => {
            // loanedItems is an array of brief item data (pid, barcode). For each one, we need to
            // call the detail item service to get full data about it
            loanedItems.map((item: any) => item.loading = true);
            this.checkedOutItems = loanedItems;
            // for each checkedOutElement call the detail item service.
            loanedItems.forEach((data: any, index) => {
              this.patronService.getItem(data.barcode).subscribe(item => loanedItems[index] = item);
            });

            // we need to know which items are ready to pickup to decrement the counter if a checkout
            // operation is done on one of this items.
            this.pickupItems = pickupItems;
          },
          error: error => {}
        });
      }
    }));
    this.currentLibraryPid = this.userService.user.currentLibrary;
    this.searchInputFocus = true;
    // Assignment of end date if present in locale storage
    const fixedDateValue = this.loanFixedDateService.get();
    if (fixedDateValue) {
      this.setCheckoutDateSetting(fixedDateValue, true);
    }
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
        this.messageService.add({
          severity: 'warn',
          summary: this.translateService.instant('Checkin'),
          detail: this.translateService.instant('The item has a request')
        });
      }
      if (item.status === ItemStatus.IN_TRANSIT) {
        const destination = item.loan.item_destination.library_name;
        this.messageService.add({
          severity: 'warn',
          summary: this.translateService.instant('Checkin'),
          detail: this.translateService.instant('The item is in transit to {{ destination }}', {destination})
        });
      }
    } else {
      this.itemsService.getItem(barcode, this.patron.pid).subscribe({
        next: (newItem) => {
          if (newItem === null) {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Checkout'),
              detail: this.translateService.instant('Item not found')
            });
            this._resetSearchInput();
          } else {
            if (newItem.status === ItemStatus.ON_LOAN) {
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('Checkout'),
                detail: this.translateService.instant('Checkout impossible: the item is already on loan for another patron')
              });
              this._resetSearchInput();
            } else {
              if (newItem.pending_loans && newItem.pending_loans[0].patron_pid !== this.patron.pid) {
                this.messageService.add({
                  severity: 'error',
                  summary: this.translateService.instant('Checkout'),
                  detail: this.translateService.instant('Checkout impossible: the item is requested by another patron')
                });
                this._resetSearchInput();
              } else {
                newItem.currentAction = ItemAction.checkout;
                this.applyItems([newItem]);
              }
            }
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('Checkout'),
            detail: this.translateService.instant(error.message)
          });
          this._resetSearchInput();
        }
      });
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
          this.checkoutCirculationSettings.map(setting => additionalParams[setting.key] = setting.value);
        }
        observables.push(
          this.itemsService.doAction(
            item,
            this.currentLibraryPid,
            // TODO: user or patron ?
            this.userService.user.patronLibrarian.pid,
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
              this.displayCirculationInformation(ItemAction.checkin, newItem, ItemNoteType.CHECKIN);
              this.checkedOutItems = this.checkedOutItems.filter(currItem => currItem.pid !== newItem.pid);
              this.checkedInItems.unshift(newItem);
              // display a toast message if the item goes in transit...
              if (newItem.status === ItemStatus.IN_TRANSIT) {
                const destination = newItem.loan.item_destination.library_name;
                this.messageService.add({
                  severity: 'warn',
                  summary: this.translateService.instant('Checkin'),
                  detail: this.translateService.instant('The item is in transit to {{ destination }}', {destination})
                });
              }
              this.circulationService.decrementCirculationStatistic('loans');
              this.circulationService.incrementCirculationStatistic('history');
              break;
            }
            case ItemAction.checkout: {
              this._displayTransactionEndDateChanged(newItem);
              this.displayCirculationInformation(ItemAction.checkout, newItem, ItemNoteType.CHECKOUT);
              this.checkedOutItems.unshift(newItem);
              this.checkedInItems = this.checkedInItems.filter(currItem => currItem.pid !== newItem.pid);
              this.circulationService.incrementCirculationStatistic('loans');
              // check if items was ready to pickup. if yes, then we need to decrement the counter
              const idx = this.pickupItems.findIndex(item => item.metadata.item.pid === newItem.pid);
              if (idx > -1) {
                this.pickupItems.splice(idx, 1);
                this.circulationService.decrementCirculationStatistic('pickup');
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
          let message = this.translateService.instant(errorMessage) || this.translateService.instant('Checkout is not allowed by circulation policy');
          let title =  this.translateService.instant('Circulation');
          if (message.includes(': ')) {
            const splittedData = message.split(': ', 2);
            title = splittedData[0].trim();
            message = splittedData[1].trim();
            message = message.charAt(0).toUpperCase() + message.slice(1);
          }
          this.messageService.add({
            severity: 'error',
            summary: title,
            detail: message,
            sticky: true,
            closable: true
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('Circulation'),
            detail: this.translateService.instant('An error occurred on the server: ') + errorMessage
          });
        }
        this._resetSearchInput();
      }
    );
  }

  /**
   * display a circulation note about an item as a permanent toast message
   * @param action: the current action
   * @param item: the item
   * @param noteType: the note type to display
   */
  private displayCirculationInformation(action: string, item: Item, noteType: ItemNoteType): void {
    let message = [];
    const note = item.getNote(noteType);
    if (note != null) {
      message.push(note.content);
    }
    // Show additional message only for the owning library
    if (action === ItemAction.checkin && (item.library.pid === this.userService.user.currentLibrary)) {
      const additionalMessage = this.displayCollectionsAndTemporaryLocation(item);
      if (additionalMessage.length > 0) {
        if (message.length > 0) {
          message.push('<br />');
        }
        message.push(additionalMessage);
      }
    }
    if (message.length > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: this.translateService.instant('Checkin'),
        detail: message.join(),
        sticky: true,
        closable: true
      });
    }
  }

  private displayCollectionsAndTemporaryLocation(item: Item): string {
    let message = [];
    if (item.collections && item.collections.length > 0) {
      message.push(`${this.translateService.instant('This item is in exhibition/course')} "${item.collections[0]}"`);
      if (item.collections.length > 1) {
        message.push(` ${this.translateService.instant('and {{ count }} other(s)', {count: item.collections.length - 1 })}`);
      }
      message.push('.');
    }
    if (item.temporary_location) {
      message.push(`<br/>${this.translateService.instant('This item is in temporary location')} "${item.temporary_location.name}".`);
    }

    return message.join('');
  }

  /**
   * Display a warning toast message if transaction end_date is not the same as the user selected end_date.
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
        this.messageService.add({
          severity: 'warn',
          summary: this.translateService.instant('Checkout'),
          detail: this.translateService.instant('The due date has been set to the next business day, since the selected day is closed.')
        });
      }
    }
  }

  /**
   * method called if transaction has linked open fess when a checkin operation is done
   * @param event: True if transaction has fees, False otherwise
   */
  hasFees(event: boolean): void {
    if (event) {
      this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant('Checkin'),
        detail: this.translateService.instant('The item has fees')
      });
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
      case 'location':
        this.checkedOutItems.sort((a, b) => a.library_location_name.localeCompare(b.library_location_name));
        break;
      case '-location':
        this.checkedOutItems.sort((a, b) => b.library_location_name.localeCompare(a.library_location_name));
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
    this.dialogRef = this.dialogService.open(FixedDateFormComponent, {
      dismissableMask: true
    });
    this.dialogRef.onClose.subscribe((result?: any) => {
      if (result && 'action' in result && result.action === 'submit') {
        const date = this.setCheckoutDateSetting(result.content.endDate, result.content.remember);
        if (result.content.remember) {
          this.loanFixedDateService.set(date);
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
    const formattedDate = this.dateTranslatePipe.transform(checkoutEndDate, 'shortDate');
    const setting = {
      key: 'endDate',
      label: this.translateService.instant('Active chosen due date: {{ endDate }}', {endDate: formattedDate}),
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
      label: this.translateService.instant('Override blockings'),
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
