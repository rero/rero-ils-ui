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
import { ItemsService } from '../../service/items.service';
import { PatronService } from '../../service/patron.service';
import { UserService } from '../../service/user.service';
import { Item, ItemAction, ItemNoteType, ItemStatus } from '../../class/items';

@Component({
  selector: 'admin-circulation-checkout',
  templateUrl: './checkin.component.html'
})
export class CheckinComponent implements OnInit {
  public placeholder: string = this._translate.instant(
    'Please enter a patron card number or an item barcode.'
  );
  public searchText = '';
  public patronInfo: User;
  public isLoading = false;
  currentLibraryPid: string;

  private _loggedUser: User;
  private _itemsList = [];

  public get items() {
    return this._itemsList;
  }

  /** Focus attribute of the search input */
  searchInputFocus = false;

  /** Constructor
   * @param  _userService: User Service
   * @param  _recordService: Record Service
   * @param  _itemsService: Items Service
   * @param  _router: Router
   * @param  _translate: Translate Service
   * @param  _toastService: Toastr Service
   * @param  _patronService: Patron Service
   */
  constructor(
    private _userService: UserService,
    private _recordService: RecordService,
    private _itemsService: ItemsService,
    private _router: Router,
    private _translate: TranslateService,
    private _toastService: ToastrService,
    private _patronService: PatronService,
  ) {}

  ngOnInit() {
    this._loggedUser = this._userService.getCurrentUser();
    this._patronService.currentPatron$.subscribe(
      patron => (this.patronInfo = patron)
    );
    this.searchInputFocus = true;
    this.currentLibraryPid = this._userService.getCurrentUser().getCurrentLibrary();
    this.patronInfo = null;
  }

  /** Search value with search input
   * @param searchText: value to search for (barcode)
   */
  searchValueUpdated(searchText: string) {
    if (!searchText) {
      return null;
    }
    this.searchText = searchText;
    this.getPatronOrItem(this.searchText);
  }

  /** Apply checkin and checkout automatically
   * @param itemBarcode: item barcode
   */
  checkin(itemBarcode: string) {
    this.searchInputFocus = false;
    this._itemsService.checkin(itemBarcode, this._loggedUser.getCurrentLibrary()).subscribe(item => {
      // TODO: remove this when policy will be in place
      if (
        item === null ||
        item.location.organisation.pid !==
          this._loggedUser.library.organisation.pid
      ) {
        this._toastService.error(
          this._translate.instant('Item or patron not found!'),
          this._translate.instant('Checkin')
        );
        return;
      }
      if (item.hasRequests) {
        this._toastService.warning(
          this._translate.instant('The item contains requests'),
          this._translate.instant('Checkin')
        );
      }
      switch (item.actionDone) {
        case ItemAction.return_missing:
          this._toastService.warning(
            this._translate.instant('The item has been returned from missing'),
            this._translate.instant('Checkin')
          );
          break;
        case ItemAction.checkin:
          this._displayCirculationNote(item, ItemNoteType.CHECKIN);
          if (item.action_applied.checkin) {
            this.getPatronInfo(item.action_applied.checkin.patron.barcode);
          }
          if (item.status === ItemStatus.IN_TRANSIT) {
            this._toastService.warning(
              this._translate.instant('The item is ' + ItemStatus.IN_TRANSIT),
              this._translate.instant('Checkin')
            );
          }
          break;
        default:
          break;
      }
      this._itemsList.unshift(item);
      this.searchText = '';
      this.searchInputFocus = true;
    });
  }

  /** Get patron information
   * @param barcode: item barcode
   */
  getPatronInfo(barcode: string) {
    if (barcode) {
      this.isLoading = true;
      this._patronService
        .getPatron(barcode)
        .pipe(map(patron => (patron.displayPatronMode = false)))
        .subscribe(
          () => (this.isLoading = false),
          error =>
            this._toastService.error(
              error.message,
              this._translate.instant('Checkin')
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
      this._recordService
        .getRecords('patrons', `barcode:${barcode}`, 1, 1)
        .pipe(
          map((response: any) => (response.hits.total === 0)  ? null : response.hits.hits[0].metadata)
        ).subscribe(
          patron => {
            if (
              patron !== null &&
              patron.organisation.pid !==
                this._loggedUser.library.organisation.pid
            ) {
              this._toastService.warning(
                this._translate.instant('Patron not found!'),
                this._translate.instant('Checkin')
              );
              return;
            }
            if (patron === null) {
              const newItem = this.items.find(item => item.barcode === barcode);
              if (newItem) {
                this._toastService.warning(
                  this._translate.instant('The item is already in the list.'),
                  this._translate.instant('Checkin')
                );
              } else {
                this.checkin(barcode);
              }
            } else {
              this._router.navigate(
                ['/circulation', 'patron', patron.barcode, 'loan']
              );
            }
            this.isLoading = false;
          },
          error =>
            this._toastService.error(
              error.message,
              this._translate.instant('Checkin')
            )
        );
    }
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
