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
import { MainTitlePipe, testUserPatronWithSettings, UserApiService, UserService } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { of } from 'rxjs';
import { PatronTransactionEventApiService } from '../../../api/patron-transaction-event-api.service';
import { PatronProfileMenuService } from '../../patron-profile-menu.service';
import { PatronProfileFeeComponent } from './patron-profile-fee.component';

describe('PatronProfileFeeComponent', () => {
  let component: PatronProfileFeeComponent;
  let fixture: ComponentFixture<PatronProfileFeeComponent>;
  let userService: UserService;
  let patronProfileMenuService: PatronProfileMenuService;

  const record = {
    metadata: {
      pid: '1',
      creation_date: '2021-02-02 12:00:00',
      type: 'fee-type',
      total_amount: 2.50,
      note: 'record note',
      document: {
        pid: '1',
        title: [{ type: 'bf:Title', _text: 'Document title' }]
      },
      loan: {
        transaction_date: '2021-03-02 12:00:00',
        item: {
          call_number: 'A123456'
        }
      }
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
        {
          metadata: {
            creation_date: '2021-02-02 12:00:00',
            type: 'subscription',
            subtype: 'sub',
            amount: '10',
            note: 'event note',
            library: {
              name: 'library name'
            }
          }
        }
      ]
    },
    links: {}
  };

  const userApiServiceSpy = jasmine.createSpyObj('UserApiService', ['getLoggedUser']);

  const patronTransactionEventsApiServiceSpy = jasmine.createSpyObj('PatronTransactionEventApiService', ['getEvents']);
  patronTransactionEventsApiServiceSpy.getEvents.and.returnValue(of(apiResponse));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PatronProfileFeeComponent,
        MainTitlePipe
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        CoreModule
      ],
      providers: [
        { provide: PatronTransactionEventApiService, useValue: patronTransactionEventsApiServiceSpy },
        { provide: UserApiService, useValue: userApiServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatronProfileFeeComponent);
    component = fixture.componentInstance;
    component.record = record;
    component.isCollapsed = false;
    component.expanded('1');
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
});
