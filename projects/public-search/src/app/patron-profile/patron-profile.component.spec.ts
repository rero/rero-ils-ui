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
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '@rero/ng-core';
import { LoggedUserService, SharedModule, UserApiService } from '@rero/shared';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { of } from 'rxjs';
import { IllRequestApiService } from '../api/ill-request-api.service';
import { LoanApiService } from '../api/loan-api.service';
import { PatronTransactionApiService } from '../api/patron-transaction-api.service';
import { PatronProfileComponent } from './patron-profile.component';
import { PatronProfileService } from './patron-profile.service';


describe('PatronProfileComponent', () => {
  let component: PatronProfileComponent;
  let fixture: ComponentFixture<PatronProfileComponent>;
  let loggedUser: LoggedUserService;

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

  const user = {
    metadata: {
      pid: '1',
      first_name: 'first',
      last_name: 'last',
      patron: {
        keep_history: true
      },
      organisation: {
        currency: 'CHF'
      }
    }
  };

  const userApiServiceSpy = jasmine.createSpyObj('UserApiService', ['getLoggedUser']);
  userApiServiceSpy.getLoggedUser.and.returnValue(of(user));

  const loanApiServiceSpy = jasmine.createSpyObj('LoanApiService', ['getOnLoan', 'getRequest', 'getHistory']);
  loanApiServiceSpy.getOnLoan.and.returnValue(of(apiResponse));
  loanApiServiceSpy.getRequest.and.returnValue(of(apiResponse));
  loanApiServiceSpy.getHistory.and.returnValue(of(apiResponse));

  const patronTransactionApiServiceSpy = jasmine.createSpyObj('PatronTransactionApi', ['getFees']);
  patronTransactionApiServiceSpy.getFees.and.returnValue(of(apiResponse));

  const illRequestApiServiceSpy = jasmine.createSpyObj('IllRequestApi', ['getIllRequest']);
  illRequestApiServiceSpy.getIllRequest.and.returnValue(of(apiResponse));

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
        SharedModule
      ],
      providers: [
        BsLocaleService,
        PatronProfileService,
        { provide: UserApiService, useValue: userApiServiceSpy },
        { provide: LoanApiService, useValue: loanApiServiceSpy },
        { provide: PatronTransactionApiService, useValue: patronTransactionApiServiceSpy },
        { provide: IllRequestApiService, useValue: illRequestApiServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    loggedUser = TestBed.inject(LoggedUserService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatronProfileComponent);
    component = fixture.componentInstance;
    component.language = 'en';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the user\'s name and tabs info', () => {
    loggedUser.load();
    fixture.detectChanges();
    const fullname = fixture.nativeElement.querySelector('header > h3');
    expect(fullname.textContent).toContain('first last');

    let tab = fixture.nativeElement.querySelector('#profile-tabs li:nth-child(1)');
    expect(tab.textContent).toContain('Loans 12');
    tab = fixture.nativeElement.querySelector('#profile-tabs li:nth-child(2)');
    expect(tab.textContent).toContain('Requests 12');
    tab = fixture.nativeElement.querySelector('#profile-tabs li:nth-child(3)');
    expect(tab.textContent).toContain('Fees  CHF14.00');
    tab = fixture.nativeElement.querySelector('#profile-tabs li:nth-child(4)');
    expect(tab.textContent).toContain('History 12');
    tab = fixture.nativeElement.querySelector('#profile-tabs li:nth-child(5)');
    expect(tab.textContent).toContain('ILL requests 12');
    tab = fixture.nativeElement.querySelector('#profile-tabs li:nth-child(6)');
    expect(tab.textContent).toContain('Personal details');
  });
});
