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
import { UserService } from '../../service/user.service';
import { ItemsService } from '../items.service';


@Component({
  selector: 'admin-circulation-main-request',
  templateUrl: './main-request.component.html',
  styleUrls: ['./main-request.component.scss']
})
export class MainRequestComponent implements OnInit {

  public placeholder: string = this.translate.instant('Please enter an item barcode.');
  public searchText = '';
  public items: any[] = null;
  private libraryPid: string;
  public isLoading = false;

  /** Focus attribute of the search input */
  searchInputFocus = false;

  /** Constructor
   * @param  userService: User Service
   * @param  itemsService: Items Service
   * @param  translate: Translate Service
   * @param  toastService: Toastr Service
   */
  constructor(
    private userService: UserService,
    private itemsService: ItemsService,
    private translate: TranslateService,
    private toastService: ToastrService,
  ) {}

  ngOnInit() {
    const user = this.userService.getCurrentUser();
    if (user) {
      this.libraryPid = user.getCurrentLibrary();
      this.items = null;
      this.getRequestedLoans();
    }
    this.searchInputFocus = true;
  }

  getRequestedLoans() {
    this.isLoading = true;
    this.itemsService.getRequestedLoans(this.libraryPid).subscribe(items => {
      this.items = items;
      this.isLoading = false;
    });
  }

  searchValueUpdated(searchText: string) {
    if (! searchText) {
      return null;
    }
    this.searchText = searchText;
    const item = this.items.find(currItem => currItem.barcode === searchText);
    if (item === undefined) {
      this.toastService.warning(
        this.translate.instant('No request corresponding to the given item has been found.'),
        this.translate.instant('request')
      );
    } else {
      const items = this.items;
      this.items = null;
      this.itemsService.doValidateRequest(item, this.libraryPid).subscribe(
        newItem => {
          this.items = items.map(currItem => {
            if (currItem.pid === newItem.pid) {
              return newItem;
            }
            return currItem;
          });
          this.toastService.warning(
            this.translate.instant('The item is ') + this.translate.instant(newItem.status),
            this.translate.instant('request')
          );
          this.searchText = '';
        }
      );
    }
    this.searchInputFocus = true;
  }
}
