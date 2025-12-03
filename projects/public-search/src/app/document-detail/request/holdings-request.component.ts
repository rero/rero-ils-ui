/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { Component, EventEmitter, inject, Input, OnInit, Output, signal, computed } from '@angular/core';
import { IPatron, UserService, SharedModule } from '@rero/shared';
import { ItemApiService } from '../../api/item-api.service';
import { HoldingsApiService } from '../../api/holdings-api.service';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { PickupLocationComponent } from './pickup-location/pickup-location.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { canRequest } from '../model/can-request-model';

@Component({
    selector: 'public-search-request',
    templateUrl: './holdings-request.component.html',
    imports: [Button, Tooltip, PickupLocationComponent, TranslatePipe, SharedModule]
})
export class HoldingsRequestComponent implements OnInit {

  private itemApiService: ItemApiService = inject(ItemApiService);
  private holdingsApiService: HoldingsApiService = inject(HoldingsApiService);
  private userService: UserService = inject(UserService);
  private translateService: TranslateService = inject(TranslateService);

  /** Record: item or holding */
  @Input() record: any;

  /** Record type */
  @Input() recordType: string;

  /** View code */
  @Input() viewcode: string;

  /** Holdings item count */
  @Input() holdingsItemsCount: number;

  /** Item Can request with reason(s) */
  canRequest = signal<canRequest>({ can: false, reasons: {} });

  reasonsToDisplay = [
    "patron_type_overdue_items_limit",
    "patron_type_fee_amount_limit",
    "patron_type_unpaid_subscription",
    "patron_type_request_limits"
  ]

  allReasonsDisplayable = computed(() =>
    this.canRequest().reasons &&
    Object.keys(this.canRequest().reasons).every(key => this.reasonsToDisplay.includes(key))
  );

  hiddenRequestButton = computed(() => this.canRequest().can || this.allReasonsDisplayable());

  tooltip = computed(() => Object.values(this.canRequest().reasons || {}).map(
    (reason: string) => "- " + this.translateService.instant(reason)
  ).join('\n'));

  /** Request dialog */
  requestDialog = false;

  /** Request dialog event */
  @Output() requestDialogEvent = new EventEmitter<boolean>();

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
        ).subscribe((can: canRequest) => this.canRequest.set(can));
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
