// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TransactionRecord } from '@app/admin/circulation/model/circulation.model';
import { TransactionStatusPipe } from './transaction-status.pipe';

describe('TransactionStatusPipe', () => {
  const pipe = new TransactionStatusPipe();

  const loanRecord = (trigger: string): TransactionRecord => ({
    metadata: { record: { type: 'loan' }, loan: { trigger } },
  }) as unknown as TransactionRecord;

  it('should resolve the label of each loan trigger', () => {
    expect(pipe.transform(loanRecord('checkout')).label).toBe('checkout');
    expect(pipe.transform(loanRecord('checkin')).label).toBe('checkin');
    expect(pipe.transform(loanRecord('extend')).label).toBe('renewal');
    expect(pipe.transform(loanRecord('request')).label).toBe('request');
    expect(pipe.transform(loanRecord('validate_request')).label).toBe('request validation');
    expect(pipe.transform(loanRecord('receive')).label).toBe('item reception');
    expect(pipe.transform(loanRecord('cancel')).label).toBe('cancellation');
  });

  it('should resolve the scan item status', () => {
    const record = { metadata: { record: { type: 'scan_item' } } } as unknown as TransactionRecord;
    expect(pipe.transform(record).label).toBe('item scan');
  });

  it('should fall back to the default status for an unknown trigger', () => {
    expect(pipe.transform(loanRecord('foo')).label).toBe('Unknown');
  });
});
