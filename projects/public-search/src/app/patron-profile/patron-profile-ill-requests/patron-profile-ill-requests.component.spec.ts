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
import { IllRequestApiService } from '../../api/ill-request-api.service';
import { PatronProfileMenuService } from '../patron-profile-menu.service';
import { PatronProfileService } from '../patron-profile.service';
import { PatronProfileIllRequestsComponent } from './patron-profile-ill-requests.component';

describe('PatronProfileIllRequestComponent', () => {
  let component: PatronProfileIllRequestsComponent;
  let fixture: ComponentFixture<PatronProfileIllRequestsComponent>;
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

  const userApiServiceSpy = jasmine.createSpyObj('UserApiService', ['getLoggedUser']);
  userApiServiceSpy.getLoggedUser.and.returnValue(of(testUserPatronWithSettings));

  const illRequestApiServiceSpy = jasmine.createSpyObj('IllRequestApiService', ['getPublicIllRequest']);
  illRequestApiServiceSpy.getPublicIllRequest.and.returnValue(of(apiResponse));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PatronProfileIllRequestsComponent ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: UserApiService, useValue: userApiServiceSpy },
        { provide: IllRequestApiService, useValue: illRequestApiServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    patronProfileService = TestBed.inject(PatronProfileService);
    fixture = TestBed.createComponent(PatronProfileIllRequestsComponent);
    component = fixture.componentInstance;
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

  it('should display loading in progress', () => {
    const loading = fixture.nativeElement.querySelectorAll('div')[5];
    expect(loading.textContent).toContain('Loading in progress');
  });

  it('should display the message no record', () => {
    patronProfileService.changeTab({ name: 'illRequest', count: 0 });
    fixture.detectChanges();
    const message = fixture.nativeElement.querySelectorAll('div')[5];
    expect(message.textContent).toContain('No ill request');
  });
});
