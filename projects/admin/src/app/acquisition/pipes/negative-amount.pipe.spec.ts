// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TestBed } from "@angular/core/testing";
import { NegativeAmountPipe } from "./negative-amount.pipe";

describe('NegativeAmountPipe', () => {
  let pipe: NegativeAmountPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NegativeAmountPipe
      ]
    });

    pipe = TestBed.inject(NegativeAmountPipe);
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the negative amount', () => {
    expect(pipe.transform(1200)).toEqual(-1200);
  });
});
