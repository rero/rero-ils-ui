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
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DialogService, RecordService } from '@rero/ng-core';
import { ToastrService } from 'ngx-toastr';
import { LoanState } from 'projects/admin/src/app/circulation/items';
import { LoanService } from 'projects/admin/src/app/service/loan.service';
import { UserService } from 'projects/admin/src/app/service/user.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'admin-item-transaction',
  templateUrl: './item-transaction.component.html'
})
export class ItemTransactionComponent implements OnInit, OnDestroy {
  /**
   * Loan Record
   */
  @Input() transaction: any;

  /**
   * Ressource type
   */
  @Input() type: string;

  /**
   * Flag for cell background
   */
  @Input() background: boolean;

  /**
   * Item pid
   */
  @Input() itemPid: string;

  /**
   * Current item loans
   */
  loans$: Observable<any>;

  /**
   * Pickup locations of the organisation
   */
  pickupLocations: any;

  /**
   * Pickup default $ref
   */
  private _pickupDefaultValue: string;

  /**
   * Current user
   */
  private _currentUser: any;

  /**
   * Pickup locations observable reference
   */
  private _pickupLocations$: any;

  /**
   * Informs parent component to remove request when it is cancelled
   */
  @Output() removeRequest = new EventEmitter<boolean>();

  /**
   * On init hook
   */
  ngOnInit() {
    this._currentUser = this._userService.getCurrentUser();
    this._pickupLocations$ = this.getPickupLocations().subscribe((pickups) => {
      this.pickupLocations = pickups;
    });
  }

  /**
   * On destroy hook
   */
  ngOnDestroy() {
    this._pickupLocations$.unsubscribe();
  }

  /**
   * constructor
   * @param _loanService - LoanService
   * @param _recordService - RecordService
   * @param _userService - User service
   * @param _toastrService - ToastrService,
   * @param _translateService - TranslateService
   */
  constructor(
    private _loanService: LoanService,
    private _recordService: RecordService,
    private _userService: UserService,
    private _toastrService: ToastrService,
    private _translateService: TranslateService,
    private _dialogService: DialogService
  ) {}

  /**
   * Check if request can be cancelled
   * @return: true or false
   */
  canCancelRequest(): boolean {
    // TODO: manage more complex cases according to specifications (when implemented in backend or invenio-circulation)
    return this.transaction.metadata.state === LoanState.PENDING;
  }

  /**
   * Check if request pickup location can be chenged
   * @return: true or false
   */
  canUpdateRequestPickupLocation(): boolean {
    // for now request pickup location update allowed for pending requests only
    // TODO: manage case 'at desk' and 'in transit' (needs PO feedback)
    return this.transaction.metadata.state === LoanState.PENDING;
  }

  /**
   * Show a confirmation dialog box for cancel request.
   */
  showCancelRequestDialog() {
    const config = {
      ignoreBackdropClick: true,
      initialState: {
        title: this._translateService.instant('Cancel request'),
        body: this._translateService.instant('Cancel request') + ' ?',
        confirmButton: true,
        cancelTitleButton: this._translateService.instant('No'),
        confirmTitleButton: this._translateService.instant('Yes')
      }
    };

    this._dialogService.show(config).subscribe((confirm: boolean) => {
      if (confirm) {
        this.cancelRequest();
      }
    });
  }

  /**
   * Cancel request
   */
  cancelRequest() {
    this._loanService
      .cancelLoan(
        this.itemPid,
        this.transaction.metadata.pid,
        this.transaction.metadata.transaction_location_pid
      )
      .subscribe((itemData: any) => {
        this.removeRequest.emit(true);
      });
  }

  /**
   * Update pickup location
   * @param pickupLocationPid - pickup location pid to change
   */
  updateRequest(pickupLocationPid: string) {
    this._loanService
      .updateLoanPickupLocation(
        this.transaction.metadata.pid,
        pickupLocationPid,
        this.itemPid
      )
      .subscribe(() => {
        this._toastrService.success(
          this._translateService.instant('Record Updated!'),
          this._translateService.instant('Request')
        );
      });
  }

  /**
   * Get pickups by organisation pid
   * @param organisationPid - string
   * @return observable
   */
  private getPickupLocations() {
    const currentLibrary = this._currentUser.currentLibrary;
    const organisationPid = this._currentUser.library.organisation.pid;
    const query = `is_pickup:true AND organisation.pid:${organisationPid}`;
    return this._recordService
      .getRecords(
        'locations',
        query,
        1,
        RecordService.MAX_REST_RESULTS_SIZE,
        undefined,
        undefined,
        undefined,
        'pickup_name'
      )
      .pipe(
        map((result) => (result.hits.total === 0 ? [] : result.hits.hits)),
        map((results) => results.map((result: any) => result.metadata)),
        map((results) =>
          results.map((result: any) => {
            if (
              this._pickupDefaultValue === undefined &&
              result.library.pid === currentLibrary
            ) {
              this._pickupDefaultValue = result.pid;
            }
            return {
              label: result.pickup_name,
              value: result.pid,
            };
          })
        )
      );
  }
}
