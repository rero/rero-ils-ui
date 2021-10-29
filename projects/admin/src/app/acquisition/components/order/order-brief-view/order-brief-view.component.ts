/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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

import { Component, Input, OnInit } from '@angular/core';
import { ResultItem } from '@rero/ng-core';
import { AcqOrder, AcqOrderStatus } from '../../../classes/order';
import { AcqNote, AcqNoteType } from '../../../classes/common';

@Component({
  selector: 'admin-acquisition-order-brief-view',
  templateUrl: './order-brief-view.component.html',
  styleUrls: ['./order-brief-view.component.scss']
})
export class OrderBriefViewComponent implements ResultItem, OnInit {

  // COMPONENTS ATTRIBUTES ====================================================
  /** the record to display */
  @Input() record: any;
  /** the record type */
  @Input() type: string;
  /** the ur to the record detail view */
  @Input() detailUrl: { link: string, external: boolean };

  /** the record as an AcqOrder */
  order: AcqOrder = null;
  /** order status reference */
  orderStatus = AcqOrderStatus;
  /** order note type reference */
  noteType = AcqNoteType;

  // GETTER & SETTER ==========================================================
  /** get order date (based on orderLine order date) */
  get orderDate(): string | null {
    return this.record.metadata.order_lines
      .filter((line) => line.hasOwnProperty('order_date'))
      .map((line) => line.order_date)
      .shift();
  }

  /** get reception date (based on orderLine reception date) */
  get receptionDate(): string | null {
    return this.record.metadata.order_lines
      .filter((line) => line.hasOwnProperty('reception_date'))
      .map((line) => line.reception_date)
      .shift();
  }

  // CONSTRUCTOR & HOOKS ======================================================
  ngOnInit(): void {
    this.order = new AcqOrder(this.record.metadata);
  }

}
