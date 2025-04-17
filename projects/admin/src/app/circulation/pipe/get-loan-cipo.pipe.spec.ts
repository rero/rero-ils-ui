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
import { GetLoanCipoPipe } from "./get-loan-cipo.pipe";
import { LoanService } from "@app/admin/service/loan.service";
import { of } from "rxjs";
import { Loan, LoanState } from "@app/admin/classes/loans";
import { CircPolicy } from "@app/admin/classes/circ-policy";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
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
    policy_library_level: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        GetLoanCipoPipe,
        LoanService,
        ConfirmationService,
        provideHttpClient(withInterceptorsFromDi()),
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
    spyOn(loanService, 'getCirculationPolicy').and.returnValue(of(circulationPolicy));
    service.transform(loan)
      .subscribe((result: CircPolicy) => expect(result).toEqual(circulationPolicy));
  });
});
