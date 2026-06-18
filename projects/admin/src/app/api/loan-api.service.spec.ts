// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TestBed } from "@angular/core/testing";
import { LoanApiService } from "./loan-api.service";
import { HttpClient } from "@angular/common/http";
import { LoanOverduePreview } from "../classes/loans";
import { of } from "rxjs";

describe('LoanApiService', () => {
  let service: LoanApiService;

  const loanOverduePreview: LoanOverduePreview = {
    steps: [],
    total: 0
  };

  const httpClientSpy = { get: vi.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoanApiService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });

    service = TestBed.inject(LoanApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of overdue for a loan', () => {
    httpClientSpy.get.mockReturnValue(of(loanOverduePreview));
    service.getPreviewOverdue('1')
      .subscribe((result: LoanOverduePreview) => expect(result).toEqual(loanOverduePreview))
  });
});
