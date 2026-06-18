// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TestBed } from '@angular/core/testing';
import { LoanStatusBadgePipe } from './loan-status-badge.pipe';

describe('LoanStatusBadgePipe', () => {
  let pipe: LoanStatusBadgePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoanStatusBadgePipe
      ]
    });
    pipe = TestBed.inject(LoanStatusBadgePipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('Should return the "badge-secondary" class', () => {
    expect(pipe.transform('ITEM_AT_DESK')).toEqual('success');
  });

  it('Should return the "badge-light" class (default)', () => {
    expect(pipe.transform('MISSING')).toEqual('secondary');
  });
});
