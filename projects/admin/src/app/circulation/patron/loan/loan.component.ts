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
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { User } from '../../../class/user';
import { PatronService } from '../../../service/patron.service';
import { UserService } from '../../../service/user.service';
import { Item, ItemAction, ItemStatus } from '../../items';
import { ItemsService } from '../../items.service';

@Component({
  selector: 'admin-loan',
  templateUrl: './loan.component.html'
})
export class LoanComponent implements OnInit {
  public placeholder: string = this.translate.instant(
    'Please enter an item barcode.'
  );
  public searchText = '';
  public patron: User;
  public isLoading = false;

  private loggedUser: User;

  public items: Item[] = [];

  constructor(
    private userService: UserService,
    private itemsService: ItemsService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private toastService: ToastrService,
    private patronService: PatronService
  ) {
  }

  ngOnInit() {
    this.loggedUser = this.userService.getCurrentUser();
    this.patronService.currentPatron$.subscribe(patron => {
      this.patron = patron;
      if (patron) {
        this.isLoading = true;
        this.patronService.getItems(patron.pid).subscribe(items => {
          this.items = items;
          this.isLoading = false;
        });
      }
    });
  }

  searchValueUpdated(searchText: string) {
    if (!searchText) {
      return null;
    }
    this.searchText = searchText;
    this.getItem(searchText);
  }

  /**
   * This method check if operation can be done by current logged user for a specific item
   * @param item: the item to check
   * @param action: check if this action if allowed on this item
   * @return `false` if user or operation is not allowed, `true` otherwise
   */
  private allowActionOnItem(item: Item, action: ItemAction = null): boolean {
    // check if item and current logged user are from the same organisation
    if (this.loggedUser.library.organisation.pid !== item.organisation.pid) {
      this.toastService.warning(
        this.translate.instant(
          'No action allowed: the item belongs to another organisation.'
        ),
        this.translate.instant('Checkin')
      );
      return false;
    }
    if (action) {
      // check if operation has allowed on this item
      if (item.actions === [ItemAction.no]) {
        this.toastService.warning(
          this.translate.instant('No action possible on this item!'),
          this.translate.instant('Checkout')
        );
        return false;
      }
      // check if action passed in params is allowed for this item
      if (!item.actions.includes(action)) {
        this.toastService.warning(
          this.translate.instant('This action is not allowed for this item'),
          this.translate.instant((action as unknown) as string)
        );
        return false;
      }
    }
    return true;
  }

  getItem(barcode: string) {
    // check if item is already in the user items list. If yes, this is a check-in operation
    const item = this.items.find(currItem => currItem.barcode === barcode);
    if (item && item.actions.includes(ItemAction.checkin)) {
      item.currentAction = ItemAction.checkin;
      this.applyItems([item]);
    } else {
      this.itemsService.getItem(barcode, this.patron.pid).subscribe(
        newItem => {
          if (newItem === null) {
            this.toastService.warning(
              this.translate.instant('Item not found!'),
              this.translate.instant('Checkin/Checkout')
            );
          } else {
            if (!newItem.actions.includes(ItemAction.checkout)) {
              this.toastService.warning(
                this.translate.instant('Item is unavailable!'),
                this.translate.instant('Checkout')
              );
            } else {
              newItem.currentAction = ItemAction.checkout;
              this.items.unshift(newItem);
              this.applyItems([newItem]);
            }
          }
        },
        error =>
          this.toastService.error(
            error.message,
            this.translate.instant('Checkout')
          ),
        () => console.log('loan success')
      );
    }
  }

  extendLoan(item) {
    item.currentAction = ItemAction.extend_loan;
    this.applyItems([item]);
  }

  applyItems(items: Item[]) {
    const observables = [];
    for (const item of items) {
      if (item.currentAction !== ItemAction.no) {
        observables.push(this.itemsService.doAction(item, this.patron.pid));
      }
    }
    forkJoin(observables).subscribe(
      newItems => {
        this.items = this.items
          .map(item => {
            const newItem = newItems
              .find(currItem => currItem.pid === item.pid);

            // replace existing item in list by the backend return value
            if (newItem) {
              if (newItem.status === ItemStatus.IN_TRANSIT || newItem.status === ItemStatus.AT_DESK) {
                this.toastService.success(
                  this.translate.instant('The item is ') +
                    this.translate.instant(newItem.status),
                  this.translate.instant('Checkin')
                );
              }
              return newItem;
            }
            // item was not modified by the backend
            return item;
          })
          .filter(item => item.status === ItemStatus.ON_LOAN);
      },
      err => {
        let errorMessage = '';
        if (err && err.error && err.error.status) {
          errorMessage = err.error.status;
        }
        this.toastService.error(
          this.translate.instant('An error occured on the server: ') +
            errorMessage,
          this.translate.instant('Checkin')
        );
      }
    );
  }

}
