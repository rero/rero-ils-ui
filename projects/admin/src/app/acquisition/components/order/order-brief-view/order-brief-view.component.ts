/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
 * Copyright (C) 2021 UCLouvain
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

import { Component, inject, Input, OnInit } from '@angular/core';
import { ResultItem } from '@rero/ng-core';
import { AcqOrderApiService } from '../../../api/acq-order-api.service';
import { AcqNoteType } from '../../../classes/common';
import { AcqOrderStatus, IAcqOrder } from '../../../classes/order';

@Component({
  selector: 'admin-acquisition-order-brief-view',
  templateUrl: './order-brief-view.component.html',
  styleUrls: ['./order-brief-view.component.scss']
})
export class OrderBriefViewComponent implements ResultItem, OnInit {

  private acqOrderApiService: AcqOrderApiService = inject(AcqOrderApiService);

  // COMPONENTS ATTRIBUTES ====================================================
  /** the record to display */
  @Input() record: any;
  /** the record type */
  @Input() type: string;
  /** the ur to the record detail view */
  @Input() detailUrl: { link: string, external: boolean };

  /** the record as an AcqOrder */
  order: IAcqOrder = null;
  /** order status reference */
  orderStatus = AcqOrderStatus;
  /** order note type reference */
  noteType = AcqNoteType;

  // GETTER & SETTER ==========================================================
  /** get order date (based on orderLine order date) */
  get orderDate(): string | null {
    return this.order.order_lines
      .filter(line => line.hasOwnProperty('order_date'))
      .map(line => line.order_date.toString())
      .shift();
  }

  /** get reception date (based on orderLine reception date) */
  get receptionDate(): string | null {
    return this.record.metadata.receipts
      .filter(line => line.hasOwnProperty('receipt_date') && Array.isArray(line.receipt_date) && line.receipt_date.length > 0)
      .map(line => line.receipt_date[0])
      .shift();
  }

  /**
   * Is the provisional data should be visible or not.
   * @returns True if the provisional accounting data could be visible.
   */
  get displayProvisionalAccountingData(): boolean {
    return (this.order.account_statement.provisional.quantity > 0
      && this.order.status !== AcqOrderStatus.RECEIVED
      && this.order.status !== AcqOrderStatus.CANCELLED);
  }

  /**
   * Is the expenditure data should be visible or not.
   * @returns True if the True accounting data could be visible.
   */
  get displayExpenditureAccountingData(): boolean {
    return (this.order.account_statement.expenditure.quantity > 0);
  }

  /** OnInit hook */
  ngOnInit(): void {
    const metadata = {...this.acqOrderApiService.orderDefaultData, ...this.record.metadata};
    // FILTERS NOTES ::
    //   the notes fields from AcqOrder ES index contains all notes from all related resources.
    //   We only need to keep the notes from itself.
    metadata.notes = metadata.notes.filter(note => note.source.type === 'acor');
    this.order = metadata;
  }
}
