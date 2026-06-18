// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { PatronTransaction, PatronTransactionStatus } from '@app/admin/classes/patron-transaction';
import { computeTotalTransactionsAmount } from './transaction.utils';

function makeTransaction(amount: number, status = PatronTransactionStatus.OPEN): PatronTransaction {
  const t = new PatronTransaction();
  t.total_amount = amount;
  t.status = status;
  return t;
}

describe('computeTotalTransactionsAmount', () => {
  it('should return 0 for an empty list', () => {
    expect(computeTotalTransactionsAmount([])).toBe(0);
  });

  it('should sum all open transactions', () => {
    expect(computeTotalTransactionsAmount([
      makeTransaction(10),
      makeTransaction(5),
    ])).toBe(15);
  });

  it('should ignore closed transactions', () => {
    expect(computeTotalTransactionsAmount([
      makeTransaction(10),
      makeTransaction(5, PatronTransactionStatus.CLOSED),
    ])).toBe(10);
  });

  it('should return 0 when all transactions are closed', () => {
    expect(computeTotalTransactionsAmount([
      makeTransaction(10, PatronTransactionStatus.CLOSED),
      makeTransaction(5, PatronTransactionStatus.CLOSED),
    ])).toBe(0);
  });

  it('should handle a single open transaction', () => {
    expect(computeTotalTransactionsAmount([makeTransaction(7)])).toBe(7);
  });

  it('should round floating-point sums to 2 decimal places', () => {
    expect(computeTotalTransactionsAmount([
      makeTransaction(1.1),
      makeTransaction(2.2),
    ])).toBe(3.3);
  });
});
