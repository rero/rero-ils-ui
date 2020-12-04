/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CoreConfigService } from '@rero/ng-core';
import { IdAttributePipe, SharedModule, User, UserService } from '@rero/shared';
import { LibrarySwitchMenuService } from '../service/library-switch-menu.service';
import { MenuMobileComponent } from './menu-mobile.component';
import { SubMenuComponent } from './sub-menu/sub-menu.component';


describe('MenuMobileComponent', () => {
  let component: MenuMobileComponent;
  let fixture: ComponentFixture<MenuMobileComponent>;
  let translate: TranslateService;

  const user = new User({
    first_name: 'first',
    last_name: 'last',
    roles: ['system_librarian'],
    currentLibrary: 1
  });
  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  userServiceSpy.user = user;

  const configServiceSpy = jasmine.createSpyObj('CoreConfigService', ['']);
  configServiceSpy.languages = ['fr', 'de'];

  const librarySwitchMenuServiceSpy = jasmine.createSpyObj('LibrarySwitchMenuService', ['']);
  librarySwitchMenuServiceSpy._user = user;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MenuMobileComponent,
        SubMenuComponent
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        SharedModule
      ],
      providers: [
        IdAttributePipe,
        TranslateService,
        { provide: LibrarySwitchMenuService, useValue: librarySwitchMenuServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: CoreConfigService, useValue: configServiceSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    translate = TestBed.inject(TranslateService);
    translate.use('en');
    fixture = TestBed.createComponent(MenuMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
