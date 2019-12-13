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

import {Component, OnInit} from '@angular/core';
import {Item, ItemAction, ItemStatus} from '../items';
import {ActivatedRoute, Router} from '@angular/router';
import {ItemsService} from '../items.service';
import {forkJoin, Observable, of} from 'rxjs';
import {DialogService} from '@rero/ng-core';
import {ToastrService} from 'ngx-toastr';
import {User} from '../../class/user';
import {UserService} from '../../service/user.service';
import {TranslateService} from '@ngx-translate/core';

export interface NoPendingChange {
    noPendingChange(): boolean | Observable<boolean>;
}

@Component({
  selector: 'admin-circulation-main-checkin-checkout',
  templateUrl: './main-checkin-checkout.component.html',
  styleUrls: ['./main-checkin-checkout.component.scss']
})
export class MainCheckinCheckoutComponent implements OnInit, NoPendingChange {

  public placeholder: string = this.translate.instant('Please enter a patron card number or an item barcode.');
  public searchText = '';
  public patron: User;
  public patronInfo: User;
  public isLoading = false;

  private loggedUser: User;
  private itemsList = [];

  public get items() {
    if (this.patron) {
      return this.patron.items;
    } else {
      return this.itemsList;
    }
  }

  private confirmConfig: object;


  constructor(
    private userService: UserService,
    private itemsService: ItemsService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private dialogService: DialogService,
    private toastService: ToastrService
    ) {
    route.queryParamMap.subscribe(
      params => {
        const barcode = params.get('patron');
        if (!this.patron || (barcode !== this.patron.barcode)) {
          this.getPatronOrItem(barcode);
        }
      }
    );
    this.confirmConfig = {
      ignoreBackdropClick: true,
      initialState: {
        title: this.translate.instant('Confirmation'),
        body: this.translate.instant('Exit without saving changes?'),
        confirmButton: true,
        confirmTitleButton: this.translate.instant('OK'),
        cancelTitleButton: this.translate.instant('Cancel')
      }
    };
  }

  ngOnInit() {
    this.loggedUser = this.userService.getCurrentUser();
  }

  searchValueUpdated(searchText: string) {
    if (!searchText) {
      return null;
    }
    this.searchText = searchText;
    if (this.patron) {
      this.getItem(searchText);
    } else {
      this.getPatronOrItem(searchText);
    }
  }

  automaticCheckinCheckout(itemBarcode) {
    this.itemsService.automaticCheckin(itemBarcode).subscribe(item => {
      // TODO: remove this when policy will be in place
      if (
        item === null ||
        item.location.organisation.pid !== this.loggedUser.library.organisation.pid
      ) {
        this.toastService.warning(this.translate.instant('Item or patron not found!'), this.translate.instant('Checkin'));
        return;
      }
      if (item.loan) {
        this.getPatronInfo(item.loan.patron_pid);
      }
      if (item.hasRequests) {
        this.toastService.warning(this.translate.instant('The item contains requests'), this.translate.instant('Checkin'));
      }
      switch (item.actionDone) {
        case ItemAction.return_missing:
          this.toastService.warning(
            this.translate.instant('The item has been returned from missing'),
            this.translate.instant('Checkin')
          );
          break;
        default:
          break;
      }
      this.itemsList.unshift(item);
      this.searchText = '';
    });
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
        this.translate.instant('No action allowed: the item belongs to another organisation.'),
        this.translate.instant('Checkin')
      );
      return false;
    }
    if (action) {
      // check if operation has allowed on this item
      if (item.actions.length === 1 && item.actions[0] === ItemAction.no) {
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
          this.translate.instant(action as unknown as string)
        );
        return false;
      }
    }
    return true;
  }

  getItem(barcode: string) {
    // check if item is already in the user items list. If yes, this is a check-in operation
    const item = this.items.find(currItem => currItem.barcode === barcode);
    if (item && this.allowActionOnItem(item)) {
      if (this.patron) {
        item.currentAction = ItemAction.checkin;
        this.searchText = '';
      } else {
        this.toastService.warning(this.translate.instant('The item is already in the list.'), this.translate.instant('Checkin'));
      }
    } else {
      this.itemsService.getItem(barcode, this.patron.pid).subscribe(
        (newItem) => {
          if (newItem === null) {
            this.toastService.warning(this.translate.instant('Item not found!'), this.translate.instant('Checkin'));
          } else {
            if (newItem.canLoan(this.patron) === false) {
              this.toastService.warning(this.translate.instant('Item is unavailable!'), this.translate.instant('Checkin'));
            } else {
              if (newItem.actions.length === 1 && newItem.actions.indexOf(ItemAction.no) > -1) {
                this.toastService.warning(this.translate.instant('No action possible on this item!'), this.translate.instant('Checkin'));
              } else {
                newItem.currentAction = ItemAction.checkout;
                this.items.unshift(newItem);
                this.searchText = '';
              }
            }
          }
        },
        (error) => this.toastService.error(
          error.message,
          this.translate.instant('Checkin')
        ), () => console.log('loan success')
      );
    }
    // If item isn't in the list, get it and try to place a checkout action on it
    this.itemsService.getItem(barcode, this.patron.pid).subscribe(
      (newItem) => {
        if (newItem.canLoan(this.patron) === false) {
          this.toastService.warning(
            this.translate.instant('Item is unavailable!'),
            this.translate.instant('Checkout')
          );
        } else if (this.allowActionOnItem(newItem, ItemAction.checkout)) {
          newItem.currentAction = ItemAction.checkout;
          this.items.unshift(newItem);
          this.searchText = '';
        }
      },
      (error) => {
        this.toastService.error(
          this.translate.instant(error.message),
          this.translate.instant('Error')
        );
      }
    );
  }

  getPatronInfo(patronPID) {
    if (patronPID) {
      this.isLoading = true;
      this.userService.getUser(patronPID).subscribe(
        (patron) => {
          this.patronInfo = patron;
          this.isLoading = false;
        },
        (error) => this.toastService.error(
          error.message,
          this.translate.instant('Checkin')
        ),
        () => console.log('patron by pid success')
      );
    } else {
      this.patronInfo = null;
    }
  }

  getPatronOrItem(barcode: string) {
    if (barcode) {
      this.isLoading = true;
      this.userService.getPatron(barcode).subscribe(
        (patron) => {
          this.isLoading = false;
          if (patron !== null && patron.organisation.pid !== this.loggedUser.library.organisation.pid) {
            this.toastService.warning(this.translate.instant('Patron not found!'), this.translate.instant('Checkin'));
            return;
          }
          if (patron === null) {
            this.placeholder = this.translate.instant('Please enter a patron card number.');
            const newItem = this.items.find(item => item.barcode === barcode);
            if (newItem) {
              this.toastService.warning(this.translate.instant('The item is already in the list.'), this.translate.instant('Checkin'));
            } else {
              this.automaticCheckinCheckout(barcode);
            }
          } else {
            this.placeholder = this.translate.instant('Please enter an item barcode.');
            let loanableItems = [];
            if (this.itemsList.length) {
              loanableItems = this.itemsList.filter(item => item.canLoan(patron));
            }
            this.patronInfo = null;
            this.patron = patron;
            if (loanableItems.length) {
              const item = loanableItems[0];
              item.currentAction = ItemAction.checkout;
              item.actionDone = undefined;
              this.patron.items.unshift(item);
            }
            this.router.navigate([], { queryParams: {
              patron: this.patron.barcode
            }});
            this.searchText = '';
          }
        },
        (error) => this.toastService.error(
          error.message,
          this.translate.instant('Checkin')
        ), () => console.log('patron success')
      );
    }
  }

  clearPatron(patron: User) {
    if (this.hasPendingActions()) {

      this.dialogService.show(this.confirmConfig).subscribe((confirm: boolean) => {
          if (confirm) {
           this.doClearPatron();
          }
      });
    } else {
      this.doClearPatron();
    }
  }

  hasPendingActions() {
    if (this.patron) {
      if (this.items.filter(item => item.currentAction !== ItemAction.no).length > 0) {
        return true;
      }
    }
    return false;
  }

  doClearPatron() {
    this.patron = null;
    this.placeholder = this.translate.instant('Please enter a patron card number or an item barcode.');
    this.searchText = '';
    this.itemsList = [];
    this.router.navigate([], { queryParams: {}});
  }

  applyItems(items: Item[]) {
    const observables = [];
    for (const item of items) {
      if (item.currentAction !== ItemAction.no) {
        observables.push(this.itemsService.doAction(item, this.patron.pid));
      }
    }
    forkJoin(observables).subscribe(
      (newItems) => {
        this.patron.items = this.patron.items.map(item => {
          const newItem = newItems.filter(currItem => currItem.pid === item.pid).pop();
          if (newItem) {
            if (newItem.status === ItemStatus.IN_TRANSIT) {
              this.toastService.success(
                this.translate.instant('The item is ') + this.translate.instant(newItem.status),
                this.translate.instant('Checkin')
              );
            } else {
              if (newItem.status === ItemStatus.AT_DESK) {
                this.toastService.success(
                  this.translate.instant('The item is ') + this.translate.instant(newItem.status),
                  this.translate.instant('Checkin')
                );
              }
            }
            return newItem;
          }
          return item;
        }).filter(item => item.status === ItemStatus.ON_LOAN);
      },
      (err) => {
        let errorMessage = '';
        if (err && err.error && err.error.status) {
            errorMessage = err.error.status;
        }
        this.toastService.error(
            this.translate.instant('An error occured on the server: ') + errorMessage,
            this.translate.instant('Checkin')
         );
      }
    );
  }

  noPendingChange(): Observable<boolean> {
    if (!this.hasPendingActions()) {
      return of(true);
    }
    return this.dialogService.show(this.confirmConfig);
  }

}
