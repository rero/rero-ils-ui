// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

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
