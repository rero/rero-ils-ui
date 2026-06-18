// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { IAcqAccount } from '../classes/account';

/**
 * Allow to sort accounts to render it correctly (corresponding to hierarchical tree structure)
 * @param accounts - the accounts to sort.
 * @return Account list sorted as a hierarchical tree.
 */
export function orderAccountsAsTree(accounts: IAcqAccount[]): IAcqAccount[] {
  /** Append an account and children accounts into the `accounts` list */
  const _appendAccount = (account: IAcqAccount, list: IAcqAccount[]) => {
    list.push(account);
    accounts.filter(acc => acc.parent !== undefined && acc.parent.pid === account.pid)
      .forEach(acc => _appendAccount(acc, list));
  };
  // First sort on depth and name.
  accounts.sort((a, b) => {
    return (a.depth === b.depth)
      ? a.name.localeCompare(b.name)
      : a.depth - b.depth;
  });
  // Rebuild hierarchical account tree.
  const sortedAccounts: IAcqAccount[] = [];
  accounts.filter(acc => acc.depth === 0).forEach(acc => _appendAccount(acc, sortedAccounts));
  return sortedAccounts;
}
