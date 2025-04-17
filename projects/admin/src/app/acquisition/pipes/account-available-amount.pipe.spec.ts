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

import { TestBed } from "@angular/core/testing";
import { AccountAvailableAmountPipe } from "./account-available-amount.pipe";
import { IAcqAccount } from "../classes/account";

describe('AccountAvailableAmountPipe', () => {
  let pipe: AccountAvailableAmountPipe;

  const acqAmount: IAcqAccount = {
    name: "Account name",
    number: "Account C01.00",
    depth: 0,
    is_active: true,
    allocated_amount: 1500,
    encumbrance_amount: {
      children: 1,
      self: 1,
      total: 10
    },
    expenditure_amount: {
      children: 1,
      self: 1,
      total: 10
    },
    distribution: 250,
    budget: {
      pid: '1'
    },
    parent: {
      pid: '1'
    },
    organisation: {
      pid: '1'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AccountAvailableAmountPipe
      ]
    });

    pipe = TestBed.inject(AccountAvailableAmountPipe);
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the calculated amount', () => {
    expect(pipe.transform(acqAmount)).toEqual(1250);
  });
});
