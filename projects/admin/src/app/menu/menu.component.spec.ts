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
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CoreModule, TruncateTextPipe } from '@rero/ng-core';
import { MainTitlePipe, User, UserService } from '@rero/shared';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { MenuComponent } from './menu.component';
import { LibrarySwitchMenuService } from './service/library-switch-menu.service';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let translate: TranslateService;

  const user = new User({
    first_name: 'first',
    last_name: 'last',
    currentOrganisation: 1,
    roles: ['system_librarian']
  });
  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  userServiceSpy.user = user;

  const librarySwitchMenuServiceSpy = jasmine.createSpyObj('LibrarySwitchMenuService', ['']);
  librarySwitchMenuServiceSpy._user = user;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MenuComponent
      ],
      imports: [
        CoreModule,
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule
      ],
      providers: [
        MainTitlePipe,
        TruncateTextPipe,
        BsLocaleService,
        { provide: UserService, useValue: userServiceSpy },
        { provide: LibrarySwitchMenuService, useValue: librarySwitchMenuServiceSpy }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    translate = TestBed.inject(TranslateService);
    translate.use('en');
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
