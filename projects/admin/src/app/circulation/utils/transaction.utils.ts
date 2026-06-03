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

/**
 * Compute the total due amount for a list of patron-transactions.
 * Only transactions with status === "open" are counted.
 */
export function computeTotalTransactionsAmount(transactions: PatronTransaction[]): number {
  return transactions.reduce((accumulator, transaction) => {
    return (transaction.status === PatronTransactionStatus.OPEN)
      ? parseFloat((accumulator + transaction.total_amount).toFixed(2))
      : accumulator;
  }, 0);
}
