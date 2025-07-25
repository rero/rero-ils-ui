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

  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

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
    httpClientSpy.get.and.returnValue(of(loanOverduePreview));
    service.getPreviewOverdue('1')
      .subscribe((result: LoanOverduePreview) => expect(result).toEqual(loanOverduePreview))
  });
});
