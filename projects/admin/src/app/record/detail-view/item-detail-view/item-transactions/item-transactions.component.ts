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
import { LoanService } from 'projects/admin/src/app/service/loan.service';
import { forkJoin } from 'rxjs';
import { first } from 'rxjs/operators';
import { ItemRequestComponent } from '../../document-detail-view/item-request/item-request.component';

@Component({
  selector: 'admin-item-transactions',
  templateUrl: './item-transactions.component.html'
})
export class ItemTransactionsComponent implements OnInit {

  /** Item record */
  @Input() item: any;

  /**
   * Informs parent component that a request has been cancelled
   */
  @Output() cancelRequestEvent = new EventEmitter<any>();

  /** Borrowed loan */
  borrowedBy: Array<any> = [];

  /** Requested loan(s) */
  requestedBy: Array<any> = [];

  /**
   * Current user
   */
  private _currentUser: any;

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

  /**
   * On init hook
   */
  ngOnInit() {
    this._currentUser = this._userService.user;
    const borrowedBy$ = this._loanService.borrowedBy$(this.item.metadata.pid);
    const requestedBy$ = this._loanService.requestedBy$(this.item.metadata.pid);
    forkJoin([borrowedBy$, requestedBy$]).subscribe(
      ([borrowedLoan, requestedLoans]) => {
        this.borrowedBy = borrowedLoan;
        this.requestedBy = requestedLoans;
      }
    );
  }

  /**
   * Delete a request from the request list
   * @param deletedRequest: The deletedRequest
   */
  deleteRequest(deletedRequest: any) {
    this.requestedBy = this.requestedBy.filter(request => request.id !== deletedRequest.id);
  }

  /**
   * Add request on this item
   */
  addRequest() {
    const modalRef = this._modalService.show(ItemRequestComponent, {
      initialState: { recordPid: this.item.metadata.pid }
    });
    modalRef.content.onSubmit.pipe(first()).subscribe(value => {
      this._loanService.requestedBy$(this.item.metadata.pid).subscribe(data => this.requestedBy = data);
    });
  }

  /**
   * Cancel request
   * @param transaction - request to cancel
   */
  cancelRequest(transaction: any) {
    this._loanService
      .cancelLoan(
        this.item.pid,
        transaction.metadata.pid,
        this._currentUser.currentLibrary
      )
      .subscribe((itemData: any) => {
        const status = this._translateService.instant(itemData.status);
        this._toastrService.warning(
          this._translateService.instant('The item is {{ status }}', { status }),
          this._translateService.instant('Request')
        );
        this.cancelRequestEvent.emit();
        this.updateRequestList();
      });
  }

  /**
   * Update request pickup location
   * @param pickupLocationPid - pickup location pid to change
   */
  updateRequestPickupLocation(data: any) {
    this._loanService
      .updateLoanPickupLocation(
        data.transaction.metadata.pid,
        data.pickupLocationPid
      )
      .subscribe((response: any) => {
        this._toastrService.success(
          this._translateService.instant('The pickup location has been changed.'),
          this._translateService.instant('Request')
        );
        this.updateRequestList();
      });
  }

  /**
   * Update request list
   */
  updateRequestList() {
    this._loanService.requestedBy$(this.item.metadata.pid).subscribe(requestedLoans =>
      this.requestedBy = requestedLoans
    );
  }
}
