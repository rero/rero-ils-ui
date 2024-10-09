/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ItemsService } from '@app/admin/service/items.service';
import { LoanService } from '@app/admin/service/loan.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '@rero/shared';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'admin-item-transaction',
  templateUrl: './item-transaction.component.html'
})
export class ItemTransactionComponent implements OnInit, OnDestroy {

  private userService: UserService = inject(UserService);
  private translateService: TranslateService = inject(TranslateService);
  private itemService: ItemsService = inject(ItemsService);
  private loanService: LoanService = inject(LoanService);

  // COMPONENTS ATTRIBUTES ===============================================================
  /** Loan Record */
  @Input() transaction: any;
  /** Resource type */
  @Input() type: string;
  /** Flag for cell background */
  @Input() background: boolean;
  /** Item pid */
  @Input() itemPid: string;
  /** Informs parent component to remove request when it is cancelled */
  @Output() cancelRequestEvent = new EventEmitter<any>();
  /** Informs parent component to update pickup location */
  @Output() updatePickupLocationEvent = new EventEmitter<any>();

  /** Pickup locations of the organisation */
  pickupLocations: any;

  /** Pickup default $ref */
  private pickupDefaultValue: string;
  /** Current user */
  private currentUser: any;
  /** Pickup locations observable reference */
  private pickupLocations$: any;
  /** Authorized Transaction Type to load pickup locations */
  private authorizedTypeToLoadPickupLocations = [
    'loan_request'
  ];

  // GETTER & SETTER ======================================================================
  /**
   * Get current pickup location
   * @return pickup location name
   */
  get currentPickupLocation(): string {
    const location = this.pickupLocations.find(loc => loc.value === this.transaction.metadata.pickup_location_pid);
    if (location != null) {
      return location.label;
    }
    return this.translateService.instant('No pickup location');
  }

  /** OnInit hook */
  ngOnInit() {
    this.currentUser = this.userService.user;
    if (this.authorizedTypeToLoadPickupLocations.includes(this.type)) {
      this.pickupLocations$ = this.getPickupLocations().subscribe((pickups) => {
        this.pickupLocations = pickups;
      });
    }
  }

  /** OnDestroy hook */
  ngOnDestroy() {
    if (this.authorizedTypeToLoadPickupLocations.includes(this.type)) {
      this.pickupLocations$.unsubscribe();
    }
  }


  // COMPONENT FUNCTIONS ==================================================================
  /**
   * Check if request can be cancelled.
   * @returns true if it is possible to cancel a loan
   */
  canCancelRequest(): boolean {
    return this.loanService.canCancelRequest(this.transaction);
  }

  /**
   * Check if request pickup location can be changed.
   * @returns true if it is possible to update pickup location.
   */
  canUpdateRequestPickupLocation(): boolean {
    return this.loanService.canUpdateRequestPickupLocation(this.transaction);
  }

  /** Show a confirmation dialog box for cancel request. */
  showCancelRequestDialog(event: Event): void {
    this.loanService.cancelRequestDialog(event, () => {
      this.emitCancelRequest();
    });
  }

  /** Inform parent to cancel the request. */
  emitCancelRequest(): void {
    this.cancelRequestEvent.emit(this.transaction);
  }

  /** Inform parent to cancel the request. */
  emitUpdatePickupLocation(pickupLocationPid: string): void {
    const data = {
      pickupLocationPid,
      transaction: this.transaction
    };
    this.updatePickupLocationEvent.emit(data);
  }

  /** Get pickups by organisation pid */
  private getPickupLocations(): Observable<{label: string, value: string}> {
    const { currentLibrary } = this.currentUser;
    return this.itemService.getPickupLocations(this.itemPid).pipe(
        map(locations => locations.map((loc: any) => {
          if (this.pickupDefaultValue === undefined && loc.library.pid === currentLibrary) {
            this.pickupDefaultValue = loc.pid;
          }
          return {
            label: loc.pickup_name || loc.name,
            value: loc.pid
          };
        }))
    );
  }
}
