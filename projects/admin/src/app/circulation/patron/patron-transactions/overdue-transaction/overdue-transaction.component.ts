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
import { RecordService } from '@rero/ng-core';
import { Loan, LoanOverduePreview } from 'projects/admin/src/app/classes/loans';
import { OrganisationService } from 'projects/admin/src/app/service/organisation.service';
import { forkJoin } from 'rxjs';
import { Item } from 'projects/admin/src/app/classes/items';
import { PatronTransactionEvent, PatronTransactionEventType } from 'projects/admin/src/app/circulation/classes/patron-transaction';

@Component({
  selector: 'admin-overdue-transaction',
  templateUrl: './overdue-transaction.component.html'
})
export class OverdueTransactionComponent implements OnInit {

  // COMPONENT ATTRIBUTES ====================================================
  /** the overdue preview to display */
  @Input() transaction: {loan: Loan, fees: LoanOverduePreview};
  /** Is transaction detail visible ? */
  isCollapsed = true;
  /** item, document corresponding to the loan */
  item: Item = undefined;
  document: any = undefined;


  // GETTER & SETTER =========================================================
  /** Get current organisation
   *  @return: current organisation
   */
  get organisation() {
    return this._organisationService.organisation;
  }

  // CONSTRUCTOR & HOOKS =====================================================
  /**
   * constructor
   * @param _organisationService - OrganisationService
   * @param _recordService - RecordService
   */
  constructor(
    private _organisationService: OrganisationService,
    private _recordService: RecordService
  ) { }

  /** OnInit hook */
  ngOnInit(): void {
    const itemRecord$ = this._recordService.getRecord('items', this.transaction.loan.item_pid.value);
    const documentRecord$ = this._recordService.getRecord('documents', this.transaction.loan.document_pid);
    forkJoin([itemRecord$, documentRecord$]).subscribe(
      ([itemData, documentData]) => {
        this.item = new Item(itemData.metadata);
        this.document = documentData.metadata;
      }
    );
    // transform fees steps to fake PatronTransactionEvent
    this.transaction.fees.steps = this.transaction.fees.steps.map(event => new PatronTransactionEvent({
      creation_date: event[1],
      amount: event[0],
      type: PatronTransactionEventType.FEE,
      subtype: 'overdue'
    })).reverse();
  }
}
