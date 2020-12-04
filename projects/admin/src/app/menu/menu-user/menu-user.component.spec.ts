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
import { User, UserService } from '@rero/shared';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

import { MenuUserComponent } from './menu-user.component';

describe('MenuUserComponent', () => {
  let component: MenuUserComponent;
  let fixture: ComponentFixture<MenuUserComponent>;

  const user = new User({
    first_name: 'first',
    last_name: 'last'
  });
  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  userServiceSpy.user = user;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuUserComponent ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        BsLocaleService,
        { provide: UserService, useValue: userServiceSpy },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
