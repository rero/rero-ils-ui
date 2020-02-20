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
import { Item, ItemAction, ItemStatus } from '../../items';
import { ItemsService } from '../../items.service';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'admin-loan',
  templateUrl: './loan.component.html'
})
export class LoanComponent implements OnInit {
  public placeholder: string = this.translate.instant(
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

  /**
   * Constructor
   * @param itemsService: Items Service
   * @param translate: Translate Service
   * @param toastService: Toastr Service
   * @param patronService: Patron Service
   */
  constructor(
    private itemsService: ItemsService,
    private translate: TranslateService,
    private toastService: ToastrService,
    private patronService: PatronService,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.patronService.currentPatron$.subscribe(patron => {
      this.patron = patron;
      if (patron) {
        this.isLoading = true;
        this.patronService.getItems(patron.pid).subscribe(items => {
          this.checkedOutItems = items;
          this.isLoading = false;
        });
      }
    });
    this.searchInputFocus = true;
  }

  /** Search value with search input
   * @param searchText: value to search for (barcode)
   */
  searchValueUpdated(searchText: string) {
    if (!searchText) {
      return null;
    }
    this.searchText = searchText.trim();
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
    } else {
      this.itemsService.getItem(barcode, this.patron.pid).subscribe(
        newItem => {
          if (newItem === null) {
            this.toastService.error(
              this.translate.instant('Item not found'),
              this.translate.instant('Checkout')
            );
            this.searchText = '';
            this.searchInputFocus = true;
          } else {
            if (newItem.status === ItemStatus.ON_LOAN) {
              this.toastService.error(
                this.translate.instant('The item is already on loan'),
                this.translate.instant('Checkout')
              );
              this.searchText = '';
              this.searchInputFocus = true;
            } else {
              if (newItem.pending_loans && newItem.pending_loans[0].patron_pid !== this.patron.pid) {
                this.toastService.error(
                  this.translate.instant('Checkout impossible: the item is requested by another patron'),
                  this.translate.instant('Checkout')
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
          this.toastService.error(
            error.message,
            this.translate.instant('Checkout')
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
    const currentLibrary = this.userService.getCurrentUser().getCurrentLibrary();
    for (const item of items) {
      if (item.currentAction !== ItemAction.no) {
        observables.push(
          this.itemsService.doAction(item, currentLibrary, this.patron.pid));
      }
    }
    forkJoin(observables).subscribe(
      newItems => {
        newItems.map(newItem => {
          switch (newItem.actionDone) {
            case ItemAction.checkin: {
              this.checkedOutItems = this.checkedOutItems.filter(currItem => currItem.pid !== newItem.pid);
              this.checkedInItems.unshift(newItem);
              break;
            }
            case ItemAction.checkout: {
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
        if (err && err.error && err.error.status) {
          errorMessage = err.error.status;
        }
        if (err.error.status === 403) {
          this.toastService.error(
            this.translate.instant('Checkout is not allowed by circulation policy'),
            this.translate.instant('Checkout')
          );
        } else {
          this.toastService.error(
            this.translate.instant('An error occured on the server: ') + errorMessage,
            this.translate.instant('Circulation')
          );
        }
        this.searchText = '';
        this.searchInputFocus = true;
      }
    );
  }

  hasFees(event: boolean) {
    if (event) {
      this.toastService.error(
        this.translate.instant('The item has fees'),
        this.translate.instant('Checkin')
      );
    }
  }
}
