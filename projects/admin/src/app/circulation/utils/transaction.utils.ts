// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
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
