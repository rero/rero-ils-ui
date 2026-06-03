/*
 * RERO ILS UI
 * Copyright (C) 2019-2026 RERO
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
