/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { CONFIG, Record, RecordService } from '@rero/ng-core';
import { ItemStatus, User, UserService } from '@rero/shared';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item, ItemAction, ItemNoteType } from '../../classes/items';
import { ItemsService } from '../../service/items.service';
import { PatronService } from '../../service/patron.service';
import { CheckinActionComponent } from './checkin-action/checkin-action.component';

@Component({
  selector: 'admin-circulation-checkout',
  templateUrl: './checkin.component.html'
})
export class CheckinComponent implements OnInit {

  private messageService: MessageService = inject(MessageService);
  private dialogService: DialogService = inject(DialogService);
  private userService: UserService = inject(UserService);
  private recordService: RecordService = inject(RecordService);
  private itemsService: ItemsService = inject(ItemsService);
  private router: Router = inject(Router);
  private translate: TranslateService = inject(TranslateService);
  private patronService: PatronService = inject(PatronService);

  public placeholder = _('Please enter a patron card number or an item barcode.');
  public searchText = '';
  public patronInfo: User;
  public barcode: string;
  currentLibraryPid: string;

  private loggedUser: User;

  items = [];

  /** Focus attribute of the search input */
  searchInputFocus = true;

  /** Disabled attribute of the search input */
  searchInputDisabled = false;

  /** current called item */
  private item: any;

  ngOnInit() {
    this.loggedUser = this.userService.user;
    this.patronService.currentPatron$.subscribe(
      patron => this.patronInfo = patron
    );
    this.currentLibraryPid = this.loggedUser.currentLibrary;
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

  /** Apply check-in and checkout automatically
   * @param itemBarcode: item barcode
   */
  checkin(itemBarcode: string) {
    this.searchInputFocus = false;
    this.searchInputDisabled = true;
    this.itemsService.checkin(itemBarcode, this.loggedUser.currentLibrary).subscribe({
      next: (item) => {
        // TODO: remove this when policy will be in place
        if (item === null || item.location.organisation.pid !== this.loggedUser.currentOrganisation) {
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('Checkin'),
            detail: this.translate.instant('Item or patron not found!'),
            sticky: true,
            closable: true
          });
          this._resetSearchInput();
          return;
        }
        if (item.hasRequests) {
          this.messageService.add({
            severity: 'warn',
            summary: this.translate.instant('Checkin'),
            detail: this.translate.instant('The item contains requests'),
            life: CONFIG.MESSAGE_LIFE
          });
        }
        switch (item.actionDone) {
          case ItemAction.return_missing:
            this.messageService.add({
              severity: 'warn',
              summary: this.translate.instant('Checkin'),
              detail: this.translate.instant('The item has been returned from missing'),
              life: CONFIG.MESSAGE_LIFE
            });
            break;
          case ItemAction.checkin:
            this.displayCirculationInformation(item, ItemNoteType.CHECKIN);
            if (item.action_applied && item.action_applied.checkin) {
              this.getPatronInfo(item.action_applied.checkin.patron.barcode);
            }
            if (item.status === ItemStatus.IN_TRANSIT) {
              const destination = item.loan.item_destination.library_name;
              this.messageService.add({
                severity: 'warn',
                summary: this.translate.instant('Checkin'),
                detail: this.translate.instant('The item is in transit to {{ destination }}', {destination}),
                life: CONFIG.MESSAGE_LIFE
              });
            }
            break;
          case ItemAction.receive:
            if (item.library.pid === this.userService.user.currentLibrary) {
              this.displayCirculationInformation(item, ItemNoteType.CHECKIN);
            }
            break;
        }
        this.items.unshift(item);
        this._resetSearchInput();
      },
      error: (error) => {
        if (this.item && this.items.findIndex(i => i.barcode === this.item.barcode) === -1) {
          // Reload item to have data up to date.
          this.itemsService.getItem(this.item.barcode).subscribe((item: any) => {
            delete item.actions;
            if (!item.notes) {
              item.notes = [];
            }
            item.notes.push({
              content: error.error.status.replace(/^error:/, '').trim(),
              type: ItemNoteType.API
            });
            this.items.unshift(item);
            // If no action could be done by the '/item/checkin' api, an error will be raised.
            // catch this error to display it as a Toast message.
            this._checkinErrorManagement(error, item);
          });
        }
      }
    });
  }

  /**
   * Get patron information
   * @param barcode: item barcode
   */
  getPatronInfo(barcode: string) {
    if (barcode) {
      this.barcode = barcode;
      this.patronService
        .getPatron(barcode)
        .subscribe({
          error: (error) => this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('Checkin'),
            detail: error.message,
            sticky: true,
            closable: true
          })
      });
    } else {
      this.patronInfo = null;
      this.barcode = null;
    }
  }

  /** Get patron or item when entering a barcode
   * @param barcode: item or patron barcode
   */
  getPatronOrItem(barcode: string) {
    this.item = undefined;
    const loggerOrg = this.loggedUser.currentOrganisation;
    const query = `patron.barcode:${barcode} AND organisation.pid:${loggerOrg}`;
    const patronQuery = this.recordService
      .getRecords('patrons', query, 1, 1, [])
      .pipe(map((result: Record) => result.hits));
    const itemQuery = this.recordService
      .getRecords('items', `barcode:${barcode}`, 1, 1, [])
      .pipe(map((result: Record) => result.hits));
    forkJoin([patronQuery, itemQuery])
    .subscribe({
      next: ([patron, item]: any[]) => {
        if (patron.total.value === 0 && item.total.value === 0) {
          this.messageService.add({
            severity: 'warn',
            summary: this.translate.instant('Checkin'),
            detail: this.translate.instant('Patron not found!'),
            life: CONFIG.MESSAGE_LIFE
          });
        }
        if (patron.total.value > 1 && item.total.value === 0) {
          this.messageService.add({
            severity: 'warn',
            summary: this.translate.instant('Checkin'),
            detail: this.translate.instant('Found more than one patron.'),
            life: CONFIG.MESSAGE_LIFE
          });
        }
        if (patron.total.value === 1 && item.total.value === 1) {
          const ref: DynamicDialogRef = this.dialogService.open(CheckinActionComponent, {
            header: this.translate.instant('Circulation action'),
            width: '50vw',
          })
          ref.onClose.subscribe((action: string) => {
            if (action) {
              switch (action) {
                case 'patron':
                  this.router.navigate(
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
            }
          });
        } else if (item.total.value === 1) {
            this.item = item.hits[0].metadata;
            // Check if the item is already into the item list. If it happens,
            // just notify the user and clear the form.
            if (this.items.find(it => it.barcode === barcode)) {
              this.messageService.add({
                severity: 'warn',
                summary: this.translate.instant('Checkin'),
                detail: this.translate.instant('The item is already in the list.'),
                life: CONFIG.MESSAGE_LIFE
              });
              this._resetSearchInput();
            } else {
              this.checkin(barcode);
            }
        } else if (patron.total.value === 1) {
            this.router.navigate(
              ['/circulation', 'patron', barcode, 'loan']
            );
        }
      },
      error: (error) => this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('Checkin'),
        detail: error.message,
        sticky: true,
        closable: true
      })
    });
  }

  /** display a circulation infos about an item as a permanent Toast message
   * @param item: the item
   * @param noteType: the note type to display
   */
  private displayCirculationInformation(item: Item, noteType: ItemNoteType): void {
    let message = [];
    const note = item.getNote(noteType);
    if (note != null) {
      message.push(note.content);
    }
    // Show additional message only for the owning library
    if (item.library.pid === this.userService.user.currentLibrary) {
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
        summary: this.translate.instant('Checkin'),
        detail: message.join(),
        life: CONFIG.MESSAGE_LIFE
      });
    }
  }


  /** create the most relevant message concerning a checkin operation error and display it as a Toast
   *
   * @param error: the raised error
   * @param item: the current item
   */
  private _checkinErrorManagement(error: any, item: Item) {
    // get the error message from the raised error. This will be the Toast message core.
    let message = (error.hasOwnProperty('error') && error.error.hasOwnProperty('status'))
      ? error.error.status.replace(/^error:/, '').trim()
      : error.message;
    message = this.translate.instant(message);
    message += `<br/>${this.translate.instant('Status')}: ${this.translate.instant(item.status.toString())}`;
    if (item.status === ItemStatus.IN_TRANSIT && item.loan && item.loan.item_destination) {
      const { library_name } = item.loan.item_destination;
      message += ` (${this.translate.instant('to')} ${library_name})`;
    }
    const checkinNote = item.getNote(ItemNoteType.CHECKIN);
    if (checkinNote) {
      message += `<br/>${this.translate.instant('Note')}: ${checkinNote.content}`
    }
    // Show additional message only for the owning library
    if (item.library.pid === this.userService.user.currentLibrary) {
      const additionalMessage = this.displayCollectionsAndTemporaryLocation(item);
      if (additionalMessage.length > 0) {
        message += `<br />${additionalMessage}`;
      }
    }
    this.messageService.add({
      severity: 'warn',
      summary: this.translate.instant('Checkin'),
      detail: message,
      life: CONFIG.MESSAGE_LIFE
    });
    this._resetSearchInput();
  }

  private displayCollectionsAndTemporaryLocation(item: Item): string {
    let message = [];
    if (item.collections && item.collections.length > 0) {
      message.push(`${this.translate.instant('This item is in exhibition/course')} "${item.collections[0]}"`);
      if (item.collections.length > 1) {
        message.push(` ${this.translate.instant('and {{ count }} other(s)', { count: item.collections.length - 1 })}`);
      }
      message.push('.');
    }
    if (item.temporary_location) {
      message.push(`<br/>${this.translate.instant('This item is in temporary location')} "${item.temporary_location.name}".`);
    }

    return message.join('');
  }

  hasFees(event: boolean) {
    if (event) {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('Checkin'),
        detail: this.translate.instant('The item has fees'),
        sticky: true,
        closable: true
      });
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
