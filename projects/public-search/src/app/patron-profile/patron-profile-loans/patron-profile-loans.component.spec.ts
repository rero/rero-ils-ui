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
import { testUserPatronWithSettings, UserApiService, UserService } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { of } from 'rxjs';
import { LoanApiService } from '../../api/loan-api.service';
import { PatronProfileMenuService } from '../patron-profile-menu.service';
import { PatronProfileLoansComponent } from './patron-profile-loans.component';

describe('PatronProfileLoanComponent', () => {
  let component: PatronProfileLoansComponent;
  let fixture: ComponentFixture<PatronProfileLoansComponent>;
  let loanApiService: LoanApiService;
  let userService: UserService;
  let patronProfileMenuService: PatronProfileMenuService;

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
            pid: '1',
            state: 'PENDING'
          }
        }
      ]
    },
    links: {}
  };

  const userApiServiceSpy = jasmine.createSpyObj('UserApiService', ['getLoggedUser']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PatronProfileLoansComponent ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: UserApiService, useValue: userApiServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatronProfileLoansComponent);
    component = fixture.componentInstance;
    loanApiService = TestBed.inject(LoanApiService);
    userApiServiceSpy.getLoggedUser.and.returnValue(of(cloneDeep(testUserPatronWithSettings)));
    patronProfileMenuService = TestBed.inject(PatronProfileMenuService);
    patronProfileMenuService.init();
    userService = TestBed.inject(UserService);
    userService.load();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading in progress', () => {
    component.loaded = false;
    fixture.detectChanges();
    const loading = fixture.nativeElement.querySelectorAll('div')[7];
    expect(loading.textContent).toContain('Loading in progress');
  });

  it('should display the message no record', () => {
    apiResponse.hits.total.value = 0;
    spyOn(loanApiService, 'getOnLoan').and.returnValue(of(apiResponse));
    component.loaded = true;
    fixture.detectChanges();
    const loading = fixture.nativeElement.querySelectorAll('div')[7];
    expect(loading.textContent).toContain('No loan');
  });

  it('should display the list of records', () => {
    apiResponse.hits.total.value = 1;
    spyOn(loanApiService, 'getOnLoan').and.returnValue(of(apiResponse));
    component.paginator.setRecordsCount(1);
    component.loaded = true;
    component.records = apiResponse.hits.hits;
    fixture.detectChanges();
    const li = fixture.nativeElement.querySelectorAll('li');
    expect(li.length).toEqual(1);
  });
});
