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
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CoreConfigService } from '@rero/ng-core';
import { IdAttributePipe, SharedModule, testUserLibrarianWithSettings, UserApiService, UserService } from '@rero/shared';
import { of } from 'rxjs';
import { LibrarySwitchMenuService } from '../service/library-switch-menu.service';
import { LibrarySwitchService } from '../service/library-switch.service';
import { MenuMobileComponent } from './menu-mobile.component';
import { SubMenuComponent } from './sub-menu/sub-menu.component';


describe('MenuMobileComponent', () => {
  let component: MenuMobileComponent;
  let fixture: ComponentFixture<MenuMobileComponent>;
  let translate: TranslateService;
  let userService: UserService;
  let librarySwitchMenuService: LibrarySwitchMenuService;
  let librarySwitchService: LibrarySwitchService;

  const userApiServiceSpy = jasmine.createSpyObj('UserApiService', ['getLoggedUser']);
  userApiServiceSpy.getLoggedUser.and.returnValue(of(testUserLibrarianWithSettings));

  const configServiceSpy = jasmine.createSpyObj('CoreConfigService', ['']);
  configServiceSpy.languages = ['fr', 'de'];

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
        { provide: UserApiService, useValue: userApiServiceSpy },
        { provide: CoreConfigService, useValue: configServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    librarySwitchMenuService = TestBed.inject(LibrarySwitchMenuService);
    librarySwitchMenuService.init();
    userService = TestBed.inject(UserService);
    userService.load();
    const currentLibrary = testUserLibrarianWithSettings.patrons[0].libraries[0].pid;
    userService.user.currentLibrary = currentLibrary;
    userService.user.currentOrganisation = testUserLibrarianWithSettings.patrons[0].organisation.pid;
    librarySwitchService = TestBed.inject(LibrarySwitchService);
    librarySwitchService.switch(currentLibrary);
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
