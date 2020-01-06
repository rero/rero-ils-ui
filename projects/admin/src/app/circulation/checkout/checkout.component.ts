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
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService, RecordService } from '@rero/ng-core';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { User } from '../../class/user';
import { PatronService } from '../../service/patron.service';
import { UserService } from '../../service/user.service';
import { Item, ItemAction } from '../items';
import { ItemsService } from '../items.service';

@Component({
  selector: 'admin-circulation-checkout',
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
  public placeholder: string = this.translate.instant(
    'Please enter a patron card number or an item barcode.'
  );
  public searchText = '';
  public patronInfo: User;
  public isLoading = false;

  private loggedUser: User;
  private _itemsList = [];

  public get items() {
    return this._itemsList;
  }

  constructor(
    private userService: UserService,
    private recordService: RecordService,
    private itemsService: ItemsService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private dialogService: DialogService,
    private toastService: ToastrService,
    private patronService: PatronService
  ) {}

  ngOnInit() {
    this.loggedUser = this.userService.getCurrentUser();
    this.patronService.currentPatron$.subscribe(
      patron => (this.patronInfo = patron)
    );
  }

  searchValueUpdated(searchText: string) {
    if (!searchText) {
      return null;
    }
    this.searchText = searchText;
    this.getPatronOrItem(searchText);
  }

  automaticCheckinCheckout(itemBarcode) {
    // this.patronService.getItem(itemBarcode).subscribe(item => {
    //   this._itemsList.unshift(item);
    //   this.searchText = '';
    //   this.getPatronInfo(item.loan['patron'].barcode);
    // });

    // return;
    this.itemsService.automaticCheckin(itemBarcode).subscribe(item => {
      // TODO: remove this when policy will be in place
      if (
        item === null ||
        item.location.organisation.pid !==
          this.loggedUser.library.organisation.pid
      ) {
        this.toastService.warning(
          this.translate.instant('Item or patron not found!'),
          this.translate.instant('Checkin')
        );
        return;
      }
      if (item.loan) {
        this.getPatronInfo(item.loan.patron.barcode);
      }
      if (item.hasRequests) {
        this.toastService.warning(
          this.translate.instant('The item contains requests'),
          this.translate.instant('Checkin')
        );
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
      this._itemsList.unshift(item);
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
        this.translate.instant(
          'No action allowed: the item belongs to another organisation.'
        ),
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
          this.translate.instant((action as unknown) as string)
        );
        return false;
      }
    }
    return true;
  }

  getPatronInfo(barcode) {
    if (barcode) {
      this.isLoading = true;
      this.patronService
        .getPatron(barcode)
        .pipe(map(patron => (patron.displayPatronMode = false)))
        .subscribe(
          () => (this.isLoading = false),
          error =>
            this.toastService.error(
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
      this.recordService
        .getRecords('patrons', `barcode:${barcode}`, 1, 1)
        .pipe(
          map((response: any) => {
            if (response.hits.total === 0) {
              return null;
            }
            return response.hits.hits[0].metadata;
          })
        )
        .subscribe(
          patron => {
            if (
              patron !== null &&
              patron.organisation.pid !==
                this.loggedUser.library.organisation.pid
            ) {
              this.toastService.warning(
                this.translate.instant('Patron not found!'),
                this.translate.instant('Checkin')
              );
              return;
            }
            if (patron === null) {
              const newItem = this.items.find(item => item.barcode === barcode);
              if (newItem) {
                this.toastService.warning(
                  this.translate.instant('The item is already in the list.'),
                  this.translate.instant('Checkin')
                );
              } else {
                this.automaticCheckinCheckout(barcode);
              }
            } else {
              if (this._itemsList.length > 0 && this._itemsList[0].canLoan(patron)) {
                const item = this._itemsList[0];
                // candidate to checkout
                this.itemsService.getItem(item.barcode, patron.pid).subscribe(
                  itm => {
                    const queryParams: any = {};
                    // patron: 10000001
                    // 10000000020
                    // can be checked out
                    if (item.actions.some(action => action === ItemAction.checkout)) {
                      queryParams.item_barcode = item.barcode;
                    }
                    this.router.navigate(
                      ['/circulation', 'patron', patron.barcode, 'loan'],
                      { queryParams }
                    );
                  }
                );
              } else {
                this.router.navigate(
                  ['/circulation', 'patron', patron.barcode, 'loan']
                );
              }
            }
            this.isLoading = false;
          },
          error =>
            this.toastService.error(
              error.message,
              this.translate.instant('Checkin')
            )
        );
    }
  }
}
