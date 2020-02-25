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
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { User } from '../../class/user';
import { PatronService } from '../../service/patron.service';
import { UserService } from '../../service/user.service';
import { Item, ItemAction } from '../items';
import { ItemsService } from '../items.service';
import { LibrarySwitchService } from '../../service/library-switch.service';

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

  /** Focus attribute of the search input */
  searchInputFocus = false;

  /** Constructor
   * @param  userService: User Service
   * @param  recordService: Record Service
   * @param  itemsService: Items Service
   * @param  router: Router
   * @param  translate: Translate Service
   * @param  toastService: Toastr Service
   * @param  patronService: Patron Service
   * @param librarySwitchService: LibrarySwitchService
   */
  constructor(
    private userService: UserService,
    private recordService: RecordService,
    private itemsService: ItemsService,
    private router: Router,
    private translate: TranslateService,
    private toastService: ToastrService,
    private patronService: PatronService,
    private librarySwitchService: LibrarySwitchService
  ) {}

  ngOnInit() {
    this.loggedUser = this.userService.getCurrentUser();
    this.patronService.currentPatron$.subscribe(
      patron => (this.patronInfo = patron)
    );
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
    this.getPatronOrItem(searchText);
  }

  /** Apply checkin and checkout automatically
   * @param itemBarcode: item barcode
   */
  automaticCheckinCheckout(itemBarcode) {
    this.searchInputFocus = false;
    this.itemsService.automaticCheckin(itemBarcode, this.librarySwitchService.currentLibrary.pid).subscribe(item => {
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
      this.searchInputFocus = true;
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

  /** Get patron information
   * @param barcode: item barcode
   */
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

  /** Get patron or item when entering a barcode
   * @param barcode: item or patron barcode
   */
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
              this.router.navigate(
                ['/circulation', 'patron', patron.barcode, 'loan']
              );
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
  hasFees(event: boolean) {
    if (event) {
      this.toastService.error(
        this.translate.instant('The item has fees'),
        this.translate.instant('Checkin')
      );
    }
  }
}
