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
import { testUserPatronWithSettings, UserApiService, UserService } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { of } from 'rxjs';
import { PatronTransactionApiService } from '../../api/patron-transaction-api.service';
import { PatronProfileMenuService } from '../patron-profile-menu.service';
import { PatronProfileService } from '../patron-profile.service';
import { PatronProfileFeesComponent } from './patron-profile-fees.component';

describe('PatronProfileFeeComponent', () => {
  let component: PatronProfileFeesComponent;
  let fixture: ComponentFixture<PatronProfileFeesComponent>;
  let patronProfileService: PatronProfileService;
  let patronProfileMenuService: PatronProfileMenuService;
  let userService: UserService;

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

  const patronTransactionApiServiceSpy = jasmine.createSpyObj('PatronTransactionApiService', ['getFees']);
  patronTransactionApiServiceSpy.getFees.and.returnValue(of(apiResponse));

  const userApiServiceSpy = jasmine.createSpyObj('UserApiService', ['getLoggedUser']);
  userApiServiceSpy.getLoggedUser.and.returnValue(of(testUserPatronWithSettings));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PatronProfileFeesComponent ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        CoreModule
      ],
      providers: [
        { provide: UserApiService, useValue: userApiServiceSpy },
        { provide: PatronTransactionApiService, useValue: patronTransactionApiServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatronProfileFeesComponent);
    patronProfileService = TestBed.inject(PatronProfileService);
    component = fixture.componentInstance;
    component.feesTotal = 12.50;
    userApiServiceSpy.getLoggedUser.and.returnValue(of(cloneDeep(testUserPatronWithSettings)));
    userService = TestBed.inject(UserService);
    userService.load().subscribe();
    patronProfileMenuService = TestBed.inject(PatronProfileMenuService);
    patronProfileMenuService.init();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the total amount', () => {
    const div = fixture.nativeElement
      .querySelector('#fees-section > div > div > div:nth-child(3)');
    expect(div.textContent).toContain(12.50);
  });

  it('should display loading in progress', () => {
    const loading = fixture.nativeElement.querySelectorAll('div')[6];
    expect(loading.textContent).toContain('Loading in progress');
  });

  it('should display the message no record', () => {
    patronProfileService.changeTab({ name: 'fee', count: 0 });
    fixture.detectChanges();
    const message = fixture.nativeElement.querySelectorAll('div')[6];
    expect(message.textContent).toContain('No fee');
  });

  it('should display the list of records', () => {
    patronProfileService.changeTab({ name: 'fee', count: 1 });
    fixture.detectChanges();
    const elements = fixture.nativeElement.querySelectorAll('#fees-data public-search-patron-profile-fee');
    expect(elements.length).toEqual(1);
  });
});
