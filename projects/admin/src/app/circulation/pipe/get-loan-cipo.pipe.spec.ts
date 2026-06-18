// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TestBed } from "@angular/core/testing";
import { GetLoanCipoPipe } from "./get-loan-cipo.pipe";
import { LoanService } from "@app/admin/service/loan.service";
import { of } from "rxjs";
import { Loan, LoanState } from "@app/admin/classes/loans";
import { CircPolicy } from "@app/admin/classes/circ-policy";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TranslateModule } from "@ngx-translate/core";
import { ConfirmationService } from "primeng/api";

describe('GetLoanCipoPipe', () => {
  let service: GetLoanCipoPipe;
  let loanService: LoanService;

  const loan: Loan = {
    pid: '1',
    state: LoanState.ITEM_AT_DESK,
    dueDate: undefined,
    expired: false
  }

  const circulationPolicy: CircPolicy = {
    $schema: '/circulation',
    pid: '1',
    organisation: {
      pid: '1'
    },
    allow_requests: false,
    is_default: false,
    policy_library_level: false };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        GetLoanCipoPipe,
        LoanService,
        ConfirmationService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(GetLoanCipoPipe);
    loanService = TestBed.inject(LoanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the circulation policy', () => {
    vi.spyOn(loanService, 'getCirculationPolicy').mockReturnValue(of(circulationPolicy));
    service.transform(loan)
      .subscribe((result: CircPolicy) => expect(result).toEqual(circulationPolicy));
  });
});
