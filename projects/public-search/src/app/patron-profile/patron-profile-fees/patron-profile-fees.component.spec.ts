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
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { RecordService } from '@rero/ng-core';
import { AppStore, testUserPatronWithSettings, User, UserApiService } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { of } from 'rxjs';
import { PatronTransactionApiService } from '../../api/patron-transaction-api.service';
import { PatronProfileStore } from '../store/patron-profile.store';
import { PatronApiService } from '../../api/patron-api.service';
import { PatronProfileFeesComponent } from './patron-profile-fees.component';
import { PatronProfileFeeComponent } from './patron-profile-fee/patron-profile-fee.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

@Component({ selector: 'public-search-patron-profile-fee', template: '' })
class StubPatronProfileFeeComponent {
  @Input() record: any;
}

describe('PatronProfileFeeComponent', () => {
  let component: PatronProfileFeesComponent;
  let fixture: ComponentFixture<PatronProfileFeesComponent>;
  let store: InstanceType<typeof PatronProfileStore>;

  const apiResponse = {
    aggregations: {},
    hits: {
      total: {
        relation: 'eq',
        value: 1
      },
      hits: [
        {
          metadata: {
            pid: '1'
          }
        }
      ]
    },
    links: {}
  };

  const patronTransactionApiServiceSpy = { getFees: vi.fn() };
  patronTransactionApiServiceSpy.getFees.mockReturnValue(of(apiResponse));

  const userApiServiceSpy = { getLoggedUser: vi.fn() };
  userApiServiceSpy.getLoggedUser.mockReturnValue(of(testUserPatronWithSettings));

  const appStoreSpy = {
    user: vi.fn().mockReturnValue(new User(cloneDeep(testUserPatronWithSettings)))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    schemas: [NO_ERRORS_SCHEMA],
    imports: [
        TranslateModule.forRoot(),
        PatronProfileFeesComponent
    ],
    providers: [
        { provide: UserApiService, useValue: userApiServiceSpy },
        { provide: AppStore, useValue: appStoreSpy },
        { provide: PatronTransactionApiService, useValue: patronTransactionApiServiceSpy },
        { provide: PatronApiService, useValue: { getOverduePreviewByPatronPid: vi.fn().mockReturnValue(of([])) } },
        { provide: RecordService, useValue: { getRecord: vi.fn().mockReturnValue(of(null)), MAX_REST_RESULTS_SIZE: 1000 } },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideNoopAnimations()
    ]
})
    .overrideComponent(PatronProfileFeesComponent, {
      remove: { imports: [PatronProfileFeeComponent] },
      add: { imports: [StubPatronProfileFeeComponent] }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatronProfileFeesComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('feesTotal', 12.50);
    store = TestBed.inject(PatronProfileStore);
    store.init(new User(cloneDeep(testUserPatronWithSettings)));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the total amount', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('12.5');
  });
});
