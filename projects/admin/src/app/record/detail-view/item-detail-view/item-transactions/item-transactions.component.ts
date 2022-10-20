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
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '@rero/shared';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { LoanService } from '@app/admin/service/loan.service';
import { forkJoin } from 'rxjs';
import { first } from 'rxjs/operators';
import { ItemRequestComponent } from '../../document-detail-view/item-request/item-request.component';

@Component({
  selector: 'admin-item-transactions',
  templateUrl: './item-transactions.component.html'
})
export class ItemTransactionsComponent implements OnInit {

  // COMPONENTS ATTRIBUTES ====================================================
  /** Item record */
  @Input() itemPid: string;

  /** Informs parent component that a request has been cancelled */
  @Output() cancelRequestEvent = new EventEmitter<any>();

  /** Borrowed loan */
  borrowedBy: Array<any> = [];
  /** Requested loan(s) */
  requestedBy: Array<any> = [];


  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _loanService - LoanService
   * @param _modalService - BsModalService
   * @param _toastrService - ToastrService
   * @param _translateService - TranslateService
   * @param _userService - UserService
   */
  constructor(
    private _loanService: LoanService,
    private _modalService: BsModalService,
    private _toastrService: ToastrService,
    private _translateService: TranslateService,
    private _userService: UserService
  ) { }

  /** OnInit hook */
  ngOnInit() {
    const borrowedBy$ = this._loanService.borrowedBy$(this.itemPid);
    const requestedBy$ = this._loanService.requestedBy$(this.itemPid);
    forkJoin([borrowedBy$, requestedBy$])
      .subscribe(([borrowedLoan, requestedLoans]) => {
        this.borrowedBy = borrowedLoan;
        this.requestedBy = requestedLoans;
      });
  }

  // COMPONENTS FUNCTIONS =====================================================
  /**
   * Add request on this item
   */
  addRequest(): void {
    const modalRef = this._modalService.show(ItemRequestComponent, {
      initialState: { recordPid: this.itemPid, recordType: 'item' }
    });
    modalRef.content.onSubmit
      .pipe(first())
      .subscribe(_ => this._refreshRequestList());
  }

  /**
   * Cancel request
   * @param transaction - request to cancel
   */
  cancelRequest(transaction: any): void {
    this._loanService
      .cancelLoan(this.itemPid, transaction.metadata.pid, this._userService.user.currentLibrary)
      .subscribe((itemData: any) => {
        const status = this._translateService.instant(itemData.status);
        this._toastrService.warning(
          this._translateService.instant('The item is {{ status }}', { status }),
          this._translateService.instant('Request')
        );
        this.cancelRequestEvent.emit();
        this._refreshRequestList();
      });
  }

  /**
   * Update request pickup location
   * @param data - pickup location pid to change
   */
  updateRequestPickupLocation(data: any): void {
    this._loanService
      .updateLoanPickupLocation(data.transaction.metadata.pid, data.pickupLocationPid)
      .subscribe(_ => {
        this._toastrService.success(
          this._translateService.instant('The pickup location has been changed.'),
          this._translateService.instant('Request')
        );
        this._refreshRequestList();
      });
  }

  // PRIVATE COMPONENT FUNCTIONS ==============================================
  /**
   * Refresh the request list
   */
  private _refreshRequestList(): void {
    this._loanService
      .requestedBy$(this.itemPid)
      .subscribe(requestedLoans =>
        this.requestedBy = requestedLoans
      );
  }
}
