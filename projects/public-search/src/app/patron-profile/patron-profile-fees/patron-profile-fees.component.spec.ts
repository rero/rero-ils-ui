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
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '@rero/ng-core';
import { SharedModule, testUserPatronWithSettings, UserApiService, UserService } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { of } from 'rxjs';
import { PatronTransactionApiService } from '../../api/patron-transaction-api.service';
import { PatronProfileMenuService } from '../service/patron-profile-menu.service';
import { PatronProfileService } from '../service/patron-profile.service';
import { PatronProfileFeesComponent } from './patron-profile-fees.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

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
    declarations: [PatronProfileFeesComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [
      TranslateModule.forRoot(),
      SharedModule,
      CoreModule
    ],
    providers: [
        { provide: UserApiService, useValue: userApiServiceSpy },
        { provide: PatronTransactionApiService, useValue: patronTransactionApiServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideNoopAnimations()
    ]
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
    const div = fixture.nativeElement.querySelector('div > div > div > div:nth-child(1)');
    expect(div.textContent).toContain(12.50);
  });
});
