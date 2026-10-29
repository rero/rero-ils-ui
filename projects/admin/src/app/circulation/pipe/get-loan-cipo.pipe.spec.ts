// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CircPolicy } from '@app/admin/classes/circ-policy';
import { Loan, LoanState } from '@app/admin/classes/loans';
import { LoanService } from '@app/admin/service/loan.service';
import { provideTranslateService } from '@ngx-translate/core';
import { ConfirmationService } from '@openng/optimus-ui/api';
import { of } from 'rxjs';

import { GetLoanCipoPipe } from './get-loan-cipo.pipe';

describe('GetLoanCipoPipe', () => {
  let service: GetLoanCipoPipe;
  let loanService: LoanService;

  const loan: Loan = {
    pid: '1',
    state: LoanState.ITEM_AT_DESK,
    dueDate: undefined,
    expired: false,
  };

  const circulationPolicy: CircPolicy = {
    $schema: '/circulation',
    pid: '1',
    organisation: {
      pid: '1',
    },
    allow_requests: false,
    is_default: false,
    policy_library_level: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        GetLoanCipoPipe,
        LoanService,
        ConfirmationService,
        provideHttpClient(withXhr()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(GetLoanCipoPipe);
    loanService = TestBed.inject(LoanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the circulation policy', () => {
    vi.spyOn(loanService, 'getCirculationPolicy').mockReturnValue(of(circulationPolicy));
    service.transform(loan).subscribe((result: CircPolicy) => expect(result).toEqual(circulationPolicy));
  });
});
