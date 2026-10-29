// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { MessageService } from '@openng/optimus-ui/api';
import { RecordService } from '@rero/ng-core';
import { AppStore, testUserPatronWithSettings, User, UserApiService } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { of } from 'rxjs';

import { IllRequestApiService } from '../../api/ill-request-api.service';
import { LoanApiService } from '../../api/loan-api.service';
import { PatronApiService } from '../../api/patron-api.service';
import { PatronTransactionApiService } from '../../api/patron-transaction-api.service';
import { PatronProfileStore } from '../store/patron-profile.store';
import { PatronProfileFeeComponent } from './patron-profile-fee/patron-profile-fee.component';
import { PatronProfileFeesComponent } from './patron-profile-fees.component';

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
      total: 1,
      hits: [
        {
          metadata: {
            pid: '1',
          },
        },
      ],
    },
    links: {},
  };

  const patronTransactionApiServiceSpy = { getFees: vi.fn() };
  patronTransactionApiServiceSpy.getFees.mockReturnValue(of(apiResponse));

  const userApiServiceSpy = { getLoggedUser: vi.fn() };
  userApiServiceSpy.getLoggedUser.mockReturnValue(of(testUserPatronWithSettings));

  const appStoreSpy = {
    user: vi.fn().mockReturnValue(new User(cloneDeep(testUserPatronWithSettings))),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [PatronProfileFeesComponent],
      providers: [
        provideTranslateService(),
        PatronProfileStore,
        { provide: UserApiService, useValue: userApiServiceSpy },
        { provide: AppStore, useValue: appStoreSpy },
        {
          provide: LoanApiService,
          useValue: {
            getOnLoan: vi.fn().mockReturnValue(of({ hits: { hits: [], total: 0 } })),
            getRequest: vi.fn().mockReturnValue(of({ hits: { hits: [], total: 0 } })),
          },
        },
        { provide: PatronTransactionApiService, useValue: patronTransactionApiServiceSpy },
        { provide: PatronApiService, useValue: { getOverduePreviewByPatronPid: vi.fn().mockReturnValue(of([])) } },
        {
          provide: IllRequestApiService,
          useValue: {
            getPublicIllRequest: vi.fn().mockReturnValue(of({ hits: { hits: [], total: 0 } })),
          },
        },
        { provide: MessageService, useValue: { add: vi.fn() } },
        {
          provide: RecordService,
          useValue: { getRecord: vi.fn().mockReturnValue(of(null)), MAX_REST_RESULTS_SIZE: 1000 },
        },
        provideHttpClient(withXhr()),
        provideHttpClientTesting(),
      ],
    })
      .overrideComponent(PatronProfileFeesComponent, {
        remove: { imports: [PatronProfileFeeComponent] },
        add: { imports: [StubPatronProfileFeeComponent] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatronProfileFeesComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('feesTotal', 12.5);
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
