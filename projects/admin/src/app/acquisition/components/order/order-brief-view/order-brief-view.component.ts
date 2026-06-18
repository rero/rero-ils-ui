// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { AcqNoteType } from '../../../classes/common';
import { AcqOrderStatus, IAcqOrder, orderDefaultData } from '../../../classes/order';
import { RouterLink } from '@angular/router';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { DateTranslatePipe, GetRecordPipe, Nl2brPipe, TruncateTextPipe } from '@rero/ng-core';
import { NotesFilterPipe } from '@rero/shared';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'admin-acquisition-order-brief-view',
    templateUrl: './order-brief-view.component.html',
    imports: [RouterLink, AsyncPipe, CurrencyPipe, DateTranslatePipe, GetRecordPipe, Nl2brPipe, NotesFilterPipe, TruncateTextPipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderBriefViewComponent implements OnInit {

  // COMPONENTS ATTRIBUTES ====================================================
  /** the record to display */
  record = input<any>();
  /** the record type */
  type = input<string>();
  /** the ur to the record detail view */
  detailUrl = input<{ link: string, external: boolean }>();

  /** the record as an AcqOrder */
  order: IAcqOrder = null;
  /** order status reference */
  orderStatus = AcqOrderStatus;
  /** order note type reference */
  noteType = AcqNoteType;

  /** get reception date (based on receiptLine reception date) */
  get receptionDate(): string | null {
    return this.record().metadata.receipts
      .filter(line => Object.hasOwn(line, 'receipt_date') && Array.isArray(line.receipt_date) && line.receipt_date.length > 0)
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
    const metadata = {...orderDefaultData, ...this.record().metadata};
    // FILTERS NOTES ::
    //   the notes fields from AcqOrder ES index contains all notes from all related resources.
    //   We only need to keep the notes from itself.
    metadata.notes = metadata.notes.filter(note => note.source.type === 'acor');
    this.order = metadata;
  }
}
