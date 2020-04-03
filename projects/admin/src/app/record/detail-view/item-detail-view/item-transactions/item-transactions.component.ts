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
import { BsModalService } from 'ngx-bootstrap';
import { LoanService } from 'projects/admin/src/app/service/loan.service';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ItemRequestComponent } from '../../document-detail-view/item-request/item-request.component';

@Component({
  selector: 'admin-item-transactions',
  templateUrl: './item-transactions.component.html',
  styles: []
})
export class ItemTransactionsComponent implements OnInit {

  /**
   * Item record
   */
  @Input() item: any;

  /**
   * Borrowed item
   */
  borrowedBy$: Observable<any>;

  /**
   * Requested item(s)
   */
  requestedBy$: Observable<any>;

  /**
   * Constructor
   * @param loanService - LoanService
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
    this.borrowedBy$ = this._loanService.borrowedBy$(this.item.metadata.pid);
    this.requestedBy$ = this._loanService.requestedBy$(this.item.metadata.pid);
  }

  /**
   * Update request list
   */
  updateRequestList() {
    this.requestedBy$ = this._loanService.requestedBy$(this.item.metadata.pid);
  }

  /**
   * Add request on item
   * @param itemPid - string
   */
  addRequest(itemPid: string) {
    const modalRef = this._modalService.show(ItemRequestComponent, {
      initialState: { itemPid }
    });
    modalRef.content.onSubmit.pipe(first()).subscribe(value => {
      this.updateRequestList();
    });
  }
}
