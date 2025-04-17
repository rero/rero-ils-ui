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

import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { RecordService } from "@rero/ng-core";
import { circulationPolicy, testUserPatronWithSettings, UserService } from "@rero/shared";
import { ConfirmationService } from "primeng/api";
import { loanPending } from "projects/shared/src/public-api";
import { apiResponse } from "projects/shared/src/tests/api";
import { of } from "rxjs";
import { LoanService } from "./loan.service";
import { LoanState } from "../classes/loans";

describe('LoanService', () => {
  let service: LoanService;
  let confirmationService: ConfirmationService;

  const response = {...apiResponse};
  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecords']);

  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);

  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  userServiceSpy.user = { ...testUserPatronWithSettings};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        LoanService,
        ConfirmationService,
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    });

    service = TestBed.inject(LoanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a borrowed loan records', () => {
    response.hits.hits = [{...loanPending}];
    recordServiceSpy.getRecords.and.returnValue(of(response));
    service.borrowedBy$('1').subscribe((result: any) => {
      expect(result.length).toEqual(1);
      expect(result[0].metadata.pid).toEqual('209');
    });
  });

  it('should return a requested loan records', () => {
    response.hits.hits = [{...loanPending}];
    recordServiceSpy.getRecords.and.returnValue(of(response));
    service.requestedBy$('1').subscribe((result: any) => {
      expect(result.length).toEqual(1);
      expect(result[0].metadata.pid).toEqual('209');
    })
  });

  it('should return validation of request cancellation', () => {
    const loan = {...loanPending};
    expect(service.canCancelRequest(loan)).toBeTrue();
    loan.metadata.state = LoanState.ITEM_ON_LOAN;
    expect(service.canCancelRequest(loan)).toBeFalse();
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
    httpClientSpy.post.and.returnValue(of(item));
    service.cancelLoan('1', '1', '1')
      .subscribe((result: any) => expect(result).toEqual(response));
  });

  it('should return request pickup location can be changed', () => {
    const transaction = {
      metadata: {
        state: LoanState.PENDING
      }
    };
    expect(service.canUpdateRequestPickupLocation(transaction)).toBeTrue();
    transaction.metadata.state = LoanState.ITEM_AT_DESK;
    expect(service.canUpdateRequestPickupLocation(transaction)).toBeFalse();
  });

  it('should return the loan with the new pickup location', () => {
    const loan = {...loanPending};
    httpClientSpy.post.and.returnValue(of(loan));
    service.updateLoanPickupLocation('1', '2')
      .subscribe((result: any) => expect(result).toEqual(loan));
  });

  it('should return the circulation policy to loan pid', () => {
    const circPolicy = {...circulationPolicy};
    httpClientSpy.get.and.returnValue(of(circPolicy));
    service.getCirculationPolicy('1')
      .subscribe((result: any) => expect(result).toEqual(circPolicy));
  });

  it('should display the cancellation confirmation dialog', () => {
    const config = {
      target: null,
      icon: 'fa fa-exclamation-triangle',
      header: 'Cancel request',
      message: 'Do you really want to cancel the request?',
      acceptLabel: 'Yes',
      rejectLabel: 'No'
    };
    const confirmationService = TestBed.inject(ConfirmationService);
    confirmationService.requireConfirmation$
      .subscribe((result: any) => expect(result).toEqual(config));
    service.cancelRequestDialog(new Event('body'));
  });
});
