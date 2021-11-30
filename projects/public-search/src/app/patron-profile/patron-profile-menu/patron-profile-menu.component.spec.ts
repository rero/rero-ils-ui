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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testUserPatronMultipleOrganisationsWithSettings, testUserPatronWithSettings, UserApiService, UserService } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { of } from 'rxjs';
import { PatronProfileMenuService } from '../patron-profile-menu.service';
import { PatronProfileMenuComponent } from './patron-profile-menu.component';

describe('PatronProfileMenuComponent', () => {
  let component: PatronProfileMenuComponent;
  let fixture: ComponentFixture<PatronProfileMenuComponent>;
  let patronProfileMenuService: PatronProfileMenuService;
  let userService: UserService;

  const userApiServiceSpy = jasmine.createSpyObj('UserApiService', ['getLoggedUser']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatronProfileMenuComponent ],
      providers: [
        { provide: UserApiService, useValue: userApiServiceSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatronProfileMenuComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    userApiServiceSpy.getLoggedUser.and.returnValue(of(cloneDeep(testUserPatronWithSettings)));
    userService = TestBed.inject(UserService);
    userService.load().subscribe();
    patronProfileMenuService = TestBed.inject(PatronProfileMenuService);
    patronProfileMenuService.init();
    expect(component).toBeTruthy();
  });

  it('should not display the menu', () => {
    userApiServiceSpy.getLoggedUser.and.returnValue(of(cloneDeep(testUserPatronWithSettings)));
    userService = TestBed.inject(UserService);
    userService.load().subscribe();
    patronProfileMenuService = TestBed.inject(PatronProfileMenuService);
    patronProfileMenuService.init();
    fixture.detectChanges();
    expect(component.isVisible).toBeFalsy();
  });

  it('should display the menu', () => {
    userApiServiceSpy.getLoggedUser.and.returnValue(of(cloneDeep(testUserPatronMultipleOrganisationsWithSettings)));
    userService = TestBed.inject(UserService);
    userService.load().subscribe();
    patronProfileMenuService = TestBed.inject(PatronProfileMenuService);
    patronProfileMenuService.init();
    fixture.detectChanges();
    expect(component.isVisible).toBeTruthy();
    let option = fixture.nativeElement.querySelector('option:first-child');
    expect(option.textContent).toContain('Organisation 1');
    option = fixture.nativeElement.querySelector('option:last-child');
    expect(option.textContent).toContain('Organisation 2');
  });
});
