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
import { Item, ItemAction, ItemNoteType } from '@app/admin/classes/items';
import { ItemsService } from '@app/admin/service/items.service';
import { PatronService } from '@app/admin/service/patron.service';
import { TranslateService } from '@ngx-translate/core';
import { CONFIG, DateTranslatePipe } from '@rero/ng-core';
import { ItemStatus, User, UserService } from '@rero/shared';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { SelectChangeEvent } from 'primeng/select';
import { delay, forkJoin, Subscription, switchMap, tap } from 'rxjs';
import { LoanFixedDateService } from '../../services/loan-fixed-date.service';
import { CirculationStatsService } from '../service/circulation-stats.service';
import { CirculationSettingsService, ICirculationSetting } from './circulation-settings/circulation-settings.service';

@Component({
  selector: 'admin-loan',
  templateUrl: './loan.component.html',
  providers: [DateTranslatePipe, LoanFixedDateService],
  standalone: false,
})
export class LoanComponent implements OnInit, OnDestroy {
  private itemsService: ItemsService = inject(ItemsService);
  private translateService: TranslateService = inject(TranslateService);
  private patronService: PatronService = inject(PatronService);
  private userService: UserService = inject(UserService);
  private messageService: MessageService = inject(MessageService);
  private circulationSettingsService: CirculationSettingsService = inject(CirculationSettingsService);
  private circulationStatsService: CirculationStatsService = inject(CirculationStatsService);

  dialogRef: DynamicDialogRef | undefined;

  // COMPONENT ATTRIBUTES ============================================
  /** Search text (barcode) entered in search input */
  public searchText = '';
  /** Current patron */
  public patron: User;
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

  // GETTER & SETTER ================================================
  /** Return the circulation special settings */
  get checkoutSettings(): ICirculationSetting[] | null {
    return this.circulationSettingsService.getSettings();
  }

  /**
   * Get a circulation setting
   * @param key: the setting key to find
   * @return the value of the setting. null if key isn't found
   */
  private _getCheckoutSetting(key: string): any | null {
    const setting = this.circulationSettingsService.getSettings().find((element) => element.key === key);
    return setting !== undefined ? setting.value : null;
  }

  removeCheckoutSettings(key: string): void {
    this.circulationSettingsService.remove(key);
  }

  /** OnInit hook */
  ngOnInit(): void {
    this.subscription.add(
      this.patronService.currentPatron$.subscribe((patron: any) => {
        this.patron = patron;
        if (patron) {
          const loanedItems$ = this.patronService.getItems(patron.pid, this.sortCriteria);
          const pickupItems$ = this.patronService.getItemsPickup(patron.pid);
          forkJoin([loanedItems$, pickupItems$]).subscribe({
            next: ([loanedItems, pickupItems]) => {
              // loanedItems is an array of brief item data (pid, barcode). For each one, we need to
              // call the detail item service to get full data about it
              loanedItems.map((item: any) => (item.loading = true));
              this.checkedOutItems = loanedItems;
              // for each checkedOutElement call the detail item service.
              loanedItems.forEach((data: any, index) => {
                this.patronService.getItem(data.barcode).subscribe((item) => (loanedItems[index] = item));
              });
              // we need to know which items are ready to pickup to decrement the counter if a checkout
              // operation is done on one of this items.
              this.pickupItems = pickupItems;
            },
            error: (error) => {},
          });
        }
      })
    );
    this.currentLibraryPid = this.userService.user.currentLibrary;
    this.searchInputFocus = true;
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.circulationSettingsService.clear();
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
    const item = this.checkedOutItems.find((currItem) => currItem.barcode === barcode);
    if (item && item.actions.includes(ItemAction.checkin)) {
      item.currentAction = ItemAction.checkin;
      this.applyItems([item]);
      if (item.pending_loans) {
        this.messageService.add({
          severity: 'warn',
          summary: this.translateService.instant('Checkin'),
          detail: this.translateService.instant('The item has a request'),
          life: CONFIG.MESSAGE_LIFE,
        });
      }
      if (item.status === ItemStatus.IN_TRANSIT) {
        const destination = item.loan.item_destination.library_name;
        this.messageService.add({
          severity: 'warn',
          summary: this.translateService.instant('Checkin'),
          detail: this.translateService.instant('The item is in transit to {{ destination }}', { destination }),
          life: CONFIG.MESSAGE_LIFE,
        });
      }
    } else {
      this.itemsService.getItem(barcode, this.patron.pid).subscribe({
        next: (newItem) => {
          if (newItem === null) {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Checkout'),
              detail: this.translateService.instant('Item not found'),
              sticky: true,
              closable: true,
            });
            this._resetSearchInput();
          } else {
            if (newItem.status === ItemStatus.ON_LOAN) {
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('Checkout'),
                detail: this.translateService.instant(
                  'Checkout impossible: the item is already on loan for another patron'
                ),
                sticky: true,
                closable: true,
              });
              this._resetSearchInput();
            } else {
              if (newItem.pending_loans && newItem.pending_loans[0].patron_pid !== this.patron.pid) {
                this.messageService.add({
                  severity: 'error',
                  summary: this.translateService.instant('Checkout'),
                  detail: this.translateService.instant('Checkout impossible: the item is requested by another patron'),
                  sticky: true,
                  closable: true,
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
            detail: this.translateService.instant(error.message),
            sticky: true,
            closable: true,
          });
          this._resetSearchInput();
        },
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
          this.circulationSettingsService
            .getSettings()
            .map((setting) => (additionalParams[setting.key] = setting.value));
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
    forkJoin(observables)
      .pipe(
        tap((newItems: any[]) =>
          newItems.map((newItem: Item) => {
            switch (newItem.actionDone) {
              case ItemAction.checkin: {
                this.displayCirculationInformation(ItemAction.checkin, newItem, ItemNoteType.CHECKIN);
                this.checkedOutItems = this.checkedOutItems.filter((currItem) => currItem.pid !== newItem.pid);
                this.checkedInItems.unshift(newItem);
                // display a toast message if the item goes in transit...
                if (newItem.status === ItemStatus.IN_TRANSIT) {
                  const destination = newItem.loan.item_destination.library_name;
                  this.messageService.add({
                    severity: 'warn',
                    summary: this.translateService.instant('Checkin'),
                    detail: this.translateService.instant('The item is in transit to {{ destination }}', {
                      destination,
                    }),
                    life: CONFIG.MESSAGE_LIFE,
                  });
                }
                break;
              }
              case ItemAction.checkout: {
                this._displayTransactionEndDateChanged(newItem);
                this.displayCirculationInformation(ItemAction.checkout, newItem, ItemNoteType.CHECKOUT);
                this.checkedOutItems.unshift(newItem);
                this.checkedInItems = this.checkedInItems.filter((currItem) => currItem.pid !== newItem.pid);
                // check if items was ready to pickup. if yes, then we need to decrement the counter
                const idx = this.pickupItems.findIndex((item) => item.metadata.item.pid === newItem.pid);
                if (idx > -1) {
                  this.pickupItems.splice(idx, 1);
                }
                break;
              }
              case ItemAction.extend_loan: {
                const index = this.checkedOutItems.findIndex((currItem) => currItem.pid === newItem.pid);
                this.checkedOutItems[index] = newItem;
                break;
              }
            }
          })
        ),
        tap(() => this._resetSearchInput()),
        delay(200),
        switchMap(() => this.circulationStatsService.getStats(this.patron.pid))
      )
      .subscribe({
        error: (err) => {
          let errorMessage = '';
          if (err && err.error && err.error.message) {
            errorMessage = err.error.message;
          }
          if (err.error.status === 403) {
            let message =
              this.translateService.instant(errorMessage) ||
              this.translateService.instant('Checkout is not allowed by circulation policy');
            let title = this.translateService.instant('Circulation');
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
              closable: true,
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Circulation'),
              detail: this.translateService.instant('An error occurred on the server: ') + errorMessage,
              sticky: true,
              closable: true,
            });
          }
          this._resetSearchInput();
        },
      });
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
    if (action === ItemAction.checkin && item.library.pid === this.userService.user.currentLibrary) {
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
        life: CONFIG.MESSAGE_LIFE,
      });
    }
  }

  private displayCollectionsAndTemporaryLocation(item: Item): string {
    let message = [];
    if (item.collections && item.collections.length > 0) {
      message.push(`${this.translateService.instant('This item is in exhibition/course')} "${item.collections[0]}"`);
      if (item.collections.length > 1) {
        message.push(
          ` ${this.translateService.instant('and {{ count }} other(s)', { count: item.collections.length - 1 })}`
        );
      }
      message.push('.');
    }
    if (item.temporary_location) {
      message.push(
        `<br/>${this.translateService.instant('This item is in temporary location')} "${item.temporary_location.name}".`
      );
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
      if (
        settingEndDate.getFullYear() !== loanEndDate.getFullYear() ||
        settingEndDate.getMonth() !== loanEndDate.getMonth() ||
        settingEndDate.getDate() !== loanEndDate.getDate()
      ) {
        this.messageService.add({
          severity: 'warn',
          summary: this.translateService.instant('Checkout'),
          detail: this.translateService.instant(
            'The due date has been set to the next business day, since the selected day is closed.'
          ),
          life: CONFIG.MESSAGE_LIFE,
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
        detail: this.translateService.instant('The item has fees'),
        sticky: true,
        closable: true,
      });
    }
  }

  /**
   * Allow to sort the checkout items list using a sort criteria
   * @param sortCriteria: the srt criteria to use for sorting the list
   */
  selectingSortCriteria(sortCriteria: SelectChangeEvent): void {
    switch (sortCriteria.value) {
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

  /** Reset search input */
  private _resetSearchInput(): void {
      this.searchInputDisabled = false;
      this.searchText = '';
      setTimeout(() => {
        this.searchInputFocus = true;
      });
  }
}
