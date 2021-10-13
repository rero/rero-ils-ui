/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '@rero/ng-core';
import { SharedModule, testUserPatronWithSettings, UserApiService, UserService } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { of } from 'rxjs';
import { IllRequestApiService } from '../api/ill-request-api.service';
import { LoanApiService } from '../api/loan-api.service';
import { OperationLogsApiService } from '../api/operation-logs-api.service';
import { PatronTransactionApiService } from '../api/patron-transaction-api.service';
import { PatronProfileMenuService } from './patron-profile-menu.service';
import { PatronProfileComponent } from './patron-profile.component';

describe('PatronProfileComponent', () => {
  let component: PatronProfileComponent;
  let fixture: ComponentFixture<PatronProfileComponent>;
  let userService: UserService;
  let patronProfileMenuService: PatronProfileMenuService;

  const apiResponse = {
    aggregations: {
      total: {
        value: 14
      }
    },
    hits: {
      total: {
        relation: 'eq',
        value: 12
      },
      hits: []
    },
    links: {}
  };

  const userApiServiceSpy = jasmine.createSpyObj('UserApiService', ['getLoggedUser']);
  userApiServiceSpy.getLoggedUser.and.returnValue(of(cloneDeep(testUserPatronWithSettings)));

  const loanApiServiceSpy = jasmine.createSpyObj('LoanApiService', ['getOnLoan', 'getRequest']);
  loanApiServiceSpy.getOnLoan.and.returnValue(of(apiResponse));
  loanApiServiceSpy.getRequest.and.returnValue(of(apiResponse));

  const operationLogsApiServiceSpy = jasmine.createSpyObj('operationLogsApiService', ['getHistory']);
  operationLogsApiServiceSpy.getHistory.and.returnValue(of(apiResponse));

  const patronTransactionApiServiceSpy = jasmine.createSpyObj('PatronTransactionApi', ['getFees']);
  patronTransactionApiServiceSpy.getFees.and.returnValue(of(apiResponse));

  const illRequestApiServiceSpy = jasmine.createSpyObj('IllRequestApi', ['getPublicIllRequest']);
  illRequestApiServiceSpy.getPublicIllRequest.and.returnValue(of(apiResponse));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PatronProfileComponent
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        TabsModule.forRoot(),
        CoreModule,
        SharedModule,
        LoadingBarModule
      ],
      providers: [
        BsLocaleService,
        { provide: UserApiService, useValue: userApiServiceSpy },
        { provide: LoanApiService, useValue: loanApiServiceSpy },
        { provide: OperationLogsApiService, use: operationLogsApiServiceSpy },
        { provide: PatronTransactionApiService, useValue: patronTransactionApiServiceSpy },
        { provide: IllRequestApiService, useValue: illRequestApiServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    patronProfileMenuService = TestBed.inject(PatronProfileMenuService);
    patronProfileMenuService.init();
    userService = TestBed.inject(UserService);
    fixture = TestBed.createComponent(PatronProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the user\'s name and tabs info', () => {
    userService.loaded$.subscribe((data) => {
      // TODO: FIX THIS LATER
      // const fullname = fixture.nativeElement.querySelector('header > h3');
      // expect(fullname.textContent).toContain('Simonetta Casalini');
      let tab = fixture.nativeElement.querySelector('.nav-tabs li:nth-child(1)');
      expect(tab.textContent).toContain('Loans 12');
      tab = fixture.nativeElement.querySelector('.nav-tabs li:nth-child(2)');
      expect(tab.textContent).toContain('Requests 12');
      tab = fixture.nativeElement.querySelector('.nav-tabs li:nth-child(3)');
      expect(tab.textContent).toContain('Fees  CHF14.00');
      tab = fixture.nativeElement.querySelector('.nav-tabs li:nth-child(4)');
      expect(tab.textContent).toContain('History 12');
      tab = fixture.nativeElement.querySelector('.nav-tabs li:nth-child(5)');
      expect(tab.textContent).toContain('Interlibrary loan 12');
      tab = fixture.nativeElement.querySelector('.nav-tabs li:nth-child(6)');
      expect(tab.textContent).toContain('Personal details');
    });
    userService.load();
  });
});
