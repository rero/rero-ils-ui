/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IPatron, UserService } from '@rero/shared';
import { ItemApiService } from '../../api/item-api.service';
import { HoldingsApiService } from '../../api/holdings-api.service';

@Component({
  selector: 'public-search-request',
  templateUrl: './request.component.html'
})
export class RequestComponent implements OnInit {

  private itemApiService: ItemApiService = inject(ItemApiService);
  private holdingsApiService: HoldingsApiService = inject(HoldingsApiService);
  private userService: UserService = inject(UserService);

  /** Record: item or holding */
  @Input() record: any;

  /** Record type */
  @Input() recordType: string;

  /** View code */
  @Input() viewcode: string;

  /** Holdings item count */
  @Input() holdingsItemsCount: number;

  /** Item Can request with reason(s) */
  canRequest: {
    can: false,
    reasons: []
  };

  /** Request dialog */
  requestDialog = false;

  /** Request dialog event */
  @Output() requestDialogEvent = new EventEmitter<any>();

  /** current patron */
  private _patron: IPatron;

  /** Patron is logged */
  get patron() {
    return this._patron !== undefined;
  }

  /** OnInit hook */
  ngOnInit(): void {
    let apiRequest = null;
    switch (this.recordType) {
        case 'holding': { apiRequest = this.holdingsApiService; break; }
        case 'item': { apiRequest = this.itemApiService; break; }
        default: throw new TypeError(`${this.recordType} isn't supported`);
    }

    if (this.userService.user && this.record) {
      this._patron = this.userService.user.getPatronByOrganisationPid(
        this.record.metadata.organisation.pid
      );
      if (this._patron?.patron) {
        apiRequest.canRequest(
          this.record.metadata.pid,
          this.record.metadata.library.pid,
          this._patron.patron.barcode[0],
        ).subscribe((can: any) => this.canRequest = can);
      }
    }
  }

  /** Close request dialog */
  closeDialog(): void {
    this.requestDialog = false;
    this.requestDialogEvent.emit(this.requestDialog);
  }

  /** show Request Dialog */
  showRequestDialog() {
    this.requestDialog = true;
    this.requestDialogEvent.emit(this.requestDialog);
  }
}
