/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { Record, RecordService } from '@rero/ng-core';
import { ItemStatus, User, UserService } from '@rero/shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Item, ItemAction, ItemNoteType } from '../../classes/items';
import { ItemsService } from '../../service/items.service';
import { PatronService } from '../../service/patron.service';
import { CheckinActionComponent } from './checkin-action/checkin-action.component';

@Component({
  selector: 'admin-circulation-checkout',
  templateUrl: './checkin.component.html'
})
export class CheckinComponent implements OnInit {
  public placeholder = _('Please enter a patron card number or an item barcode.');
  public searchText = '';
  public patronInfo: User;
  public barcode: string;
  currentLibraryPid: string;

  private _loggedUser: User;

  items = [];

  /** Focus attribute of the search input */
  searchInputFocus = true;

  /** Disabled attribute of the search input */
  searchInputDisabled = false;

  /** Constructor
   * @param _userService: UserService
   * @param _recordService: RecordService
   * @param _itemsService: ItemsService
   * @param _router: Router
   * @param _translate: TranslateService
   * @param _toastService: ToastrService
   * @param _patronService: PatronService
   * @param _modalService: BsModalService
   */
  constructor(
    private _userService: UserService,
    private _recordService: RecordService,
    private _itemsService: ItemsService,
    private _router: Router,
    private _translate: TranslateService,
    private _toastService: ToastrService,
    private _patronService: PatronService,
    private _modalService: BsModalService
  ) {}

  ngOnInit() {
    this._loggedUser = this._userService.user;
    this._patronService.currentPatron$.subscribe(
      patron => this.patronInfo = patron
    );
    this.currentLibraryPid = this._loggedUser.currentLibrary;
    this.patronInfo = null;
    this.barcode = null;
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
    this.searchInputDisabled = true;
    this._itemsService.checkin(itemBarcode, this._loggedUser.currentLibrary).subscribe(
      item => {
        // TODO: remove this when policy will be in place
        if (item === null || item.location.organisation.pid !== this._loggedUser.currentOrganisation) {
          this._toastService.error(
            this._translate.instant('Item or patron not found!'),
            this._translate.instant('Checkin')
          );
          this._resetSearchInput();
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
            if (item.action_applied && item.action_applied.checkin) {
              this.getPatronInfo(item.action_applied.checkin.patron.barcode[0]);
            }
            if (item.status === ItemStatus.IN_TRANSIT) {
              this._toastService.warning(
                this._translate.instant('The item is ' + ItemStatus.IN_TRANSIT),
                this._translate.instant('Checkin')
              );
            }
            break;
        }
        this.items.unshift(item);
        this._resetSearchInput();
      },
      error => {
        // If no action could be done by the '/item/checkin' api, an error will be raised.
        // catch this error to display it as a toastr message.
        this._checkinErrorManagement(error, itemBarcode);
      }
    );
  }

  /**
   * Get patron information
   * @param barcode: item barcode
   */
  getPatronInfo(barcode: string) {
    if (barcode) {
      this.barcode = barcode;
      this._patronService
        .getPatron(barcode)
        .subscribe(
          () => {},
          (error) => {
            this._toastService.error(
              error.message,
              this._translate.instant('Checkin')
            );
          }
        );
    } else {
      this.patronInfo = null;
      this.barcode = null;
    }
  }

  /** Get patron or item when entering a barcode
   * @param barcode: item or patron barcode
   */
  getPatronOrItem(barcode: string) {
    const loggerOrg = this._loggedUser.currentOrganisation;
    const query = `patron.barcode:${barcode} AND organisation.pid:${loggerOrg}`;
    const patronQuery = this._recordService
      .getRecords('patrons', query, 1, 1, [])
      .pipe(map((result: Record) => result.hits));
    const itemQuery = this._recordService
      .getRecords('items', `barcode:${barcode}`, 1, 1, [])
      .pipe(map((result: Record) => result.hits));
    forkJoin([patronQuery, itemQuery])
    .subscribe(([patron, item]: any[]) => {
      if (patron.total.value === 0 && item.total.value === 0) {
        this._toastService.warning(
          this._translate.instant('Patron not found!'),
          this._translate.instant('Checkin')
        );
      }
      if (patron.total.value > 1 && item.total.value === 0) {
        this._toastService.warning(
          this._translate.instant('Found more than one patron.'),
          this._translate.instant('Checkin')
        );
      }
      if (patron.total.value === 1 && item.total.value === 1) {
        const modalRef: BsModalRef = this._modalService.show(CheckinActionComponent, {
          ignoreBackdropClick: true,
          keyboard: true
        });
        modalRef.onHidden.subscribe(() => {
          switch (modalRef.content.action) {
            case 'patron':
              this._router.navigate(
                ['/circulation', 'patron', barcode, 'loan']
              );
              break;
            case 'item':
              this.checkin(barcode);
              break;
            default:
              this._resetSearchInput();
              break;
          }
        });
      } else if (item.total.value === 1) {
          // Check if the item is already into the item list. If it happens,
          // just notify the user and clear the form.
          if (this.items.find(it => it.barcode === barcode)) {
            this._toastService.warning(
              this._translate.instant('The item is already in the list.'),
              this._translate.instant('Checkin')
            );
            this._resetSearchInput();
          } else {
            this.checkin(barcode);
          }
      } else if (patron.total.value === 1) {
          this._router.navigate(
            ['/circulation', 'patron', barcode, 'loan']
          );
      }
    },
    error => this._toastService.error(
        error.message,
        this._translate.instant('Checkin')
      )
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


  /** create the most relevant message concerning a checkin operation error and display it as a toastr
   *
   * @param error: the raised error
   * @param barcode: the item barcode searched
   */
  private _checkinErrorManagement(error: any, barcode: string) {
    // get the error message from the raised error. This will be the toastr message core.
    let message = (error.hasOwnProperty('error') && error.error.hasOwnProperty('status'))
      ? error.error.status.replace(/^error:/, '').trim()
      : error.message;
    message = this._translate.instant(message);

    // the message could contains some data information from the item. So we need to load the item
    this._itemsService.getItem(barcode).pipe(
      finalize(() => {
        this._toastService.warning(
          this._translate.instant(message),
          this._translate.instant('Checkin'),
          { enableHtml: true }
        );
        this._resetSearchInput();
      })
    ).subscribe(
      item => {
        message += `<br/>${this._translate.instant('Status')}: ${this._translate.instant(item.status.toString())}`;
        if (item.status === ItemStatus.IN_TRANSIT && item.loan && item.loan.item_destination) {
          const library_name = item.loan.item_destination.library_name;
          message += ` (${this._translate.instant('to')} ${library_name})`;
          this.items.unshift(item); // Display item info
        }
      },
      () => {
        message += '<br/>' + this._translate.instant('Item not found!');
      }
    );
  }

  hasFees(event: boolean) {
    if (event) {
      this._toastService.error(
        this._translate.instant('The item has fees'),
        this._translate.instant('Checkin')
      );
    }
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
