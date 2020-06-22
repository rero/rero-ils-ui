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

import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { User } from '../../../class/user';
import { PatronService } from '../../../service/patron.service';
import { UserService } from '../../../service/user.service';
import { Item, ItemAction, ItemNoteType, ItemStatus } from '../../../class/items';
import { ItemsService } from '../../../service/items.service';
import { PatronBlockedMessagePipe } from '../../../pipe/patron-blocked-message.pipe';

@Component({
  selector: 'admin-loan',
  templateUrl: './loan.component.html',
  providers: [PatronBlockedMessagePipe]
})
export class LoanComponent implements OnInit {
  public placeholder: string = this._translate.instant(
    'Please enter an item barcode.'
  );
  /** Search text (barcode) entered in search input */
  public searchText = '';

  /** Current patron */
  public patron: User;

  /** Is loading */
  public isLoading = false;

  /** List of checked out items */
  public checkedOutItems = [];

  /** List of checked in items */
  public checkedInItems = [];

  /** Focus attribute of the search input */
  searchInputFocus = false;

  /** Library PID of the logged user */
  currentLibraryPid: string;

  /**
   * Constructor
   * @param _itemsService: Items Service
   * @param _translate: Translate Service
   * @param _toastService: Toastr Service
   * @param _patronService: Patron Service
   * @param _userService: UserService
   * @param _patronBlockedMessagePipe: PatronBlockingPipe
   */
  constructor(
    private _itemsService: ItemsService,
    private _translate: TranslateService,
    private _toastService: ToastrService,
    private _patronService: PatronService,
    private _userService: UserService,
    private _patronBlockedMessagePipe: PatronBlockedMessagePipe
  ) {
  }

  ngOnInit() {
    this._patronService.currentPatron$.subscribe(patron => {
      this.patron = patron;
      if (patron) {
        this.isLoading = true;
        this._patronService.getItems(patron.pid).subscribe(items => {
          this.checkedOutItems = items;
          this.isLoading = false;
        });
      }
    });
    this.currentLibraryPid = this._userService.getCurrentUser().getCurrentLibrary();
    this.searchInputFocus = true;
  }

  /** Search value with search input
   * @param searchText: value to search for (barcode)
   */
  searchValueUpdated(searchText: string) {
    if (!searchText) {
      return null;
    }
    this.searchText = searchText;
    this.getItem(this.searchText);
  }

  /** Check item availability and set current action
   * @param barcode: barcode of the item to get
   */
  getItem(barcode: string) {
    this.searchInputFocus = false;
    const item = this.checkedOutItems.find(currItem => currItem.barcode === barcode);
    if (item && item.actions.includes(ItemAction.checkin)) {
      item.currentAction = ItemAction.checkin;
      this.applyItems([item]);
      if (item.pending_loans) {
        this._toastService.warning(
          this._translate.instant('The item has a request'),
          this._translate.instant('Checkin')
        );
      }
      if (item.status === ItemStatus.IN_TRANSIT) {
        this._toastService.warning(
          this._translate.instant('The item is ' + ItemStatus.IN_TRANSIT),
          this._translate.instant('Checkin')
        );
      }
    } else {
      this._itemsService.getItem(barcode, this.patron.pid).subscribe(
        newItem => {
          if (newItem === null) {
            this._toastService.error(
              this._translate.instant('Item not found'),
              this._translate.instant('Checkout')
            );
            this.searchText = '';
            this.searchInputFocus = true;
          } else {
            if (newItem.status === ItemStatus.ON_LOAN) {
              this._toastService.error(
                this._translate.instant('The item is already on loan'),
                this._translate.instant('Checkout')
              );
              this.searchText = '';
              this.searchInputFocus = true;
            } else {
              if (newItem.pending_loans && newItem.pending_loans[0].patron_pid !== this.patron.pid) {
                this._toastService.error(
                  this._translate.instant('Checkout impossible: the item is requested by another patron'),
                  this._translate.instant('Checkout')
                );
                this.searchText = '';
                this.searchInputFocus = true;
              } else {
                newItem.currentAction = ItemAction.checkout;
                this.applyItems([newItem]);
              }
            }
          }
        },
        error => {
          this._toastService.error(
            error.message,
            this._translate.instant('Checkout')
          );
          this.searchText = '';
          this.searchInputFocus = true;
        },
        () => {
          console.log('loan success');
        }
      );
    }
  }

  /** Dispatch items between checked in and checked out items
   * @param items: checked in and checked out items
   */
  applyItems(items: Item[]) {
    const observables = [];
    for (const item of items) {
      if (item.currentAction !== ItemAction.no) {
        observables.push(
          this._itemsService.doAction(item, this.currentLibraryPid, this.patron.pid));
      }
    }
    forkJoin(observables).subscribe(
      newItems => {
        newItems.map(newItem => {
          switch (newItem.actionDone) {
            case ItemAction.checkin: {
              this._displayCirculationNote(newItem, ItemNoteType.CHECKIN);
              this.checkedOutItems = this.checkedOutItems.filter(currItem => currItem.pid !== newItem.pid);
              this.checkedInItems.unshift(newItem);
              break;
            }
            case ItemAction.checkout: {
              this._displayCirculationNote(newItem, ItemNoteType.CHECKOUT);
              this.checkedOutItems.unshift(newItem);
              this.checkedInItems = this.checkedInItems.filter(currItem => currItem.pid !== newItem.pid);
              break;
            }
            case ItemAction.extend_loan: {
              const index = this.checkedOutItems.findIndex(currItem => currItem.pid === newItem.pid);
              this.checkedOutItems[index] = newItem;
              break;
            }
          }
        });
        this.searchText = '';
        this.searchInputFocus = true;
      },
      err => {
        let errorMessage = '';
        if (err && err.error && err.error.message) {
          errorMessage = err.error.message;
        }
        if (err.error.status === 403) {
          // Specific case when user is blocked (for better user comprehension)
          if (errorMessage !== '' && errorMessage.startsWith('BLOCKED USER')) {
            const blockedMessage = this._patronBlockedMessagePipe.transform(this.patron);
            this._toastService.error(
              `${this._translate.instant('Checkout not possible.')} ${blockedMessage}`,
              this._translate.instant('Circulation')
            );
          } else {
            this._toastService.error(
              this._translate.instant('Checkout is not allowed by circulation policy'),
              this._translate.instant('Checkout')
            );
          }
        } else {
          this._toastService.error(
            this._translate.instant('An error occured on the server: ') + errorMessage,
            this._translate.instant('Circulation')
          );
        }
        this.searchText = '';
        this.searchInputFocus = true;
      }
    );
  }

  /** display a circulation note about an item as a permanent toastr message
   *
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

  hasFees(event: boolean) {
    if (event) {
      this._toastService.error(
        this._translate.instant('The item has fees'),
        this._translate.instant('Checkin')
      );
    }
  }
}
