/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LoanOverduePreview } from '@app/admin/classes/loans';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService, RecordService } from '@rero/ng-core';
import { of } from 'rxjs';
import { CanExtend, LoanApiService } from './loan-api.service';


describe('LoanApiService', () => {
  let service: LoanApiService;
  let httpClient: HttpClient;

  const record = {
    medatadata: {
      pid: '1',
      name: 'item name'
    }
  };

  const apiResponse = {
    aggregations: {},
    hits: {
      total: {
        relation: 'eq',
        value: 1
      },
      hits: [
        record
      ]
    },
    links: {}
  };

  const canExtend = {
    can: true,
    reasons: {}
  };

  const renew = {
    action_applied: {
      extend_loan: {
        pid: 'renew'
      }
    }
  };

  const cancel = {
    action_applied: {
      cancel: {
        pid: 'cancel'
      }
    }
  };

  const loanOverduePreview = {
    steps: [],
    total: 1
  };

  const recordServiceSpy = { getRecords: vi.fn(), totalHits: vi.fn() };
  recordServiceSpy.getRecords.mockReturnValue(of(apiResponse));
  recordServiceSpy.totalHits.mockReturnValue(1);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ],
      providers: [
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: ApiService, useValue: { getEndpointByType: vi.fn().mockReturnValue('/api/loan') } },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(LoanApiService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load the loans', () => {
    service.getOnLoan('1', 1, 10)
      .subscribe((response: any) => expect(response.hits.hits[0]).toEqual(record));
  });

  it('should load the requests', () => {
    service.getRequest('1', 1, 10)
      .subscribe((response: any) => expect(response.hits.hits[0]).toEqual(record));
  });

  it('should extend the loan', () => {
    vi.spyOn(httpClient, 'get').mockReturnValue(of(canExtend));
    service.canExtend('1')
      .subscribe((response: CanExtend) => expect(response).toEqual(canExtend));
  });

  it('should extend the loan', () => {
    vi.spyOn(httpClient, 'post').mockReturnValue(of(renew));
    service.renew({pid: '1', item_pid: '1', transaction_location_pid: '1', transaction_user_pid: '1'})
      .subscribe((response: any) => expect(response.pid).toEqual('renew'));
  });

  it('should cancel the loan', () => {
    vi.spyOn(httpClient, 'post').mockReturnValue(of(cancel));
    service.cancel({pid: '1', transaction_location_pid: '1', transaction_user_pid: '1'})
      .subscribe((response: any) => expect(response.pid).toEqual('cancel'));
  });

  it('should return the list of projected expenses', () => {
    vi.spyOn(httpClient, 'get').mockReturnValue(of(loanOverduePreview));
    service.getPreviewOverdue('1')
      .subscribe((response: LoanOverduePreview) => expect(response).toEqual(loanOverduePreview));
  });
});
