/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { Component, Input, OnInit } from '@angular/core';
import { IPatron, UserService } from '@rero/shared';
import { ItemApiService } from '../../api/item-api.service';

@Component({
  selector: 'public-search-request',
  templateUrl: './request.component.html'
})
export class RequestComponent implements OnInit {

  /** Item record */
  @Input() item: any;

  /** View code */
  @Input() viewcode: string;

  /** Item Can request with reason(s) */
  canRequest: {
    can: false,
    reasons: []
  };

  /** Request dialog */
  requestDialog = false;

  /** current patron */
  private _patron: IPatron;

  /** Patron is logged */
  get patron() {
    return this._patron !== undefined;
  }

  /**
   * Constructor
   * @param _itemApiService - ItemApiService
   * @param _userService - UserService
   */
  constructor(
    private _itemApiService: ItemApiService,
    private _userService: UserService
  ) { }

  /** OnInit hook */
  ngOnInit(): void {
    if (this._userService.user) {
      this._patron = this._userService.user.getPatronByOrganisationPid(
        this.item.metadata.organisation.pid
      );
      if (this._patron) {
        this._itemApiService.canRequest(
          this.item.metadata.pid,
          this.item.metadata.library.pid,
          this._patron.patron.barcode[0],
        ).subscribe((can: any) => this.canRequest = can );
      }
    }
  }

  /** Close request dialog */
  closeDialog(): void {
    this.requestDialog = false;
  }

  /** show Request Dialog */
  showRequestDialog() {
    this.requestDialog = true;
  }
}
