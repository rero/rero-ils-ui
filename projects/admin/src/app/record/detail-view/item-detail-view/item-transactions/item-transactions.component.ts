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
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { LoanService } from '@app/admin/service/loan.service';
import { NgCoreTranslateService } from '@rero/ng-core';
import { IPermissions, PERMISSIONS, UserService } from '@rero/shared';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { forkJoin, Subscription } from 'rxjs';
import { ItemRequestComponent } from '../../document-detail-view/item-request/item-request.component';

@Component({
  selector: 'admin-item-transactions',
  templateUrl: './item-transactions.component.html'
})
export class ItemTransactionsComponent implements OnInit, OnDestroy {

  private messageService = inject(MessageService);
  private dialogService: DialogService = inject(DialogService);
  private loanService: LoanService = inject(LoanService);
  private translateService: NgCoreTranslateService = inject(NgCoreTranslateService);
  private userService: UserService = inject(UserService);

  // COMPONENTS ATTRIBUTES ====================================================
  /** Item record */
  @Input() itemPid: string;

  /** Informs parent component that a request has been cancelled */
  @Output() requestEvent = new EventEmitter<any>();

  /** Borrowed loan */
  borrowedBy: Array<any> = [];
  /** Requested loan(s) */
  requestedBy: Array<any> = [];

  /** return all permissions */
  permissions: IPermissions = PERMISSIONS;

  private subscription = new Subscription();

  // HOOKS ======================================================

  /** OnInit hook */
  ngOnInit() {
    const borrowedBy$ = this.loanService.borrowedBy$(this.itemPid);
    const requestedBy$ = this.loanService.requestedBy$(this.itemPid);
    forkJoin([borrowedBy$, requestedBy$])
      .subscribe(([borrowedLoan, requestedLoans]) => {
        this.borrowedBy = borrowedLoan;
        this.requestedBy = requestedLoans;
      });
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }

  // COMPONENTS FUNCTIONS =====================================================
  /**
   * Add request on this item
   */
  addRequest(): void {
    const ref = this.dialogService.open(ItemRequestComponent, {
      data: { recordPid: this.itemPid, recordType: 'item' }
    });
    this.subscription.add(
      ref.onClose.subscribe((value: boolean) => {
        if (value) {
          this.requestEvent.emit();
          this._refreshRequestList();
        }
      })
    );
  }

  /**
   * Cancel request
   * @param transaction - request to cancel
   */
  cancelRequest(transaction: any): void {
    this.loanService
      .cancelLoan(this.itemPid, transaction.metadata.pid, this.userService.user.currentLibrary)
      .subscribe((itemData: any) => {
        this.messageService.add({
          severity: 'warn',
          summary: this.translateService.instant('Request'),
          detail: this.translateService.instant('The pending request has been cancelled.')
        });
        this.requestEvent.emit();
        this._refreshRequestList();
      });
  }

  /**
   * Update request pickup location
   * @param data - pickup location pid to change
   */
  updateRequestPickupLocation(data: any): void {
    this.loanService
      .updateLoanPickupLocation(data.transaction.metadata.pid, data.pickupLocationPid)
      .subscribe(_ => {
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('Request'),
          detail: this.translateService.instant('The pickup location has been changed.')
        });
        this._refreshRequestList();
      });
  }

  // PRIVATE COMPONENT FUNCTIONS ==============================================
  /**
   * Refresh the request list
   */
  private _refreshRequestList(): void {
    this.loanService
      .requestedBy$(this.itemPid)
      .subscribe(requestedLoans =>
        this.requestedBy = requestedLoans
      );
  }
}
