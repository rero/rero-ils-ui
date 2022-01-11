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
