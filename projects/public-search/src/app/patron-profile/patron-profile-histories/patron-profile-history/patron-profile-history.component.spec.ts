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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CoreModule, RecordModule } from '@rero/ng-core';
import { ContributionFilterPipe, SharedModule, testUserPatronWithSettings, UserApiService, UserService } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { of } from 'rxjs';
import { PatronProfileMenuService } from '../../patron-profile-menu.service';
import { PatronProfileHistoryComponent } from './patron-profile-history.component';

describe('PatronProfileHistoryComponent', () => {
  let component: PatronProfileHistoryComponent;
  let fixture: ComponentFixture<PatronProfileHistoryComponent>;
  let translate: TranslateService;
  let userService: UserService;
  let patronProfileMenuService: PatronProfileMenuService;

  const record = {
    metadata: {
      pid: '1',
      date: '2021-10-13T13:38:44.979610+00:00',
      loan: {
        item: {
          document: {
            pid: '205',
            title: 'Remembrance'
          }
        }
      }
    }
  };

  const userApiServiceSpy = jasmine.createSpyObj('UserApiService', ['getLoggedUser']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PatronProfileHistoryComponent,
        ContributionFilterPipe
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        CoreModule,
        SharedModule,
        RecordModule
      ],
      providers: [
        { provide: UserApiService, useValue: userApiServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    translate = TestBed.inject(TranslateService);
    translate.use('en');
    fixture = TestBed.createComponent(PatronProfileHistoryComponent);
    component = fixture.componentInstance;
    component.isCollapsed = false;
    component.record = record;
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

  it('should display the document information button and link', () => {
    const link = fixture.nativeElement.querySelector('div.col-6');
    expect(link.textContent).toContain('Remembrance');
  });
});
