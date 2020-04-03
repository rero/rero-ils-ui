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
import { Component, OnInit, Input } from '@angular/core';
import { LoanService } from 'projects/admin/src/app/service/loan.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'admin-item-transactions',
  templateUrl: './item-transactions.component.html',
  styles: []
})
export class ItemTransactionsComponent implements OnInit {

  /** Item record */
  @Input() item: any;

  /** Borrowed item */
  borrowedBy$: Observable<any>;

  /** Requested item(s) */
  requestedBy$: Observable<any>;

  /**
   * Constructor
   * @param loanService - LoanService
   */
  constructor(private _loanService: LoanService) { }

  ngOnInit() {
    this.borrowedBy$ = this._loanService.borrowedBy$(this.item.metadata.pid);
    this.requestedBy$ = this._loanService.requestedBy$(this.item.metadata.pid);
  }
}
