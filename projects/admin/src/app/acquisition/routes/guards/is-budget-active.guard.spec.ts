/*
 * RERO ILS UI
 * Copyright (C) 2022-2024 RERO
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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule, RecordService } from '@rero/ng-core';
import { cloneDeep } from 'lodash-es';
import { of } from 'rxjs';
import { ErrorPageComponent } from '../../../error/error-page/error-page.component';
import { IsBudgetActiveGuard } from './is-budget-active.guard';

describe('IsBudgetActiveGuard', () => {
  let guard: IsBudgetActiveGuard;
  let recordService: RecordService;
  let router: Router;

  const routes = [
    {
      path: 'errors/403',
      component: ErrorPageComponent
    }
  ];

  const receipt = {
    metadata: {
      acq_order: {
        pid: '1',
      },
      exchange_rate: 1,
      amount_adjustments: [{
        label: 'amount',
        amount: 10,
        acq_account: {
          $ref: 'https://localhost/api/acq_accounts/1'
        }
      }],
      organisation: {
        $ref: 'https://localhost/api/organisations/1'
      },
      notes: [],
      is_current_budget: true
    }
  };

  const activatedRouteSnapshotSpy = jasmine.createSpyObj('ActivatedRouteSnapshot', ['']);
  activatedRouteSnapshotSpy.params = { type: 'acq_receipt', pid: '1' };
  activatedRouteSnapshotSpy.queryParams = { };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot(routes),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        CoreModule
      ],
    });
    guard = TestBed.inject(IsBudgetActiveGuard);
    recordService = TestBed.inject(RecordService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if the record has the flag true on is_current_buget', () => {
    const record = cloneDeep(receipt);
    spyOn(recordService, 'getRecord').and.returnValue(of(record));
    guard.canActivate(activatedRouteSnapshotSpy).subscribe((access: boolean) => {
      expect(access).toBeTruthy();
    });
  });

  it('should return a 403 error if the record has the flag false on is_current_buget', fakeAsync(() => {
    const record = cloneDeep(receipt);
    record.metadata.is_current_budget = false;
    spyOn(recordService, 'getRecord').and.returnValue(of(record));
    guard.canActivate(activatedRouteSnapshotSpy).subscribe(() => {
      tick();
      expect(router.url).toBe('/errors/403');
    });
  }));

  it('should return a 403 error if the record does not have the field is_current_budget', fakeAsync(() => {
    const record = cloneDeep(receipt);
    delete record.is_current_budget;
    record.metadata.is_current_budget = false;
    spyOn(recordService, 'getRecord').and.returnValue(of(record));
    guard.canActivate(activatedRouteSnapshotSpy).subscribe(() => {
      tick();
      expect(router.url).toBe('/errors/403');
    });
  }));
});
