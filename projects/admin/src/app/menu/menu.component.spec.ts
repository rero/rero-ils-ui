/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CoreModule, TruncateTextPipe } from '@rero/ng-core';
import { MainTitlePipe, testUserPatronWithSettings, UserApiService, UserService } from '@rero/shared';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { of } from 'rxjs';
import { MenuComponent } from './menu.component';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let translate: TranslateService;
  let userService: UserService;

  const userApiServiceSpy = jasmine.createSpyObj('UserApiService', ['getLoggedUser']);
  userApiServiceSpy.getLoggedUser.and.returnValue(of(testUserPatronWithSettings));

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MenuComponent
      ],
      imports: [
        CoreModule,
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        BsLocaleService,
        MainTitlePipe,
        TruncateTextPipe,
        { provide: UserApiService, useValue: userApiServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    translate = TestBed.inject(TranslateService);
    userService = TestBed.inject(UserService);
    userService.load().subscribe();
    userService.user.currentOrganisation = testUserPatronWithSettings.patrons[1].organisation.pid;
    translate.use('en');
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
