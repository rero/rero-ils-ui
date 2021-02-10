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
import { of } from 'rxjs';
import { LoanApiService } from '../../api/loan-api.service';
import { UserService } from '../../user.service';
import { PatronProfileService } from '../patron-profile.service';
import { PatronProfileRequestsComponent } from './patron-profile-requests.component';


describe('PatronProfileRequestComponent', () => {
  let component: PatronProfileRequestsComponent;
  let fixture: ComponentFixture<PatronProfileRequestsComponent>;
  let patronProfileService: PatronProfileService;

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
            state: 'ITEM_AT_DESK'
          }
        }
      ]
    },
    links: {}
  };

  const loanApiServiceSpy = jasmine.createSpyObj('LoanApiService', ['getRequest']);
  loanApiServiceSpy.getRequest.and.returnValue(of(apiResponse));

  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  userServiceSpy.user = { pid: '1' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PatronProfileRequestsComponent ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: LoanApiService, useValue: loanApiServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    patronProfileService = TestBed.inject(PatronProfileService);
    fixture = TestBed.createComponent(PatronProfileRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the header and the loading in progress', () => {
    let headercolumn = fixture.nativeElement.querySelector(
      '#requests-section div:nth-child(1) div:nth-child(1) div:nth-child(1)');
    expect(headercolumn.textContent).toContain('Title');
    headercolumn = fixture.nativeElement.querySelector(
      '#requests-section div:nth-child(1) div:nth-child(1) div:nth-child(2)');
    expect(headercolumn.textContent).toContain('Pickup location');
    headercolumn = fixture.nativeElement.querySelector(
      '#requests-section div:nth-child(1) div:nth-child(1) div:nth-child(3)');
    expect(headercolumn.textContent).toContain('Status');
  });

  it('should display loading in progress', () => {
    const loading = fixture.nativeElement.querySelectorAll('div')[7];
    expect(loading.textContent).toContain('Loading in progress');
  });

  it('should display the message no record', () => {
    patronProfileService.changeTab({ name: 'request', count: 0 });
    fixture.detectChanges();
    const loading = fixture.nativeElement.querySelectorAll('div')[7];
    expect(loading.textContent).toContain('No request');
  });

  it('should display the list of records', () => {
    patronProfileService.changeTab({ name: 'request', count: 1 });
    fixture.detectChanges();
    const li = fixture.nativeElement.querySelectorAll('li');
    expect(li.length).toEqual(1);
  });
});
