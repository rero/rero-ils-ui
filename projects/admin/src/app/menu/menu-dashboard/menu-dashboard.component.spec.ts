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
import { TranslateModule } from '@ngx-translate/core';
import { IdAttributePipe, SharedModule, testUserPatronWithSettings, UserApiService, UserService } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { of } from 'rxjs';
import { MenuDashboardComponent } from './menu-dashboard.component';

describe('MenuDashboardComponent', () => {
  let component: MenuDashboardComponent;
  let fixture: ComponentFixture<MenuDashboardComponent>;
  let userService: UserService;

  const userApiServiceSpy = jasmine.createSpyObj('UserApiService', ['getLoggedUser']);
  userApiServiceSpy.getLoggedUser.and.returnValue(of(cloneDeep(testUserPatronWithSettings)));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuDashboardComponent],
      imports: [
        SharedModule,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        IdAttributePipe,
        { provide: UserApiService, useValue: userApiServiceSpy }
      ]
    })
    .compileComponents();
    userService = TestBed.inject(UserService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuDashboardComponent);
    component = fixture.componentInstance;
    userService.load();
    userService.user.currentLibrary = testUserPatronWithSettings.patrons[1].libraries[0].pid;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
