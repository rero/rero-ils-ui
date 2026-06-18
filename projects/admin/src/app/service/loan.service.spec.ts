// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { RecordService } from "@rero/ng-core";
import { AppStore, circulationPolicy, testUserPatronWithSettings } from "@rero/shared";
import { loanPending } from "@rero/shared";
import { apiResponse } from "@rero/shared";
import { of } from "rxjs";
import { LoanService } from "./loan.service";
import { LoanState } from "../classes/loans";

describe('LoanService', () => {
  let service: LoanService;
  
  const response = {...apiResponse};
  const recordServiceSpy = { getRecords: vi.fn() };

  const httpClientSpy = { get: vi.fn(), post: vi.fn() };

  const appStoreSpy = { } as any;
  const user = { ...testUserPatronWithSettings };
  appStoreSpy.user = vi.fn(() => user);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        LoanService,
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: AppStore, useValue: appStoreSpy },
      ]
    });

    service = TestBed.inject(LoanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a borrowed loan records', () => {
    response.hits.hits = [{...loanPending}];
    recordServiceSpy.getRecords.mockReturnValue(of(response));
    service.borrowedBy$('1').subscribe((result: any) => {
      expect(result.length).toEqual(1);
      expect(result[0].metadata.pid).toEqual('209');
    });
  });

  it('should return a requested loan records', () => {
    response.hits.hits = [{...loanPending}];
    recordServiceSpy.getRecords.mockReturnValue(of(response));
    service.requestedBy$('1').subscribe((result: any) => {
      expect(result.length).toEqual(1);
      expect(result[0].metadata.pid).toEqual('209');
    })
  });

  it('should return validation of request cancellation', () => {
    const loan = {...loanPending};
    expect(service.canCancelRequest(loan)).toBe(true);
    loan.metadata.state = LoanState.ITEM_ON_LOAN;
    expect(service.canCancelRequest(loan)).toBe(false);
  });

  it('should return the loan cancelled on the item', () => {
    const item = {
      metadata: {
        pid: '1'
      },
      action_applied: {
        cancel: {...loanPending}
      }
    };
    const response = {
      pid: '1',
      loan: {...loanPending}
    };
    httpClientSpy.post.mockReturnValue(of(item));
    service.cancelLoan('1', '1', '1')
      .subscribe((result: any) => expect(result).toEqual(response));
  });

  it('should return request pickup location can be changed', () => {
    const transaction = {
      metadata: {
        state: LoanState.PENDING
      }
    };
    expect(service.canUpdateRequestPickupLocation(transaction)).toBe(true);
    transaction.metadata.state = LoanState.ITEM_AT_DESK;
    expect(service.canUpdateRequestPickupLocation(transaction)).toBe(false);
  });

  it('should return the loan with the new pickup location', () => {
    const loan = {...loanPending};
    httpClientSpy.post.mockReturnValue(of(loan));
    service.updateLoanPickupLocation('1', '2')
      .subscribe((result: any) => expect(result).toEqual(loan));
  });

  it('should return the circulation policy to loan pid', () => {
    const circPolicy = {...circulationPolicy};
    httpClientSpy.get.mockReturnValue(of(circPolicy));
    service.getCirculationPolicy('1')
      .subscribe((result: any) => expect(result).toEqual(circPolicy));
  });


});
