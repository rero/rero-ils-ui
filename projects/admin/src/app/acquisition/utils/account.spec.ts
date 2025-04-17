/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
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

import { IAcqAccount } from "../classes/account";
import { orderAccountsAsTree } from "./account";

describe('Account', () => {

  const account: IAcqAccount = {
    name: "Account last",
    number: "account_1_1",
    depth: 1,
    is_active: false,
    allocated_amount: 0,
    encumbrance_amount: undefined,
    expenditure_amount: undefined,
    distribution: 0,
    budget: undefined,
    parent: undefined,
    organisation: undefined
  };

  const account2 = {...account};
  account2.name = 'Account 1.0';
  account2.number = 'account_1_0';
  account2.depth = 0;

  const account3 = {...account};
  account3.name = 'Account 1.1.1';
  account3.number = 'account_1_1_1';
  account3.depth = 0;

  const account4 = {...account};
  account4.name = 'Account first';
  account4.number = 'account_1_1_2';
  account4.depth = 1;

  const accounts: IAcqAccount[] = [
    account,
    account2,
    account3,
    account4
  ];

  it('should return a sorted list with the first level', () => {
    expect(orderAccountsAsTree(accounts)).toEqual([account2, account3]);
  });
});
