// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Pipe, PipeTransform } from '@angular/core';
import { isScanItemMetadata, TransactionRecord } from '@app/admin/circulation/model/circulation.model';
import { _ } from '@ngx-translate/core';

export type TransactionStatus = {
  label: string;
  severity: 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';
  icon: string;
};

const TRANSACTION_STATUSES: Record<string, TransactionStatus> = {
  checkout: { label: _('Checkout'), severity: 'info', icon: 'fa-solid fa-angles-right' },
  checkin: { label: _('Check-in'), severity: 'info', icon: 'fa-solid fa-angles-left' },
  extend: { label: _('Renewal'), severity: 'info', icon: 'fa-solid fa-rotate' },
  request: { label: _('Request'), severity: 'secondary', icon: 'fa-solid fa-bookmark' },
  validate_request: { label: _('Validate'), severity: 'info', icon: 'fa-solid fa-check' },
  receive: { label: _('Received'), severity: 'info', icon: 'fa-solid fa-inbox' },
  cancel: { label: _('Cancel request'), severity: 'secondary', icon: 'fa-solid fa-xmark' },
  scan_item: { label: _('Scan item'), severity: 'info', icon: 'fa-solid fa-magnifying-glass' },
};

const DEFAULT_STATUS: TransactionStatus = { label: _('Unknown'), severity: 'secondary', icon: 'fa-solid fa-circle-question' };

/**
 * Resolve the display status (label, PrimeNG severity, icon) of a circulation
 * operation log entry, based on its record type (`loan` or `scan_item`) and,
 * for loans, the loan trigger (checkout, checkin, extend, request,
 * validate_request, receive, cancel).
 */
@Pipe({
  name: 'transactionStatus',
})
export class TransactionStatusPipe implements PipeTransform {

  transform(transaction: TransactionRecord): TransactionStatus {
    const {metadata} = transaction;
    if (isScanItemMetadata(metadata)) {
      return TRANSACTION_STATUSES['scan_item'];
    }
    const trigger = metadata.loan?.trigger;
    return TRANSACTION_STATUSES[trigger] ?? DEFAULT_STATUS;
  }
}
