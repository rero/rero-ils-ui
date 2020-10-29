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
import { Component, Input, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LoanService } from 'projects/admin/src/app/service/loan.service';
import { forkJoin } from 'rxjs';
import { first } from 'rxjs/operators';
import { ItemRequestComponent } from '../../document-detail-view/item-request/item-request.component';

@Component({
  selector: 'admin-item-transactions',
  templateUrl: './item-transactions.component.html',
  styles: []
})
export class ItemTransactionsComponent implements OnInit {

  /** Item record */
  @Input() item: any;

  /** Borrowed loan */
  borrowedBy: Array<any> = [];

  /** Requested loan(s) */
  requestedBy: Array<any> = [];

  /**
   * Constructor
   * @param _loanService - LoanService
   * @param _modalService - BsModalService
   */
  constructor(
    private _loanService: LoanService,
    private _modalService: BsModalService
  ) { }

  /**
   * On init hook
   */
  ngOnInit() {
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
      initialState: { itemPid: this.item.metadata.pid }
    });
    modalRef.content.onSubmit.pipe(first()).subscribe(value => {
      this._loanService.requestedBy$(this.item.metadata.pid).subscribe(data => this.requestedBy = data);
    });
  }
}
